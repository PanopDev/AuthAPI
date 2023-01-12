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

  refreshToken: String,

  verified: {
    type: Boolean,
    default: false,
  },
});


const userProfileSchema = new Schema({
  username: {
    type: String,
  },
  relationships: {
    type: { relationshipsSchema },
  },
  settings: {
    type: [],
  },
  photos: {
    type: [],
  },
});

const relationshipsSchema = new Schema({
    username: {
        type: String,
      },
    friends: [],
    blocked: [],
    openRequests: [],
    awaitingResponse: [],
    conversationID: [123,123,123,124],
    lastGroupMsgs:[{groupId:1223},{groupId:1223}]
  });

  module.exports = mongoose.model('user', userSchema);



// new message sent to server, message sent to database, find all users who are included in message,
// overwrite last msg object in their db that matches ID
