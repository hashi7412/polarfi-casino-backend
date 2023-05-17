import sendToUsers from "../../../utils/sendUsers";

const chatEndpoint = (ip, origin, ws, cookie) => {
    sendToUsers(global.chats);
    return true;
}

export default chatEndpoint;
