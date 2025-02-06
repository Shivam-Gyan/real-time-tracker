
import express from 'express'
import http from 'http'
import path from 'path';

import {Server} from 'socket.io';

const PORT=8000;

// http 
const app=express();

//It wraps the Express app inside an HTTP server, enabling it to handle both HTTP and WebSocket connections
const server=http.createServer(app);

const io=new Server(server);

// setting the viewpoint as ejs(embedded javascript) server side rendering
app.set("view engine","ejs");

// setting the public folder as a ststic folder for server side rendering
app.use(express.static(path.join(process.cwd(),'public')));

io.on("connection",(socket)=>{

    // receiving the emitted lattitude and longitude
    socket.on("send-location",(data)=>{
        io.emit("receive-location", {id:socket.id,...data})
    })
    
    // if user discconnet remove its marker from map
    socket.on('disconnect',()=>{
        io.emit("user-disconnect",socket.id)
    })
    console.log('user : '+socket.id)
})

app.get('/',(req,res)=>{
    res.render('index');
})


server.listen(PORT,()=>{
    console.log("server stared at port no. "+PORT)
});