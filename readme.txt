//////////////////////
// TASK DESCRIPTION //
//////////////////////

Chat UI

Implement a chat UI for mobile devices similar to e.g. Whatsapp or Facebook messenger. Mock the server calls, i.e. implement only the frontend(with tests).

You should implement the following views and navigation between them:

Chat list:
list chats in which you are participant (there can be multiple participants in a chat)
clicking an item in the chat list will take you to that chat's details view
Chat details view:
list all messages in the chat. Messages may contain text, emoticons & images.
functionality to send a new chat message
Technology constraints & considerations:

Use React or React native
You may use additional libraries, but if you do explain why you did
Include instructions how to run the app & tests. Include enough mock data for us to test your UI.
If using React, you might want to have look at the available boilerplate projects to get started, e.g. https://github.com/gaearon/react-hot-boilerplate

////////////////////
// IMPLEMENTATION //
////////////////////

The application is implemented for mobile only (although the functionality should work also on desktop). Tested only on my personal Nexus5 device with Chrome, however it should work on any modern browser.

Implemented features are:
- Thread list screen
  - Listing in order of most recent activity (last message sent/received, thread created)
  - Displays the thread's profile image in case it's group chat, partner's image otherwise
  - Displays the thread's name in case it's group chat, partner's name otherwise
  - Displays the amount of unread messages in the thread, if there is any
  - Displays the last message's delivery status if it's an outgoing one
  - Displays the last message's sending/arrival time, if there is any
  - Displays the beautified head / summary of the last message, if there is any
  - Filters threads based on displayed name
- Thread screen
  - Displays the thread's profile image in case it's group chat, partner's image otherwise
  - Displays the thread's name in case it's group chat, partner's name otherwise
  - Displays the amount of unread messages in a ribbon, if there is any
  - Displays messages in the order of arrival/sending time
  - Displaying sender profile picture and name for each individial message in case of group thread
  - Displays incoming / outgoing messages with different colors, aligned on different sides of the screen
  - Displays sending/arrival time
  - Displays delivery status of outgoing messages (sent / delivered / seen)
  - Displays beautified version of message text
  - Displays image attachment
  - Marks messages read when user message becomes fully visible or screen position gets below the message
  - Upon opening the screen, the thread scrolled to the bottom (marking all messages as seen)
  - Send textual/image messages
  - Auto-resizing textarea for editing the text, expanding to maximum 3 lines (maximum can be set dynamically)
  - Confirmation layover screen for images (with the option of cancelling)
- Message beautifier
  - Recognizes emojis (only ":)" smiley has been added, easy to add more...)
  - Recognizes urls
  - Recognizes line breaks
  - Items recognized either by the start/end of the text or when surrounded by whitespace, except newline, where the surrounding isn't mandatory
- Profile Image
  - With default value
- Time display
  - hh:mm format in case of same day, YYYY.mm.dd otherwise
- Message status indicator
  - single grey check in case of "sent"
  - double grey check in case of "delivered"
  - double blue check in case of "seen"
- Chatbot
  - Simulation of network latency
  - On each sent message, with slight delay, the message gets delivered and seen, and answered

Used technologies:
- React Hot Boilerplate
- Flux & Immutable (for distributing and storing data)
- classNames (generating css classes programmatically)
- md5 (generating unique hashes)
- Jest (for unit testing)
- Stylus (for generating CSS)
- Gulp (running stylus compiler with watch)

In order to try the app, please
1. unpack the zip
2. run "npm install"
3. run "gulp build:css"
4. run "npm start"
5. Connect to "http://<ip>:3000" with your phone

Unit tests created for:
- tests can be run by "npm test"
- stores
- filter logic on thread list screen
- sample tests for components
