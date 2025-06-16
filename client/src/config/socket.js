import io from "socket.io-client";
const socket = io("http://localhost:3000");
socket.on("connect", () => {
  socket.on("receive-message", (data) => {
    console.log("message recieved: ", data);
    alert(`You received a message: ${data}`);
  });
});
export default socket;
