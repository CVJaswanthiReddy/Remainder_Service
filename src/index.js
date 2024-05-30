const express=require('express');

const bodyParser=require('body-parser');
const{PORT}=require('./config/server-config')
const{createChannel}= require('./config/server-config');
const TicketController = require('./controllers/ticket-controller');

const cron = require('node-cron');
const jobs = require('./utilis/job');
const m= require('./models/notificationticket')

//const{sendBasicEmail}= require('./services/email-service');
const setupAndStartServer=async()=>{
    const app=express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    //const channel= await createChannel();
    app.post('/api/v1/tickets', TicketController.create);
    app.listen(PORT,()=>{
        console.log(`server started at PORT ${PORT}`);


       // jobs();

      // console.log(m());
        // sendBasicEmail(
        //     'support@admin.com',
        //     'jaswanthireddy4@gmail.com',
        //     'this is a testing email',
        //     'hey hi how are you'
        // )

        
    })
}

setupAndStartServer();