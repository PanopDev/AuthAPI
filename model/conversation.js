const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { UserProfile } = require('./user');

const conversationSchema = new Schema({
  users: { type: [String], required: true },
  settings: { type: Object },
  // messages: { type: [messageSchema], required:true },
  messages: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'message' }],
  lastMessage: { type: mongoose.SchemaTypes.ObjectId, ref: 'message' },
  createdAt: {
    type: String,
    default: () => new Date().toLocaleString(),
    immutable: true,
  },
  updatedAt: {
    type: Number,
  },
});
// ~~~~~~~~~~~~~~~~~~~~~ MIDDLEWARE ~~~~~~~~~~~~~~~~~~~~~
conversationSchema.pre('save', function (next) {
  const date = new Date();
  this.updatedAt = date.getTime();
  next()
});
//~~~~~~~~~~~~~~~~~~~~~~ STATICS ~~~~~~~~~~~~~~~~~~~~~~~~

conversationSchema.statics.checkForExisting = function (usersArray = []) {
  return this.findOne({
    $and: [
      { users: { $all: usersArray } },
      { users: { $size: usersArray.length } },
    ],
  });
};

//return all conversations for a user with last message populated
conversationSchema.statics.userConversations = async function (user) {
  const userConvos = await this.find({
    _id: { $in: user.conversations.allConversations },
  })
    .populate('lastMessage')
    .select('-messages')
    .sort({updatedAt:-1});

  return userConvos;
};
// return all messages for a conversaton by Id
conversationSchema.statics.getMessagesById = async function (id) {
  return await this.findById(id).populate('messages');
};

//~~~~~~~~~~~~~~~~~~~~~~ VIRTUALS ~~~~~~~~~~~~~~~~~~~~~~~~
conversationSchema.virtual('addNewMessage').set(async function (messageId) {
  this.messages.push(messageId);
});

module.exports = mongoose.model('conversation', conversationSchema);
