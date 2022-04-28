const socket = io("http://localhost:8000");

let form = document.getElementById("form");
let inputMsg = document.getElementById("inputMsg");
let logout = document.querySelector("button.logout");

function close_window() {
    if(confirm("Are you sure you want to leave? "))
        window.close();
}

logout.addEventListener("click", close_window);

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    let msg = inputMsg.value;
    printMessage(`You: ${msg}`, "right");
    socket.emit("send", msg);
    inputMsg.value = "";
});

function createSection(list)
{
    let section = document.querySelector(".section");
    section.innerHTML = "People in the Live chat";
    for(let i = 0; i<list.length; i++)
    {
        let box = document.createElement("div");
        box.classList.add("box");
        box.innerHTML = list[i].name;
        section.append(box);
    }
}

function printMessage(message, position) {
    let container = document.querySelector(".container");
    let box = document.createElement("div");
    box.innerHTML = message;
    box.classList.add(position);
    container.append(box);
} 

let name = prompt("Enter your name");
while(name == null || name == "")
name = prompt("Name can't be empty... Enter something!");

socket.emit("new-user-joined", name); 

socket.on("user-joined", data =>{
    createSection(data.list);
    printMessage(`${data.name} has joined the chat`, "left");
});

socket.on("receive", data =>{
    createSection(data.list);
    printMessage(`${data.name} : ${data.message}`, "left");
});

socket.on("left", data=>{
    createSection(data.list);
    printMessage(`${data.name} has left the chat`, "left");
});