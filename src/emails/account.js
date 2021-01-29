const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'etnane@gmail.com',
        subject: `Welcome, ${name}`,
        text: `Welcome to the virtual api library, from postman!`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'etnane@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back soon`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail 
}