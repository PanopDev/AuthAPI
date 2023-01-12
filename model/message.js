const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  groupId: {
    type: String,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
  settings: {
    type: Object,
  },
  messages: {
    type: [messageSchema],
    required: true,
  },
});

const messageSchema = new Schema({
  groupId: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  recipients: {
    type: [],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: [],
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

module.exports = {
  message: mongoose.model('message', messageSchema),
  group: mongoose.model('group', groupSchema),
};
