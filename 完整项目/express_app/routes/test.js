// 引入 nodemailer
var nodemailer = require('nodemailer');

// 创建一个SMTP客户端配置
const config = {
    host: "smtp.qq.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: '1404500798@qq.com',
        pass: 'jsjolrniekrrgggj'
    }
};

// 创建一个SMTP客户端对象
var transporter = nodemailer.createTransport(config);
var mail = {
    // 发件人
    from: '流觞曲水 <1404500798@qq.com>',
    // 主题
    subject: '测试',
    // 收件人
    to: '905748457@qq.com',
    // 邮件内容，HTML格式
    text: `尊敬的，您好！
    </br>您的验证码是123456
    </br> 为保障您的帐号安全，请在24小时内注册。 若如果您并未尝试注册，请忽略本邮件，由此给您带来的不便请谅解。本邮件由系统自动发出，请勿直接回复！`
    
};

// 发送邮件
transporter.sendMail(mail, function (error, info) {
    if (error) {
        return console.log(error);
    }
    console.log('mail sent:', info.response);
});