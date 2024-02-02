import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import http from 'http'
import {Server} from 'socket.io'
const app=express()
const server=http.createServer(app)
const io=new Server(server,{
    cors: {
        origin: "*"
      }
})
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
))
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:true,limit:'16kb'}))
app.use(express.static('public'))
app.use(cookieParser())

import userRouter from './routes/users.routes.js'
import bloodrequestrouter from './routes/bloodrequest.routes.js'
import blooddonarrouter from './routes/bloodbank.routes.js'
import paymentRouter from './routes/payment.routes.js'
import eventRouter from './routes/event.routes.js'
app.use('/api/users',userRouter)
app.use('/api/blood-request',bloodrequestrouter)
app.use('/api/blood-donar',blooddonarrouter)
app.use('/api/order',paymentRouter)
app.use('/api/event',eventRouter)


io.on('connection', (socket) => {
    console.log('a user connected',socket.id);
    socket.on('update_status',(s)=>{
        console.log(s)
        io.emit('statuschange',true)
    })
    socket.on('ursf',()=>{
        io.emit('ursb',true)
    })
    socket.on('ddonarf',(d)=>{
        io.emit('ddonarb',d)
    })
    socket.on('dbrf',(did)=>{
        io.emit('dbrb',did)
    })
    socket.on('dcff',()=>{
        io.emit('dcfb','')
    })
    socket.on('nbrcff',()=>{
        io.emit('nbrcfb','')
    })
    socket.on('userdfr',(uid)=>{
        io.emit('userdfb',uid)
    })
    socket.on('tsff',()=>{
        io.emit('tsfb','')
    })
});

export {server}