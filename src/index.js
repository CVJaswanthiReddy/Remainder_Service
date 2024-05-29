const express=require('express');

const bodyParser=require('body-parser');
const{PORT}=require('./config/server-config')
const{sendBasicEmail}= require('./services/email-service');
const setupAndStartServer=()=>{
    const app=express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));

    app.listen(PORT,()=>{
        console.log(`server started at PORT ${PORT}`);

        sendBasicEmail(
            'support@admin.com',
            'jaswanthireddy4@gmail.com',
            'this is a testing email',
            'hey hi how are you'
        )
    })
}

setupAndStartServer();