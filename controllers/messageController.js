const throwErr = require('../helpers/throwErr');
const Message = require('../model/message');

async function createNewMessage(
  foundConversation = { _id: '' },
  message = {},
  next
) {
  if (
    !foundConversation ||
    !foundConversation._id ||
    !message.sender ||
    !message.recipients ||
    !message.message
  ) {
    if(!next){ throw new Error('Missing arguments in createNewMessage function') }
    return throwErr(
      'missing arguments in createNewMessage function',
      400,
      next
    );
  }


  message.conversation = foundConversation._id;
  const newMessage = await Message.create(message);
  foundConversation.addNewMessage = newMessage._id;
  foundConversation.lastMessage = newMessage._id;
  console.log('foundConversation', foundConversation);
  console.log('new message', newMessage);
  return await foundConversation.save();
}

module.exports = { createNewMessage };
