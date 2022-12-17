
/**
 * ConfigureSocketListener for SocketIO Connecitivty
 * 
 * Attaches a SocketIO listener to the server and waits for connection. This assumes
 * passport is configured on the server already and attempts to use the same passport
 * session data in order to authenticate the user.
 * 
 * Returns the instance. This can be used to send messages to the connected clients.
 */

const SocketIO = require('socket.io');
const SocketIOWildcard = require('socketio-wildcard')();
const JsonWebToken = require('jsonwebtoken');
const HandleSocketConnection = require("./HandleSocketConnection");
const SocketServerHandle = require('./SocketServerHandle');

async function ConfigureSocketListener(server)
{
    const io = SocketIO(server);
    io.use(SocketIOWildcard);

    io.use(function(socket, next){
        if (socket.handshake.query && socket.handshake.query.token){
            JsonWebToken.verify(socket.handshake.query.token, process.env.JSONWEBTOKEN_REFRESHTOKEN_SECRET, function(err, decoded) {
                if (err) return next(new Error('Authentication error'));
                socket.user = decoded;
                next();
            });
        }

        else {
            next(new Error('Authentication error'));
        }    
    });

    SocketServerHandle.SetSocketServerHandle(io);

    io.on('connect', function(socket) {
        HandleSocketConnection(socket, io);
    });

    return io;
}

module.exports = ConfigureSocketListener;