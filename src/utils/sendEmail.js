import nodemailer from 'nodemailer'

async function sendEmail({ to=[], cc, bcc, subject, text, html, attachments=[] } = {}) {
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // send mail with define transport object
    let info = await transporter.sendMail({
        from: `"E-Commerce App" <${process.env.EMAIL}>`, // sender address
        to, // list of receivers
        cc,
        bcc,
        subject, // Subject line
        text, // plain text body
        html, // html body
        attachments,
    });

    // console.log(info);

    return info.rejected.length? false: true;
}

export default sendEmail;


