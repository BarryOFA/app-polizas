import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})
transporter.verify().then(() => {
  console.log('Ready for send emails')
})

const sendEmail = async (user) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Confirma tu email',
      html: `
                  <div>
                    <h1>Confirma tu email</h1>
                    <p>Para confirmar tu email has click en el siguiente enlace:</p>
                    <a href="http://localhost:5000/api/account/confirmed/${user.token}">Confirmar correo</a>
                  </div>
                `,
    })
    console.log('Email send')
  } catch (error) {
    console.log('Error sending email')
    console.log(error)
  }
}

export default sendEmail
