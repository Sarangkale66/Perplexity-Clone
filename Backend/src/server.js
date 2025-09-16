require("dotenv").config();
const app = require("./app");
const connectDB = require("./app/db/db");
const http = require("http");
const initSocket = require("./app/sockets/socket.server");
const httpServer = new http.createServer(app);
initSocket(httpServer);
connectDB();


const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log("server run on http://localhost:" + port);
})