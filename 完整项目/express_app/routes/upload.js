let express = require('express');
let router = express.Router();
const path = require('path');
const query = require('../db/db');
const common = require('../lib/common');
const multer = require('multer');
const fs = require('fs');
const moment = require('moment')
var async = require('async');
const fq = [
    'news',
    'notes_1',
    'notes_2',
    'notes_3',
    'notes_4',
    'notes_5',
]

let uploadDir = `./static/upload/${moment().format('YYYYMMDD')}`
fs.mkdirSync(uploadDir, {
    recursive: true
}) //创建上传的文件夹
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
}) //配置本地存储并对上传文件重命名
let upload = multer({
    storage: storage
}).array('pic') //上传表单的name属性的值

router.post('/uploadFile', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err)
            return;
        } else {
            let imgPath = [];
            req.files.forEach(function (i) {
                //console.log(req.files)
                imgPath.push((i.path).replace('static\\', ''))
            }) // [a,b]  a,b    /images/a.jpg    /css/a.css
            imgPath = imgPath.toString();
            let content = req.body.content;
            let sql = `insert into slide(title,imgPath) values (?,?)`
            query(sql, [content, imgPath], function (err, result) {
                if (err) {
                    console.log(err);
                    return
                } else {
                    res.json({ flag: true, msg: '上传成功' })
                }
            })
        }
    })
})
router.post('/up', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err)
            return;
        } else {
            let imgPath = [];
            req.files.forEach(function (i) {
                console.log(req.files)
                imgPath.push((i.path).replace('static\\', ''))
            }) // [a,b]  a,b    /images/a.jpg    /css/a.css
            res.send(imgPath)
        }
    })
})



//删除
router.get('/notedel/:id', (req, res, next) => {
    let id = req.params.id
    let fqid = id.charAt(0);
    //文章id
    let noteid = id.substr(1);
    let sql = 'delete from ' + fq[fqid] + ' where id=?'
    query(sql, noteid, function (err, result) {
        if (err) {
            console.log(err);
            return
        } else {
            res.json()
        }
    })
})

//文章详情、访问
router.get('/notedetail/:id', (req, res, next) => {
    let id = req.params.id
    //分区id
    let fqid = id.charAt(0);
    //文章id
    let noteid = id.substr(1);
    let sql = 'select * from ' + fq[fqid] + ' where id=?'
    let fansql = 'update ' + fq[fqid] + ' set fan=? where id=?'
    query(sql, noteid, function (err, result) {
        if (result.length == 0) {
            res.json({ flag: true, msg: "该文章已被删除或不存在" })
        } else {
            let fan = parseInt(result[0].fan) + 1
            query(fansql, [fan, noteid], function (err, result) {
                if (result) {
                    //console.log(result)
                }
            })
            res.json(result)
        }
    })
})

//文章获取
router.get('/notes/:id/:pageIndex/:pageSize', function (req, res, next) {
    let id = req.params.id
    //分区id
    let fqid = id.charAt(0);
    let pageIndex = parseInt(req.params.pageIndex);
    let pageSize = parseInt(req.params.pageSize);
    let pos = (pageIndex - 1) * pageSize;

    let sql = 'select * from ' + fq[fqid] + '  order by id desc limit ? , ?'
    query(sql, [pos, pageSize], function (err, result) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.json(result)
        }
    })
});

//文章获取test
router.get('/testfblog/:id', function (req, res, next) {
    let id = req.params.id
    //分区id
    let fqid = id.charAt(0);
    let sql = 'select * from ' + fq[fqid] + '  order by id desc'
    query(sql, function (err, result) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.json(result)
        }
    })
});

//数量
router.get('/totalCount/:id', (req, res, next) => {
    let id = req.params.id
    //分区id
    let fqid = id.charAt(0);
    let sql = 'select count(*) as totalCount from ' + fq[fqid]
    query(sql, [], function (err, result) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.json(result)
        }
    })
})

//文章获取
router.get('/update/:id', function (req, res, next) {
    let id = req.params.id
    //分区id
    let fqid = id.charAt(0);
    //文章id
    let noteid = id.substr(1);
    let sql = 'select * from ' + fq[fqid] + ' where id=?'
    query(sql, noteid, function (err, result) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.json(result)
        }
    })
})

