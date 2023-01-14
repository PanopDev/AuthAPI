const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  profiles: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'userProfile',
    },
  ],

  refreshToken: String,
  verified: { type: Boolean, default: false },
});


const userConversationsSchema = new Schema({
  conversations: [{ type: mongoose.SchemaType.ObjectId, ref: 'conversation' }],
  allLastMsg: [],
  unread: [],
});


const userRelationshipsSchema = new Schema({
  friends: [String],
  blocked: [String],
  friendRequestsTo: [String],
  friendRequestsFrom: [String],
});

const userProfileSchema = new Schema({
  username: { type: String, required: true },
  relationships: { type: userRelationshipsSchema },
  conversations: { type: userConversationsSchema },
  settings: { type: {}, default: {} },
  photos: { type: {}, default: {} },
});

module.exports = {
  userRelationshipsSchema,
  userConversationsSchema,
  User: mongoose.model('User', userSchema),
  UserProfile: mongoose.model('userProfile', userProfileSchema),
};

// module.exports = {
//   User: mongoose.model('User', userSchema),
//   UserConversations: mongoose.model(
//     'userConversation',
//     userConversationsSchema
//   ),
//   UserRelationships: mongoose.model(
//     'userRelationship',
//     userRelationshipsSchema
//   ),
//   UserProfile: mongoose.model('userProfile', userProfileSchema),
// };

// new message sent to server, message sent to database, find all users who are included in message,
// overwrite last msg object in their db that matches ID
