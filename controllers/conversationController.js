// const Conversation = require('../model/conversation');
// const { UserProfile, User } = require('../model/user');
const {UserProfile, User, Conversation} = require('../model/allSchemaExports')
const { createNewMessage } = require('./messageController');
const {lowerCaseArray} = require('../helpers/lowerCaseArray');
const throwErr = require('../helpers/throwErr');
function handlePostMessage() {}

function handleGetMessages() {}

async function handleNewConversation(req, res, next) {
  //check for required fields
  const body = req?.body;

  if (!body?.sender || typeof body?.sender !== 'string') {
    console.error();
    return throwErr('no sender, or not a string', 400, next )
  }

  if (!body?.recipients || !body?.recipients.push) {
    return throwErr('no recipients or recipients is not an array', 400, next );
  }

  if (!body?.message || typeof body?.message !== 'string') {
    return throwErr('no message or message is not a string', 400, next )
  }

  const recipients = lowerCaseArray(body.recipients)
  if(recipients.includes(body?.sender) ){
    return throwErr('cant include yourself in recipients', 400, next )
  }
  const conversationUsers = [...recipients, body.sender].sort();
 
  const messageObj = {
    sender: body.sender,
    recipients: recipients,
    message: body.message,
    read: [body.sender],
  };

  const conversationObj = {
    users: conversationUsers,
  };

  //added async await to method if something is not working in the near future
  try{
    const foundUsers = await UserProfile.findMultipleUsernames(conversationUsers);
    if (foundUsers.length !== conversationUsers.length) {
      //handle missing users issue
        return throwErr('One or more users not found in database, Aborted', 400, next )
    }

    //check if conversation exists
    const isExistingConversation = await Conversation.checkForExisting(
      conversationUsers
    );
  
    if (isExistingConversation) {
       const updatedConversation = await createNewMessage(isExistingConversation, messageObj, next);
       return res.status(200).json({data:updatedConversation})
    }

    //create conversation
    const newConversation = await Conversation.create(conversationObj);
    await UserProfile.addConversationId(
      conversationUsers,
      newConversation._id
    );
    const updatedConversation = await createNewMessage(newConversation, messageObj, next);
    return res.status(200).json({data:updatedConversation})

  }
  catch(err){
    return throwErr(err.message, 400, next )
  }
}

module.exports = {
  handlePostMessage,
  handleGetMessages,
  handleNewConversation,
};
