const sender = require('../config/email-config');
const TicketRepository = require('../repository/ticket-repository');
const amqp= require('amqplib')
const {MESSAGE_BROKER_URL}=require('../config/server-config');
const repo = new TicketRepository();

const sendBasicEmail = async (mailFrom, mailTo, mailSubject, mailBody) => {
    try {
        const response = await sender.sendMail({
            from: mailFrom,
            to: mailTo,
            subject: mailSubject,
            text: mailBody
        });
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

const fetchPendingEmails = async (timestamp) => {
    try {
        const response = await repo.get({status: "PENDING"});
        return response;
    } catch (error) {
        console.log(error);
    }
}

const updateTicket = async (ticketId, data) => {
    try {
        const response = await repo.update(ticketId, data);
        return response;
    } catch (error) {
        console.log(error);
    }
}


const createNotification = async (data) => {
    try {
        console.log(data);
        const response = await repo.create(data);
        return response;
    } catch (error) {
        console.log(error);
    }
}

const subscribeEvents = async (payload) => {
    let service = payload.service;
    let data = payload.data;
    switch(service) {
        case 'CREATE_TICKET':
            await createNotification(data);
            break;
        case 'SEND_BASIC_MAIL':
            await sendBasicEmail(data.mailFrom, data.mailTo, data.mailSubject, data.mailBody);
            break;
        default: 
            console.log('No valid event received');
            break;
    }
}

// RabbitMQ consumer setup
const startConsumer = async () => {
    const connection = await amqp.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    channel.assertQueue('emailQueue', { durable: true });

    channel.consume('emailQueue', async (msg) => {
        if (msg !== null) {
            const emailData = JSON.parse(msg.content.toString());
            await sendBasicEmail(emailData.mailFrom, emailData.mailTo, emailData.mailSubject, emailData.mailBody);
            channel.ack(msg);
        }
    });
};




module.exports = {
    sendBasicEmail,
    fetchPendingEmails,
    createNotification,
    updateTicket,
    subscribeEvents,
    startConsumer
    
}


/**
 * SMTP -> a@b.com
 * receiver-> d@e.com
 * 
 * from: support@noti.com
 */
