import { WebSocketServer } from 'ws';
import { parse } from 'url';

const initSocket = (server) => {
    const socketServer = new WebSocketServer({ noServer: true });

    socketServer.on('connection', function connection(ws) {
        const userRef = {
            socket: ws,
            lastActiveAt: Date.now()
        }
        global.users.add(userRef);

        let ip_address = ws._socket.remoteAddress;
        const p = ip_address.lastIndexOf(':')
        if (p !== -1) ip_address = ip_address.slice(p + 1)

        ws.on('error', console.error);
        ws.on('message', (req, isBinary) => {
            try {
                const origin = isBinary ? req : req.toString();
                console.log(origin);
            } catch (err) {
                console.log('Error parsing message!', err);
            }
        });
        ws.on('close', (code, reason) => {
            console.log(`User disconnected with code ${code} and reason ${reason}!`);
            global.users.delete(userRef);
        });
    });

    server.on('upgrade', function upgrade(request, socket, head) {
        const { pathname } = parse(request.url);

        if (pathname === '/ws') {
            socketServer.handleUpgrade(request, socket, head, function done(ws) {
                socketServer.emit('connection', ws, request);
            });
        }
    });
}

export default initSocket;
