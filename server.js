const config = require("./credential.json");
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
      sendAll(publicMsg);
    } else {
      clientsMngr.username[index] = message;
      console.log(clientsMngr.username[index]);
    }
  });

  ws.on("close", () => {
    var index = getClientIndex(ws, clientsMngr);
    closeClient(index, clientsMngr);
    rescanClient(clientsMngr);
  });

  rescanClient(clientsMngr);
  ws.send("State your username");
});

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
  console.log("User id %s close", user.id[index]);
  user.wsClient.splice(index, 1);
  user.id.splice(index, 1);
  user.length--;
}

function rescanClient(user) {
  console.log("Total User % ", user.length);
  for (var i = 0; i < user.length; i++) {
    console.log("User id %s", user.id[i]);
  }
}

function sendAll(message) {
  for (var i = 0; i < clientsMngr.length; i++) {
    clientsMngr.wsClient[i].send(message);
  }
}

console.log("Server running on port %s.", config.port);
