

async function createNewMessage(response,foundConversation, message) {
    try {
      foundConversation.addNewMessage = message;
      await foundConversation.save();
      foundConversation.lastMessage = foundConversation.getLastMessage;
      await foundConversation.save();

      console.log(foundConversation);
      return response.sendStatus(201);
    } catch (err) {
      console.error(err);
    }
  }

module.exports= { createNewMessage }