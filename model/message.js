const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  // conversationId: [{ type: mongoose.SchemaTypes.ObjectId, required: true }],
  sender: { type: String, required: true },
  recipients: { type: [String], required: true },
  message: { type: String, required: true },
  read: { type: [String], required: true },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString(),
    immutable: true,
  },
  time: {
    type: String,
    default: () => new Date().toLocaleTimeString(),
    immutable:true
  },
});

const conversationSchema = new Schema({
  users: { type: [String], required: true },
  settings: { type: Object },
  // messages: { type: [messageSchema], required:true },
  messages: { type: [messageSchema] },
  lastMessage:{type:{}},
  createdAt: {
    type: String,
    default: () => new Date().toLocaleString(),
    immutable: true,
  },
});

conversationSchema.statics.checkForExisting = function(usersArray = []){
return this.findOne({$and:[{users:{$all:usersArray}},{users:{$size:usersArray.length}} ] })
}
// conversationSchema.methods.newMessage = function(){


// }
conversationSchema.virtual('addNewMessage').set(
  async function(messageObj){
this.messages.push(messageObj)

  }
)

conversationSchema.virtual('getLastMessage').get(
  function(){
    return this.messages[this.messages.length - 1]
  }
)


module.exports = {
  messageSchema,
  Message: mongoose.model('message', messageSchema),
  Conversation: mongoose.model('conversation', conversationSchema),
};
