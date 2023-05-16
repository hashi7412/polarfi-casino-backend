import WebSocket from 'ws';

const server = new WebSocket.Server({ port: 4125 });

const users = new Set();
let msgs = [];

const sendToUsers = () => {
	users.forEach((user) => {
		if (typeof user === 'object'
			&& 'socket' in user
			&& typeof user.socket === 'object'
			&& 'send' in user.socket
			&& typeof user.socket.send == 'function') {
				user.socket.send(JSON.stringify(msgs))
		}
	})
}

server.on('connection', (socket) => {

	console.log('New user is connected')

	const userRef = {
		socket: socket,
		lastActiveAt: Date.now()
	}
	users.add(userRef);

	socket.on('message', (data, isBinary) => {
		try {
			const msg = isBinary ? data : data.toString();
			if (msgs.length < 30) {
				msgs = [...msgs, msg]
			} else {
				msgs = [...msgs.slice(1, 30), msg]
			}
			sendToUsers();
		} catch (err) {
			console.log('Error parsing message!', err);
		}

		socket.on('close', (code, reason) => {
			console.log(`User disconnected with code ${code} and reason ${reason}!`);
			users.delete(userRef);
		})


	})
})

setInterval(() => {
	const now = Date.now();

	for (const user of users) {
		if (typeof user === 'object'
			&& 'lastActiveAt' in user
			&& typeof user.lastActiveAt === 'number'
			&& 'socket' in user
			&& typeof user.socket === 'object'
			&& 'close' in user.socket
			&& typeof user.socket.close == 'function') {
			if (user.lastActiveAt < now - 300000) {
				user.socket.close(4000, 'inactivity');
			}
		}
	}
}, 1000)
