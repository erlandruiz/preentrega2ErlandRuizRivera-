import express from 'express';
import path from 'path';
import cartRouter from './routes/cart.router.js'
import productsRouter from './routes/products.router.js';
import morgan from 'morgan';
import { __dirname } from './path.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { engine } from 'express-handlebars';
import homeRouter from './routes/views.router.js';


import { Server } from "socket.io"; //socket.io 1



const app = express()

app.use(express.static(path.join(__dirname + '/public')))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))

app.engine('handlebars', engine());
app.set('views',path.join(__dirname + '/views'));
app.set('view engine', 'handlebars');


app.use('/api/carts', cartRouter);
app.use('/api/products', productsRouter);
app.use('/', homeRouter );



app.use(errorHandler);

const PORT = 8080

const httpServer =  app.listen(PORT,()=>{
    console.log(`SERVER IS RUNNING AT PORT NUMBER ${PORT}`)
})

console.clear()
const socketServer = new Server(httpServer); //socket.io 2

socketServer.on('connection',(socket)=>{
    console.log(`usuario conectado: ${socket.id}`);

    socket.on('disconnect', ()=>{
        console.log('Usuario Desconectado')
    })

    socket.emit('bienvenidoDesdeServer', `Hola bienvenido ${socket.id}`);

    socket.on('respuestaDesdeClient', (msgClient)=>{
        console.log(`Este mensaje es del cliente: ${msgClient}`)
    })
})