//info我的文章获取
router.get('/infonotes/:id', function (req, res, next) {
    let user_no = req.params.id
    //let notes = [];
    async.map(fq, function (item, callback) {
        let sql = 'select * from ' + item + ' where user_no=? order by id desc'
        query(sql, user_no, function (err, result) {
            if (result) {
                callback(null, result);
            }
        })
    }, function (err, results) {
        //console.log(results);
        var onearr = results.flat();
        res.json(onearr);
    });
    // for (let index = 0; index < 5; index++) {
    //     let sql = 'select * from ' + fq[index] + ' where user_no=? order by id desc'
    //     query(sql, user_no, function (err, result) {
    //         if (result) {
    //             notes = notes.concat(result)
    //             if (index == 4) {
    //                 //console.log(notes);
    //                 res.json(notes)
    //             }
    //         }
    //     })
    // }
})

//info我的收藏获取
router.get('/collectnotes/:id', function (req, res, next) {
    let user_no = req.params.id
    let notes = [];
    let sql = 'select * from ' + fq[index] + ' where user_no=? order by id desc'
    query(sql, user_no, function (err, result) {
        if (result) {
            notes = notes.concat(result)
            res.json(notes)
        }
    })

})

//文章修改
router.post('/update/:id', function (req, res, next) {
    let id = req.params.id
    //分区id
    let fqid = id.charAt(0);
    //文章id
    let noteid = id.substr(1);
    upload(req, res, function (err) {
        if (err) {
            console.error(err.message)
        } else {
            //console.log(req.body.detail);
            let sql = 'update ' + fq[fqid] + ' set user_name=?,title=?,date=?,remark=? where id=?'
            query(sql, [req.body.user_name, req.body.title, req.body.date, req.body.detail, noteid], function (err, result) {
                if (err) {
                    console.log(err);
                    return
                } else {
                    if (req.body.text) {
                        let sql = 'update ' + fq[fqid] + ' set text=? where id=?'
                        query(sql, [req.body.text, noteid], function (err, result) {
                        })
                    }
                    res.json(result)
                }
            })
        }
    })
})

//文章发布
router.post('/add', function (req, res, next) {
    //console.log(req.body);
    //分区id
    let fqid = req.body.region;
    upload(req, res, function (err) {
        if (err) {
            console.error(err.message)
        } else {
            let sql = 'insert into ' + fq[fqid] + '(user_name,title,date,remark,user_no,fan,zan) values(?,?,?,?,?,?,?)'
            query(sql, [req.body.user_name, req.body.title, req.body.date, req.body.detail, req.body.user_no, 0, 0], function (err, result) {
                if (err) {
                    console.log(err);
                    return
                } else {
                    res.json(result)
                }
            })
        }
    })
})


//活动文章发布
router.post('/addd', function (req, res, next) {
    //console.log(req.body);
    var { title,
        user_name,
        date,
        detail,
        region,
        text,
        user_no } = req.body
    let sql = 'insert into notes_5 (user_name,title,date,remark,user_no,text,fan,zan,fl) values(?,?,?,?,?,?,?,?,?)'
    upload(req, res, function (err) {
        if (err) {
            console.error(err.message)
        } else {
            query(sql, [user_name, title, date, detail, user_no, text, 0, 0, region], function (err, result) {
                if (err) {
                    console.log(err);
                    return
                } else {
                    res.json(result)
                }
            })
        }
    })
})


