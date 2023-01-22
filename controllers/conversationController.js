const { Message, Conversation } = require('../model/message');
const { UserProfile, User } = require('../model/user');
const { createNewMessage } = require('./messageController');
function handlePostMessage() {}

function handleGetMessages() {}

async function handleNewConversation(req, res, next) {
  //check for required fields
  const body = req?.body;

  if (!body?.sender || typeof body?.sender !== 'string') {
    console.error('no sender, or not a string');
    return res.sendStatus(400);
  }

  if (!body?.recipients || !body?.recipients.push) {
    console.error('no recipients or recipients is not an array');
    return res.sendStatus(400);
  }

  if (!body?.message || typeof body?.message !== 'string') {
    console.error('no message or message is not a string');
    return res.sendStatus(400);
  }

  const conversationUsers = [...body.recipients, body.sender].sort();

  const messageObj = {
    sender: body.sender,
    recipients: body.recipients,
    message: body.message,
    read: [body.sender],
  };

  const conversationObj = {
    users: conversationUsers,
    messages: [messageObj],
    lastMessage: [messageObj],
  };

  const foundUsers = await UserProfile.findMultipleUsernames(
    conversationUsers
  );

  if (foundUsers.length !== conversationUsers.length) {
    //handle missing users issue
    return res
      .status(400)
      .json({ error: 'One or more users not found in DB, Aborted' });
  }

  const isExistingConversation = await Conversation.checkForExisting(
    conversationUsers
  );

  if (isExistingConversation) {
    return await createNewMessage(res, isExistingConversation, messageObj);
  }

  //create conversation
  const newConversation = await Conversation.create(conversationObj);
  addConversationIdtoUsers();

  async function addConversationIdtoUsers() {
    try {
      const updateMany = await UserProfile.addConversationId(
        conversationUsers,
        newConversation._id
      );
      console.log('UPDATE MANY!', updateMany);
    } catch (err) {
      console.log(err);
    }
  }

  res.sendStatus(200);
}

module.exports = {
  handlePostMessage,
  handleGetMessages,
  handleNewConversation,
};
