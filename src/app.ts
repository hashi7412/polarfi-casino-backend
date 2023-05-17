import express from 'express';
import { createServer } from 'http';
import initSocket from './utils/Socket';

const app = express();

global.users = new Set();
global.chats = ['foo']

const init = async () => {
	app.get('/', (req, res) => {
		res.send("Hello World");
	})

	const server = createServer(app);

	await initSocket(server);

	server.listen(8080, () => {
		console.log(`Server running ${8080}`);
	});
}

init();
