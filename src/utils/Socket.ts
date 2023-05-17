import { WebSocketServer } from 'ws';
import { parse } from 'url';

const initSocket = (server) => {
    const socketServer = new WebSocketServer({ noServer: true });

    socketServer.on('connection', function connection(ws) {
        let ip = ws._socket.remoteAddress;
        const p = ip.lastIndexOf(':')
        if (p !== -1) ip = ip.slice(p + 1)

        ws.on('error', console.error);
        ws.on('message', (req, isBinary) => {
            try {
                const origin = isBinary ? req : req.toString();
                console.log(origin);
                
            } catch (err) {
                console.log('Error parsing message!', err);
            }
        });
        ws.on('close', console.error);
    });

    server.on('upgrade', function upgrade(request, socket, head) {
        const { pathname } = parse(request.url);

        if (pathname === '/ws') {
            socketServer.handleUpgrade(request, socket, head, function done(ws) {
                console.log('WSS1 Connected');
                socketServer.emit('connection', ws, request);
            });
        }
    });
}

export default initSocket;
