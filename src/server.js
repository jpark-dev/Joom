import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const onSocketClose = () => {
  console.log("Disconnected from a User.");
};

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Annonymous";

  console.log("Connected to a User");

  socket.on("close", onSocketClose);
  socket.on("message", (msgObj) => {
    const message = JSON.parse(msgObj);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} >> ${message.payload}`));
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
      default:
        break;
    }
  });
  socket.send("Howdy! Welcome to zeipar's world!!");
});

server.listen(3000, handleListen);
