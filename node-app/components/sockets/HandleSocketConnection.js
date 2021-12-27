const SocketController = require("./SocketController");
const ConfigureChatRoutes = require("./routes/chat");
const ConfigureActionRoutes = require("./routes/action");

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

  /**
   * Log message on every message recieved.
   */
  socket.on('*', function (packet) {
    console.info(`⚡︎ SocketClient Message Recieved: [${socket.user.id} (${socket.id})] ${packet.data[0]}`);
  });
  
  socket.on('disconnect', function() {
    console.info(`⚡︎ SocketClient disconnected: ${socket.user.id} (${socket.id})`);
  })

  await ConfigureChatRoutes(socket, io);
  await ConfigureActionRoutes(socket, io);
};

module.exports = HandleSocketConnection;