//新闻文章发布
router.post('/adddd', function (req, res, next) {
    //console.log(req.body);
    var { title,
        user_name,
        date,
        detail,
        region,
        text,
        user_no } = req.body
    let sql = 'insert into news (user_name,title,date,remark,user_no,text,fan,zan,fl) values(?,?,?,?,?,?,?,?,?)'
    upload(req, res, function (err) {
        if (err) {
            console.error(err.message)
        } else {
            query(sql, [user_name, title, date, detail, user_no, text, 0, 0, region], function (err, result) {
                if (err) {
                    console.log(err);
                    return
                } else {
                    //console.log(result.insertId);
                    if (region == 0) {
                        let sql2 = "update news set img=? ORDER BY id DESC LIMIT 1"
                        let img = "http://localhost:3000/uploads/" + result.insertId + ".jpg"
                        query(sql2, img, function (err, res) {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }
                    res.json(result)
                }
            })
        }
    })
})

//文章收藏和取消
router.get('/collect', (req, res, next) => {
    var { user_no, notesid, title, state } = req.query
    //console.log(req.query);
    let id = notesid;
    //分区id
    let fqid = id.charAt(0);
    //文章id
    let noteid = id.substr(1);
    if (state == 1) {
        let sql = 'insert into collection(user_no,notesid,title) values (?,?,?)'
        let sql1 = 'update ' + fq[fqid] + ' set collection=collection+1 where id=?'
        query(sql1, noteid, function (err, result) { })
        query(sql, [user_no, notesid, title], function (err, result) {
            if (err) {
                res.json({ flag: false, msg: '收藏失败' })
            } else {
                res.json({ flag: true, msg: '收藏成功' })
            }
        })
    } else {
        let sql = 'delete from collection where user_no=? and notesid=?'
        let sql0 = 'update ' + fq[fqid] + ' set collection=collection-1 where id=?'
        query(sql0, noteid, function (err, result) { })
        query(sql, [user_no, notesid], function (err, result) {
            if (err) {
                res.json({ flag: false, msg: '取消收藏失败' })
            } else {
                res.json({ flag: true, msg: '取消收藏成功' })
            }
        })
    }
})
//文章收藏检验
router.get('/checkcollect', (req, res, next) => {
    var { user_no, notesid } = req.query
    let sql = 'select * from collection where user_no=? and notesid=?'
    let sqlc = 'select count(*) from collection where notesid=?'
    query(sql, [user_no, notesid], function (err, result) {
        query(sqlc, notesid, function (err, resc) {
            if (result.length == 0) {
                res.json({ msg: '收藏', count: resc[0][Object.keys(resc[0])] })
            } else {
                res.json({ msg: '取消收藏', count: resc[0][Object.keys(resc[0])] })
            }
        })
    })
})

//文章点赞检验
router.get('/checklikes', (req, res, next) => {
    var { user_no, notesid } = req.query
    let sql = 'select * from likes where user_no=? and notesid=?'
    let sqlc = 'select count(*) from likes where notesid=?'
    query(sql, [user_no, notesid], function (err, result) {
        query(sqlc, notesid, function (err, resc) {
            //console.log(resc[0][Object.keys(resc[0])])
            if (result.length == 0) {
                res.json({ msg: '点赞', count: resc[0][Object.keys(resc[0])] })
            } else {
                res.json({ msg: '取消点赞', count: resc[0][Object.keys(resc[0])] })
            }
        })
    })
})

//文章举报检验
router.get('/checkreport', (req, res, next) => {
    var { user_no, notesid } = req.query
    let sql = 'select * from report where user_no=? and notesid=?'
    query(sql, [user_no, notesid], function (err, result) {
        if (result.length == 0) {
            res.json({ msg: '举报' })
        } else {
            res.json({ msg: '取消举报' })
        }
    })
})

//文章点赞和取消
router.get('/likes', (req, res, next) => {
    var { user_no, notesid, cuser_no, title, state, user_name, date } = req.query
    console.log(req.query);
    var img = "http://localhost:3000/uploads/" + user_no + ".jpg"
    let id = notesid;
    //分区id
    let fqid = id.charAt(0);
    //文章id
    let noteid = id.substr(1);
    if (state == 1) {
        let sql = 'insert into likes(user_no,notesid,cuser_no,title,user_name,date,img) values (?,?,?,?,?,?,?)'
        let sql1 = 'update ' + fq[fqid] + ' set zan=zan+1 where id=?'
        query(sql1, noteid, function (err, result) { })
        query(sql, [user_no, notesid, cuser_no, title, user_name, date, img], function (err, result) {
            if (err) {
                res.json({ flag: false, msg: '点赞失败' })
            } else {
                res.json({ flag: true, msg: '点赞成功' })
            }
        })
    } else {
        let sql = 'delete from likes where user_no=? and notesid=?'
        let sql0 = 'update ' + fq[fqid] + ' set zan=zan-1 where id=?'
        query(sql0, noteid, function (err, result) { })
        query(sql, [user_no, notesid], function (err, result) {
            if (err) {
                res.json({ flag: false, msg: '取消点赞失败' })
            } else {
                res.json({ flag: true, msg: '取消点赞成功' })
            }
        })
    }
})

//文章举报和取消
router.get('/report', (req, res, next) => {
    var { user_no, notesid, state, report, date } = req.query
    console.log(notesid);
    var img = 'http://localhost:3000/uploads/' + user_no + '.jpg'
    if (state == 1) {
        let sql = 'insert into report(user_no,notesid,report,date,img) values (?,?,?,?,?)'
        query(sql, [user_no, notesid, report, date, img], function (err, result) {
            if (err) {
                res.json({ flag: false, msg: '举报失败' })
            } else {
                res.json({ flag: true, msg: '举报成功' })
            }
        })
    } else {
        let sql = 'delete from report where user_no=? and notesid=?'
        query(sql, [user_no, notesid], function (err, result) {
            if (err) {
                res.json({ flag: false, msg: '取消举报失败' })
            } else {
                res.json({ flag: true, msg: '取消举报成功' })
            }
        })
    }
})
module.exports = router;
