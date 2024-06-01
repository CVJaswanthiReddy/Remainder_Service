const express=require('express');

const bodyParser=require('body-parser');
const{PORT}=require('./config/server-config')
const { subscribeMessage, createChannel } = require('./utilis/messageQueue');
const TicketController = require('./controllers/ticket-controller');
const EmailService= require('./services/email-service')
const{REMAINDER_BINDING_KEY}= require('./config/server-config');

const jobs = require('./utilis/job');

const setupAndStartServer=async()=>{
    const app=express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    const channel= await createChannel();
    subscribeMessage(channel, EmailService.subscribeEvents, REMAINDER_BINDING_KEY)

    app.post('/api/v1/tickets', TicketController.create);
    app.listen(PORT,()=>{
        console.log(`server started at PORT ${PORT}`);


       // jobs();

      
        
    })
}

setupAndStartServer();