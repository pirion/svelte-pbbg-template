const SocketController = require("./SocketController");
const ChatSocketRouter = require("./routes/ChatSocketRouter");
const GameSocketRouter = require("./routes/GameSocketRouter");
const DefaultSocketRouter = require("./routes/DefaultSocketRouter");
const { StateCollection } = require("./StateCollection");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

async function HandleSocketConnection(socket, io) {
  
  /**
   * New Connection Handling
   */
  console.info(`⚡︎ SocketClient connected: ${socket.user.id} (${socket.id})`);
  SocketController.RegisterSocket(socket);

  StateCollection.AddSocketConnection(socket.user.id, socket);

  /**
   * Log message on every message recieved.
   */
  socket.on('*', function (packet) {
    console.info(`⚡︎ SocketClient Message Recieved: [${socket.user.id} (${socket.id})] ${packet.data[0]}`);
  });
  
  socket.on('disconnect', function() {
    console.info(`⚡︎ SocketClient disconnected: ${socket.user.id} (${socket.id})`);
  })

  await DefaultSocketRouter(socket, io);
  await ChatSocketRouter(socket, io);
  await GameSocketRouter(socket, io);
};

module.exports = HandleSocketConnection;
