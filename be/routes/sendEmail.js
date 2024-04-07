const express = require('express');
const email = express.Router();
const { createTransport } = require('nodemailer');

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
    }
});

email.post('/sendEmail', async (req, res) => {
    const { recipient, subject, text } = req.body
    const mailOptions = {
        from: 'noreplay@example.com',
        to: recipient,
        subject,
        html: '<p><strong>STRONG</strong></p>',
        text
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return res.status(403).send({
                message: 'Ops qualcosa è andato storto'
            })
        } else {
            console.log('email inviata')
            res.send('Email sent successfully')

        }
    })
})

module.exports = email