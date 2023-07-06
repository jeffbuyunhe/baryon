const nodemailer = require("nodemailer")
const handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")

exports.send = async (toEmail, subject, data, templateName) => {
    try {
        const client = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_HOST_USER,
                pass: process.env.EMAIL_HOST_PASSWORD,
            },
            logger: true,
        })

        const template = fs.readFileSync(path.join(__dirname, `./templates/${templateName}.handlebars`), "utf8")
        const email = handlebars.compile(template)

        await client.sendMail({
                from: process.env.EMAIL_HOST_USER,
                to: toEmail,
                subject: subject,
                html: email(data),
            }, (err, info) => err? err : info
        )
    } catch (err) {
        console.log('There was an error sending the email!', err)
        return err
    }
}