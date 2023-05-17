const sendToUsers = (msg) => {
    global.users.forEach((user: { socket: { send: (arg0: string) => void; }; }) => {
        if (typeof user === 'object'
            && 'socket' in user
            && typeof user.socket === 'object'
            && 'send' in user.socket
            && typeof user.socket.send == 'function') {
            user.socket.send(JSON.stringify(msg))
        }
    })
}

export default sendToUsers;