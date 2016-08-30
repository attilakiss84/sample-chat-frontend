import { MessageStatus } from '../constants';

var messages = [];
var threadIds = ["c9b3be03", "06db7dd8", "e4f67825", "dda17714", "e59b9196"];

function addMessage(senderId, amount = 1) {
  for (let i = 1; i <= amount; i += 1) {
    messages.push({
      id: (messages.length + 1) + '',
      threadId: threadIds[senderId - 1],
      senderId: senderId + '@unity3d.im',
      image: '',
      text: ':) really-really long emoji-improved:) :) Test message http://google.com' + "\n" + '123' + "\r\n" + (messages.length + 1) + ' :)',
      time: new Date().getTime(),
      status: MessageStatus.DELIVERED
    });
  }
}

for (let i = 1; i < 6; i += 1) {
  addMessage(i, 10);
}

export default messages;
