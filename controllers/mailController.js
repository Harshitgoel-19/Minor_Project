const nodemailer=require('nodemailer');

module.exports.sendEmail=(subject,mail,mesg)=>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'braxton.huels@ethereal.email',
            pass: 'n241Hb9E61FTafjpfk'
        }
    });
    transporter.sendMail({
        from: "Harshit Goel <harshitgoyal.1910@gmail.com>",
        to: mail,
        subject,
        text: mesg
    })
}