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

wss.on("connection", (socket) => {
  console.log("Connected to a User");
  socket.on("close", onSocketClose);
  socket.on("message", (message) => {
    const encodedMsg = message.toString("utf-8");
    socket.send(encodedMsg);
  });
  socket.send("Howdy! Welcome to zeipar's world!!");
});

server.listen(3000, handleListen);
