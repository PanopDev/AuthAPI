const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  conversationId: [ { type: mongoose.SchemaTypes.ObjectId, required: true } ] ,
  sender: { type: String, required: true },
  recipients: { type: [String], required: true },
  message: { type: String, required: true },
  read: { type: [String], required: true },
  timestamp: { type: String, required: true },
});

const conversationSchema = new Schema({
  users: { type: [String], required: true },
  settings: { type: Object },
  messages: [messageSchema],
});

module.exports = {
  messageSchema,
  messageModel: mongoose.model('message', messageSchema),
  conversation: mongoose.model('conversation', conversationSchema),
};
