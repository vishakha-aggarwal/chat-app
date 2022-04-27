let express = require("express");
let socket = require("socket.io");

let app = express();
let port = process.env.PORT || 8000;

let server = app.listen(port, ()=>{
    console.log("Listening at port: ", port);
})

let io = socket(server);

const users = {};
let list = [];

io.on('connection', socket=>{
    socket.on("new-user-joined", name =>{
        users[socket.id] = name;
        let data = {"id" : socket.id, "name": name};
        list.push(data);
        socket.emit("user-joined", {name: name, list: list});
        socket.broadcast.emit("user-joined", {name: name, list: list});
    });

    socket.on("send", message => {
        socket.broadcast.emit("receive", { message: message, name: users[socket.id], list:list});
    });

    socket.on("disconnect", () => {
        let data = {"id" : socket.id, "name": users[socket.id]};
        const index = list.indexOf(data);
        list.splice(index, 1);
        socket.broadcast.emit("left", {name: users[socket.id], list: list});
        delete users[socket.id];
    });
})
