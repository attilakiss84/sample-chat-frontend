import ApplicationActionCreator from '../action_creators/ApplicationActionCreator';
import ThreadActionCreator from '../action_creators/ThreadActionCreator';
import ProfileActionCreator from '../action_creators/ProfileActionCreator';
import MessageActionCreator from '../action_creators/MessageActionCreator';

import MessageStore from '../stores/MessageStore';
import ThreadStore from '../stores/ThreadStore';

import sampleProfiles from '../sample_data/sampleProfiles';
import sampleThreads from '../sample_data/sampleThreads';
import sampleMessages from '../sample_data/sampleMessages';

import { MessageStatus } from '../constants';

const sampleUser = '358449216979@unity3d.im';
const sampleUrls = [
  'https://facebook.github.io/react/',
  'https://facebook.github.io/flux/',
  'http://stylus-lang.com/',
  'https://github.com/JedWatson/classnames',
  'https://facebook.github.io/immutable-js/',
  'http://gulpjs.com/',
  'https://github.com/pvorb/node-md5'
];
const sampleImages = [
  '/static/image_chuck_norris.png',
  '/static/image_nyan_cat.png'
];

var connected = false;
var firstTimeConnected = true;
var threadsToFollow = {};
var replyCount = 1;

function loadSampleData() {
  sampleProfiles.forEach((profile) => {
    ProfileActionCreator.addOrUpdateProfile(profile);
  });

  // console.log('SAMPLE PROFILES LOADED');

  sampleThreads.forEach((thread) => {
    ThreadActionCreator.createThread(thread.participants, thread.isGroup, thread.name, thread.profileImageUrl);
  });

  // console.log('SAMPLE THREADS LOADED');

  sampleMessages.forEach((message) => {
    MessageActionCreator.addSampleMessage(message);
  });

  // console.log('SAMPLE MESSAGES LOADED');
}

function randomizeNetworkLatency() {
  var latency = Math.floor((Math.random()) * 1000 % 300);
  // console.log('Network latency: ' + latency);
  return latency;
}

function randomizeCheckTime() {
  var latency = Math.floor(2000 + ((Math.random() * 10000) % 3000));
  // console.log('View time latency: ' + latency);
  return latency;
}

function randomizeReplyTime() {
  var latency = Math.floor(1000 + ((Math.random() * 10000) % 1000));
  // console.log('Reply time latency: ' + latency);
  return latency;
}

function sendReply(threadId) {
  var thread = ThreadStore.getThread(threadId);
  var availableSenders = thread.participants.filter(participant => participant !== sampleUser);
  var senderId = availableSenders[parseInt((Math.random() * 100) % availableSenders.length, 10)];
  var text = 'This is Replybot\'s message no. ' + replyCount + ' :)';
  var image;

  if (Math.floor((Math.random() * 10) % 2)) {
    text += "\nFeel free to check out a technology my creator used to implement this app: " + sampleUrls[Math.floor((Math.random() * 100) % sampleUrls.length)] + "\n\nEnjoy!";
  }
  if (Math.floor((Math.random() * 10) % 2)) {
    image = sampleImages[Math.floor((Math.random() * 10) % sampleImages.length)];
  }

  deliverMessage(threadId, MessageActionCreator.sendMessage(threadId, senderId, text, image));
  replyCount += 1;
}

function deliverMessage(threadId, messageId) {
  MessageActionCreator.setMessageStatus(threadId, messageId, MessageStatus.DELIVERED);
}

function viewMessages(threadId) {
  delete threadsToFollow[threadId];

  MessageStore.getThread(threadId).forEach((message) => {
    if (message.senderId !== sampleUser || message.status !== MessageStatus.DELIVERED) {
      return;
    }

    MessageActionCreator.setMessageStatus(threadId, message.id, MessageStatus.SEEN);
  });

  window.setTimeout(() => sendReply(threadId), randomizeReplyTime());
}

class ConnectionHelper {
  constructor() {
    ApplicationActionCreator.setUser(sampleUser);

    // console.log('SAMPLE USER (' + sampleUser + ') LOADED');
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (connected) {
        resolve();
        return;
      }

      window.setTimeout(() => {
        connected = true;

        if (firstTimeConnected) {
          loadSampleData();
          firstTimeConnected = false;
        }

        resolve();
      }, randomizeNetworkLatency());
    });
  }

  sendMessage(threadId, text, image) {
    return new Promise((resolve, reject) => {
      if (!connected) {
        reject();
      }

      window.setTimeout(() => {
        var messageId = MessageActionCreator.sendMessage(threadId, sampleUser, text, image);

        window.setTimeout(() => {
          deliverMessage(threadId, messageId);

          if (!threadsToFollow[threadId]) {
            threadsToFollow[threadId] = window.setTimeout(() => {
              viewMessages(threadId);
            }, randomizeCheckTime());
          }
        }, randomizeNetworkLatency());

        resolve();
      }, randomizeNetworkLatency());
    });
  }

  setMessageStatus(threadId, messageId, status) {
    if (status === MessageStatus.SEEN) {
      // console.log('Marking message (' + messageId + ') seen');
    }

    return new Promise((resolve, reject) => {
      window.setTimeout(
        () => {
          MessageActionCreator.setMessageStatus(threadId, messageId, status);
          resolve();
        },
        randomizeNetworkLatency()
      );
    });
  }

  disconnect() {
    connected = false;
  }
}

const instance = new ConnectionHelper();
export default instance;
