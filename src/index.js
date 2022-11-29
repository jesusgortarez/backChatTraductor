require('./database');
require('dotenv').config();
const socket = require("socket.io");


const app = require('./app');
async function main(){
	
	const server = app.listen(app.get('port'), () =>
	  console.log(`Servidor iniciado en`,app.get('port'))
	)
	const io = socket(server, {
	  cors: {
		origin: "*",
		//origin: "http://localhost:3000",
		credentials: true,
	  },
	});

	global.onlineUsers = new Map();
	io.on("connection", (socket) => {
	  global.chatSocket = socket;
	  socket.on("add-user", (userId) => {
		onlineUsers.set(userId, socket.id);
	  });

	  socket.on("send-msg", (data) => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
		  socket.to(sendUserSocket).emit("msg-recieve", data.msg);
		}
	  });
	});

}
main();