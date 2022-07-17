var express = require('express');
var router = express.Router();
const query = require('../db/db')
const common = require('../lib/common')
const nodemailer = require('nodemailer');
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const upload = multer({ dest: __dirname + '/../uploads' })


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
const transporter = nodemailer.createTransport(config);

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
//vip登录
router.post('/viplogin', (req, res, next) => {
    let { user_no, password, date } = req.body
    let sql = "select * from vipuser where user_no='" + user_no + "'"
    let sql2 = "update vipuser set date=? where user_no=?";
    query(sql, (err, result) => {
        if (err) {
            res.json({ flag: false, msg: "登录失败" })
        } else if (result.length == 0) {
            res.json({ flag: false, msg: "不存在此账号" })
        } else if (result[0]['password'] != common.md5(password)) {
            res.json({ flag: false, msg: "密码不正确" })
        } else {
            res.cookie('user_no', user_no, { path: '/', maxAge: 2 * 60 * 60 * 1000 })
            res.cookie('state', result[0]['state'], { path: '/', maxAge: 2 * 60 * 60 * 1000 })
            res.cookie('date', result[0]['date'], { path: '/', maxAge: 2 * 60 * 60 * 1000 })
            res.cookie('password', password, { path: '/', maxAge: 2 * 60 * 60 * 1000 })
            if (result[0]['img']) {
                //console.log(escape(result[0]['img']))
                res.cookie('img', result[0]['img'], { path: '/', maxAge: 2 * 60 * 60 * 1000 })
            } else {
                //console.log(result);
            }
            if (result[0]['user_name']) {
                res.cookie('user_name', encodeURI(result[0]['user_name']), { path: '/', maxAge: 2 * 60 * 60 * 1000, encode: val => val })
            } else {
                res.cookie('user_name', '默认昵称', { path: '/', maxAge: 2 * 60 * 60 * 1000 })
            }
            query(sql2, [date, user_no], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    //console.log(result);
                }
            })
            res.json({ flag: true, msg: "登录成功！" })

        }
    })
})
//登录
router.post('/login', (req, res, next) => {
    let { user_no, password, date } = req.body
    //console.log(user_no, password, date);
    let sql = "select * from user where user_no='" + user_no + "'"
    let sql2 = "update user set date=? where user_no=?";
    query(sql, (err, result) => {
        if (err) {
            res.json({ flag: false, msg: "登录失败" })
        } else if (result.length == 0) {
            res.json({ flag: false, msg: "不存在此账号" })
        } else if (result[0]['password'] != common.md5(password)) {
            res.json({ flag: false, msg: "密码不正确" })
        } else if (result[0]['state'] == 99) {
            res.json({ flag: false, msg: "管理员已禁止您的登录，请联系管理员以解禁，邮箱：1404500798@qq.com" })
        } else {
            res.cookie('user_no', user_no, { path: '/', maxAge: 2 * 60 * 60 * 1000 })
            res.cookie('state', result[0]['state'], { path: '/', maxAge: 2 * 60 * 60 * 1000 })
            res.cookie('date', result[0]['date'], { path: '/', maxAge: 2 * 60 * 60 * 1000 })
            if (result[0]['img']) {
                //console.log(escape(result[0]['img']))
                res.cookie('img', result[0]['img'], { path: '/', maxAge: 2 * 60 * 60 * 1000 })
            } else {
                res.cookie('img', 'http://localhost:3000/uploads/img.jpg', { path: '/', maxAge: 2 * 60 * 60 * 1000 })
            }
            if (result[0]['user_name']) {
                res.cookie('user_name', encodeURI(result[0]['user_name']), { path: '/', maxAge: 2 * 60 * 60 * 1000, encode: val => val })
            } else {
                res.cookie('user_name', '默认昵称', { path: '/', maxAge: 2 * 60 * 60 * 1000 })
            }
            query(sql2, [date, user_no], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    //console.log(result);
                }
            })
            //console.log(result[0]['state']);
            res.json({ flag: true, msg: "登录成功！" })
        }
    })
})
//验证码
router.post('/code', (req, res, next) => {
    var { user_no } = req.body
    var code = "";
    var startTime = new Date().getTime();
    console.log(startTime)
    for (var i = 0; i < 6; i++) {
        var radom = Math.floor(Math.random() * 10);
        code += radom;
    }
    // 发送邮件
    var mail = {
        // 发件人
        from: '华软乌托帮<1404500798@qq.com>',
        // 主题
        subject: '激活您的 乌托帮 邮箱账号',
        // 收件人
        to: user_no,
        // 邮件内容，HTML格式
        text: `尊敬的` + user_no + `，您好！
        您的验证码是` + code + `
        为保障您的帐号安全，请在1小时内使用。 
        若如果您并未尝试使用，请忽略本邮件，由此给您带来的不便请谅解。
        本邮件由系统自动发出，请勿直接回复！`
    };
    let sql = "select user_no from user where user_no='" + user_no + "'"
    query(sql, (err, result) => {
        if (err) {
            res.json({ flag: false, msg: '获取验证码失败' })
        } else if (result.length != 0) {
            res.json({ flag: false, msg: '此账号已注册' })
        } else {
            transporter.sendMail(mail, function (error, info) {
                if (error) {
                    res.json({ flag: false, msg: "验证码发送失败" })
                    console.log(error);
                } else {
                    let sql2 = "select user_no from emailcode where user_no='" + user_no + "'"
                    let sqlinsert = "insert into emailcode(user_no,code,date) values('" + user_no + "','" + code + "','" + startTime + "')"
                    let sqlupdate = "update emailcode set code=?,date=? where user_no=?";
                    query(sql2, (err, result) => {
                        if (err) {
                            res.json({ flag: false, msg: "验证码发送失败" })
                            console.log(err);
                        } else if (result.length != 0) {
                            query(sqlupdate, [code, startTime, user_no], (err, result) => {
                                if (err) {
                                    res.json({ flag: false, msg: "验证码发送失败" })
                                    console.log(err);
                                } else {
                                    res.json({ flag: true, msg: "验证码发送成功" })
                                    console.log('mail sent:', info.response);
                                }
                            })
                        } else {
                            query(sqlinsert, (err, result) => {
                                if (err) {
                                    res.json({ flag: false, msg: "验证码发送失败" })
                                    console.log(err);
                                } else {
                                    res.json({ flag: true, msg: "验证码已经发送" })
                                    console.log('mail sent:', info.response);
                                }
                            })
                        }
                    })
                }
            });
        }
    })
})
//注册
router.post('/reg', (req, res, next) => {
    let { user_no, password, code, date } = req.body;
    const intervalTime = 1000 * 60 * 60; // 过期时间
    //console.log(req.body);
    let sql = "select user_no from user where user_no='" + user_no + "'"
    query(sql, (err, result) => {
        if (err) {
            res.json({ flag: false, msg: '注册失败' })
        } else if (result.length != 0) {
            res.json({ flag: false, msg: '此账号已注册' })
        } else {
            let sql2 = "select * from emailcode where user_no='" + user_no + "'"
            query(sql2, (err, result) => {
                //console.log(result);
                if (err) {
                    res.json({ flag: false, msg: "请点击获取验证码以验证邮箱账号" })
                } else if (result.length == 0) {
                    res.json({ flag: false, msg: "请点击获取验证码以验证邮箱账号" })
                } else if (result[0]['code'] != code) {
                    res.json({ flag: false, msg: "验证码不正确" })
                } else if (new Date().getTime() - result[0]['date'] > intervalTime) {
                    res.json({ flag: false, msg: "验证码已过期" })
                } else {
                    let sql3 = "insert into user(user_no,password,state,date,img) values('" + user_no + "','" + common.md5(password) + "'," + 0 + ",'" + date + "','" + "http://localhost:3000/uploads/" + user_no + ".jpg" + "')"
                    query(sql3, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.json({ flag: false, msg: '注册失败?' })
                        } else {
                            let sql4 = "delete from emailcode where user_no='" + user_no + "'"
                            query(sql4, function (err, result) {
                                if (err) {
                                    console.log(err);
                                    res.json({ flag: false, msg: '注册失败' })
                                    return
                                } else {
                                    res.json({ flag: true, msg: '注册成功' })
                                }
                            })

                        }
                    })
                }
            })
        }
    })
})
//重置密码
router.post('/reset', (req, res, next) => {
    let { user_no, password, code } = req.body;
    //console.log(req.body);
    let sql = "select * from user where user_no='" + user_no + "'"
    query(sql, (err, result) => {
        if (err) {
            res.json({ flag: false, msg: '重置失败' })
        } else if (result.length == 0) {
            res.json({ flag: false, msg: '此账号不存在' })
        } else {
            let sql2 = "select code from emailcode where user_no='" + user_no + "'"
            query(sql2, (err, result) => {
                //console.log(result);
                if (err) {
                    res.json({ flag: false, msg: "请点击获取验证码以验证邮箱账号" })
                } else if (result.length == 0) {
                    res.json({ flag: false, msg: "请点击获取验证码以验证邮箱账号" })
                } else if (result[0]['code'] != code) {
                    res.json({ flag: false, msg: "验证码不正确" })
                } else {
                    let sql3 = "update user set password=? where user_no=?";
                    query(sql3, [password, user_no], (err, result) => {
                        if (err) {
                            console.log(err);
                            res.json({ flag: false, msg: '重置失败' })
                        } else {
                            let sql4 = "delete from emailcode where user_no='" + user_no + "'"
                            query(sql4, function (err, result) {
                                if (err) {
                                    console.log(err);
                                    res.json({ flag: false, msg: '重置失败' })
                                    return
                                } else {
                                    res.json({ flag: true, msg: '重置成功' })
                                }
                            })

                        }
                    })
                }
            })
        }
    })
})
//查询用户信息
router.get('/mydata', function (req, res, next) {
    let user_no = req.cookies.user_no
    let sql = 'select * from user where user_no=?'
    query(sql, [user_no], (err, result) => {
        if (err) {
            res.send('查询错误：' + err)
        } else {
            res.json(result)
        }
    })
})
//修改个人信息
router.post('/update', (req, res, next) => {
    //console.log(req.body);
    let sql = "update user set user_name=?,gender=?,phone=?,address=? where user_no=?";
    query(sql, [req.body.user_name, req.body.gender, req.body.phone, req.body.address, req.cookies.user_no], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.cookie('user_name', req.body.user_name, { path: '/', maxAge: 2 * 60 * 60 * 1000 })
            //console.log(result);
            res.json(result)
        }
    })
})
//头像
router.post("/upload", upload.single('file'), function (req, res) {
    const file = req.file;
    //console.log(file);
    //获取后缀名
    let extname = path.extname(file.originalname);
    //获取上传成功之后的文件路径
    let filepath = file.path;
    //上传之后文件的名称
    let filename = req.body.no + extname;
    //console.log(filename);
    //重命名，借用fs的rename重命名的方法，第一参数是源文件地址路径，第二个参数是将源文件改名后的地址(和参数一地址相同，只不过名字变了而已，两个参数都是地址)
    fs.rename(filepath, path.join(path.dirname(filepath), filename), async err => {
        if (!err) {
            //console.log('/upload/' + filename);
        }
    })
    //console.log(req.body.no);
    file.url = `http://localhost:3000/uploads/` + filename
    //img = file.url
    //console.log(img);
    //console.log(file);
});
//其它用户详情
router.get('/user', function (req, res, next) {
    var { user_no, follow_no } = req.query
    let sql = 'select * from user where user_no=?'
    let sql1 = 'select * from follow where user_no=? and follow_no=?'
    query(sql, follow_no, (err, result) => {
        if (result) {
            query(sql1, [user_no, follow_no], function (err, ress) {
                if (ress.length == 0) {
                    res.json({ result: result, followw: true })
                } else {
                    res.json({ result: result, followw: false })
                }
            })
        } else {
            res.send('查询错误：' + err)
        }
    })
})
//关注
router.get('/follow', function (req, res, next) {
    var { user_no, follow_no } = req.query
    let sql = 'select * from follow where user_no=? and follow_no=?'
    let sql1 = 'insert into follow(user_no,follow_no) values(?,?)'
    let sql2 = 'update user set follow=follow+1 where user_no=?'
    query(sql, [user_no, follow_no], function (err, result) {
        if (result.length == 0) {
            query(sql1, [user_no, follow_no], function (err, result) {
                if (err) {
                    res.json({ flag: false, msg: '关注失败' })
                    return
                } else {
                    query(sql2, follow_no, function (err, result) { })
                    res.json({ flag: true, msg: '关注成功' })
                }
            })
        } else {
            res.json({ flag: false, msg: '已经关注过该用户' })
        }
    })
})
//取消关注
router.get('/nofollow', (req, res, next) => {
    var { user_no, follow_no } = req.query
    let sql = 'delete from follow where user_no=? and follow_no=?'
    let sql0 = 'update user set follow=follow-1 where user_no=?'
    query(sql, [user_no, follow_no], function (err, result) {
        if (err) {
            res.json({ flag: false, msg: '取消关注失败' })
        } else {
            query(sql0, follow_no, function (err, result) { })
            res.json({ flag: true, msg: '取消关注成功' })
        }
    })
})
//移除粉丝
router.get('/nouser', (req, res, next) => {
    var { user_no, follow_no } = req.query
    let sql = 'delete from follow where user_no=? and follow_no=?'
    query(sql, [user_no, follow_no], function (err, result) {
        if (err) {
            res.json({ flag: false, msg: '移除粉丝失败' })
        } else {
            res.json({ flag: true, msg: '移除粉丝成功' })
        }
    })
})
//关注列表
router.get('/followlist', (req, res, next) => {
    var { user_no } = req.query
    let sql = 'select follow_no from follow where user_no=? '
    let sql1 = 'select user_name,user_no from user where user_no=? '
    var newArr = []
    query(sql, user_no, function (err, result) {
        if (result.length == 0) {
            res.json(newArr);
        }
        result.map((item, index) => {
            query(sql1, item.follow_no, function (err, ress) {
                newArr.push(ress[0]);
                if (index + 1 == result.length) {
                    res.json(newArr);
                }
            })
        })
    })
})

