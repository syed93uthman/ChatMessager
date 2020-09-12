const config = require("./credential.json");
const express = require("express");
const app = express();

const path = require("path");

const ws = require("ws").Server,
  chatServer = new ws({ port: config.port });
var wsClient = [];
var id = [];
var username = [];
var length = 0;
var clientsMngr = {
  wsClient,
  id,
  length,
  username,
};
var uniqid = require("uniqid");

app.use(express.static(path.join(__dirname, "public")));

chatServer.on("connection", function (ws) {
  clientsMngr.wsClient.push(ws);
  clientsMngr.id.push(uniqid());
  clientsMngr.username.push();
  clientsMngr.length++;

  ws.on("message", function (message) {
    var index = getClientIndex(ws, clientsMngr);
    if (clientsMngr.username[index]) {
      //console.log("%s : %s", clientsMngr.username[index], message);
      const msg = message;
      const user = clientsMngr.username[index];
      const publicMsg = user + " : " + msg;
      broadcast(publicMsg, user);
    } else {
      clientsMngr.username[index] = message;

      const user = clientsMngr.username[index];
      const publicMsg = user + " is join chatroom.";
      console.log(publicMsg);
      broadcast(publicMsg, user);
    }
  });

  ws.on("close", () => {
    var index = getClientIndex(ws, clientsMngr);
    var user = closeClient(index, clientsMngr);
    const publicMsg = user + " exit chatroom.";
    broadcast(publicMsg, user);
    //rescanClient(clientsMngr);
  });

  //rescanClient(clientsMngr);
  ws.send("User in chatroom.");
  listAllClient(ws);
  ws.send("State your username");
});

function listAllClient(ws) {
  var name = [];
  for (var i = 0; i < clientsMngr.length; i++) {
    var user = clientsMngr.username[i];
    if (user) {
      name.push(user);
    }
  }
  if (name) {
    for (var i = 0; i < name.length; i++) {
      ws.send(name[i]);
    }
  } else {
    ws.send("Empty ChatRoom");
  }
}

function getClientIndex(ws, user) {
  var index;
  for (var i = 0; i < user.length; i++) {
    if (user.wsClient[i] == ws) {
      index = i;
      break;
    }
  }
  return index;
}

function closeClient(index, user) {
  var name = user.username[index];
  console.log("%s exit the chat", name);
  user.wsClient.splice(index, 1);
  user.id.splice(index, 1);
  user.username.splice(index, 1);
  user.length--;
  return name;
}

function rescanClient(user) {
  console.log("Total User % ", user.length);
  for (var i = 0; i < user.length; i++) {
    console.log("User id %s", user.id[i]);
  }
}

function broadcast(message, except) {
  for (var i = 0; i < clientsMngr.length; i++) {
    if (clientsMngr.username[i] != except) {
      clientsMngr.wsClient[i].send(message);
    }
  }
}

app.listen(config.portPost);
console.log("Server running on port %s.", config.port);
