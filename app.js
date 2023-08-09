// @ts-nocheck
const notificationSound = document.getElementById('notification-sound');
const johnSelectorBtn = document.querySelector('#john-selector');
const janeSelectorBtn = document.querySelector('#jane-selector');
const chatHeader = document.querySelector('.chat-header');
const chatMessages = document.querySelector('.chat-messages');
const chatInputForm = document.querySelector('.chat-input-form');
const chatInput = document.querySelector('.chat-input');
const clearChatBtn = document.querySelector('.clear-chat-button');

const messages = JSON.parse(localStorage.getItem('messages')) || [];

let newMessageCounts = {
  'Kleindy Duterte': 0,
  'Angelica May Yap': 0,
};

const updateNotificationCount = () => {
  johnSelectorBtn.innerText = `Kleindy Duterte (${newMessageCounts['Kleindy Duterte']})`;
  janeSelectorBtn.innerText = `Angelica May Yap (${newMessageCounts['Angelica May Yap']})`;
};

const playNotificationSound = () => {
  notificationSound.play();
};

const receiveMessage = (sender) => {
  if (sender !== messageSender) {
    newMessageCounts[sender] += 1;
    updateNotificationCount();
    playNotificationSound();
  }
};

const createChatMessageElement = (message) => `
  <div class="message ${message.sender === 'Kleindy Duterte' ? 'blue-bg' : 'gray-bg'}">
    <div class="message-sender">${message.sender}</div>
    <div class="message-text">${message.text}</div>
    <div class="message-timestamp">${message.timestamp}</div>
  </div>
`;

window.onload = () => {
  messages.forEach((message) => {
    chatMessages.innerHTML += createChatMessageElement(message);
  });
};

let messageSender = 'Kleindy Duterte';

const updateMessageSender = (name) => {
  messageSender = name;
  chatHeader.innerText = `${messageSender} chatting...`;
  chatInput.placeholder = `Type here, ${messageSender}...`;

  if (name === 'Kleindy Duterte') {
    johnSelectorBtn.classList.add('active-person');
    janeSelectorBtn.classList.remove('active-person');
  }
  if (name === 'Angelica May Yap') {
    janeSelectorBtn.classList.add('active-person');
    johnSelectorBtn.classList.remove('active-person');
  }

  /* auto-focus the input field */
  chatInput.focus();
  newMessageCounts[name] = 0;
  updateNotificationCount();
};

johnSelectorBtn.onclick = () => updateMessageSender('Kleindy Duterte');
janeSelectorBtn.onclick = () => updateMessageSender('Angelica May Yap');

const sendMessage = (e) => {
  e.preventDefault();

  const timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  const message = {
    sender: messageSender,
    text: chatInput.value,
    timestamp,
  };

  /* Save message to local storage */
  messages.push(message);
  localStorage.setItem('messages', JSON.stringify(messages));

  /* Add message to DOM */
  chatMessages.innerHTML += createChatMessageElement(message);

  /* Clear input field */
  chatInputForm.reset();

  /* Scroll to bottom of chat messages */
  chatMessages.scrollTop = chatMessages.scrollHeight;

  /* Notify the other person about the new message */
  const receiver = messageSender === 'Kleindy Duterte' ? 'Angelica May Yap' : 'Kleindy Duterte';
  receiveMessage(receiver);
};

chatInputForm.addEventListener('submit', sendMessage);

clearChatBtn.addEventListener('click', () => {
  localStorage.clear();
  chatMessages.innerHTML = '';
});