//粉丝列表
router.get('/userlist', (req, res, next) => {
    var { follow_no } = req.query
    let sql = 'select user_no from follow where follow_no=? '
    let sql1 = 'select user_name,user_no from user where user_no=? '
    var newArr = []
    query(sql, follow_no, function (err, result) {
        if (result.length == 0) {
            res.json(newArr);
        }
        result.map((item, index) => {
            query(sql1, item.user_no, function (err, ress) {
                newArr.push(ress[0]);
                if (index + 1 == result.length) {
                    res.json(newArr);
                }
            })
        })
    })
})
//收藏列表
router.get('/collectnotes', (req, res, next) => {
    var { user_no } = req.query
    let sql = 'select * from collection where user_no=? '
    query(sql, user_no, function (err, result) {
        res.json(result);
    })
})
//vip用户管理数据
router.get('/usersedit', function (req, res, next) {
    let sql = 'select * from user order by state desc'
    query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.json(result);
    })
})
//管理员保存用户管理
router.post('/userseditsave', function (req, res, next) {
    var { user_name, phone, address, follow, state, user_no } = req.body
    let sql = 'update user set user_name=?, phone=?, address=?, follow=?, state=? where user_no=?'
    query(sql, [user_name, phone, address, follow, state, user_no], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.json({ flag: true, msg: '保存成功' })
    })
})
//发送通知
router.post('/notice', function (req, res, next) {
    var { user_no, notice, date } = req.body
    //console.log(req.body);
    let sql = 'insert into notice(user_no,notice,date) values(?,?,?)'
    query(sql, [user_no, notice, date], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.json({ flag: true, msg: '发送成功' })
    })
})
//群发通知
router.post('/mass', function (req, res, next) {
    var { notice, date } = req.body
    console.log(req.body);
    let sql = 'insert into notice(user_no,notice,date) values(?,?,?)'
    let sql1 = 'select user_no from user'
    query(sql1, (err, result) => {
        if (err) {
            console.log(err);
        }
        result.map((item, index) => {
            //console.log(result[index].user_no);
            query(sql, [result[index].user_no, notice, date], (err, result) => {
                if (err) {
                    console.log(err);
                }
            })
        })
        res.json({ flag: true, msg: '发送成功' })
    })
})
module.exports = router;
