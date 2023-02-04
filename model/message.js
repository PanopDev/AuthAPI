const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  // conversationId: [{ type: mongoose.SchemaTypes.ObjectId, required: true }],
  conversation: { type: mongoose.SchemaTypes.ObjectId, ref: 'conversation' },
  sender: { type: String, required: true },
  recipients: { type: [String], required: true },
  message: { type: String, required: true },
  read: { type: [String], required: true },
  date: {
    type: String,
    default: () => new Date().toLocaleString(),
    immutable: true,
  },
  sortableDate: {
    type: Number,
    default:()=>{
      const date = new Date();
      return date.getTime()
    }
  },
});

// messageSchema.pre('save', function (next) {
//   const date = new Date();
//   this.updatedAt = date.getTime();
//   next()
// });

module.exports = mongoose.model('message', messageSchema);
