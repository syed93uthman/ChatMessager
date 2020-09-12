const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

var socket = new WebSocket("ws://localhost:8000");

const name = prompt("What is your name?");
appendMessage("You joined");

try {
  socket.send(name);
} catch (error) {
  socket.onopen = () => socket.send(name);
}

//const websocket = ws();
// // Get username and room from URL
// const { username, room } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });

// const socket = io();

// // Join chatroom
// socket.emit("joinRoom", { username, room });

// // Get room and users
// socket.on("roomUsers", ({ room, users }) => {
//   outputRoomName(room);
//   outputUsers(users);
// });

// // Message from server
// socket.on("message", (message) => {
//   console.log(message);
//   outputMessage(message);

//   // Scroll down
//   chatMessages.scrollTop = chatMessages.scrollHeight;
// });

socket.addEventListener("message", function (message) {
  appendMessage(message.data);
});

// // Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server;

  socket.send(msg);
  const personal = "You : " + msg;
  appendMessage(personal);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// // Output message to DOM
// function outputMessage(message) {
//   const div = document.createElement("div");
//   div.classList.add("message");
//   const p = document.createElement("p");
//   p.classList.add("meta");
//   p.innerText = message.username;
//   p.innerHTML += `<span>${message.time}</span>`;
//   div.appendChild(p);
//   const para = document.createElement("p");
//   para.classList.add("text");
//   para.innerText = message.text;
//   div.appendChild(para);
//   document.querySelector(".chat-messages").appendChild(div);
// }

// // Add room name to DOM
// function outputRoomName(room) {
//   roomName.innerText = room;
// }

// // Add users to DOM
// function outputUsers(users) {
//   userList.innerHTML = "";
//   users.forEach((user) => {
//     const li = document.createElement("li");
//     li.innerText = user.username;
//     userList.appendChild(li);
//   });
// }

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  chatMessages.append(messageElement);
}
