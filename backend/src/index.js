import {server} from './app.js'
import dotenv from 'dotenv'
import dbconnect from './db/index.js'
dotenv.config({
    path:'./env'
})
dbconnect()
.then(()=>{
    server.listen(process.env.PORT||5000,()=>{
        console.log('server is listen at port',process.env.PORT||5000)
    })
    
})
.catch((err)=>{
    console.log('mongodb connection error',err)
})
