var express = require('express');
var router = express.Router();
const query = require('../db/db');
var async = require('async');
const fq = [
    'comment',
    'comment_1',
    'comment_2',
    'comment_3',
    'comment_4',
    'comment_5',
]
const notesfq = [
    'news',
    'notes_1',
    'notes_2',
    'notes_3',
    'notes_4',
    'notes_5',
]
function getdate() {
    var _this = this;
    let yy = new Date().getFullYear();
    let mm = new Date().getMonth() + 1;
    let dd = new Date().getDate();
    let hh = new Date().getHours();
    let mf =
        new Date().getMinutes() < 10
            ? "0" + new Date().getMinutes()
            : new Date().getMinutes();
    let ss =
        new Date().getSeconds() < 10
            ? "0" + new Date().getSeconds()
            : new Date().getSeconds();
    _this.gettime = yy + "/" + mm + "/" + dd + " " + hh + ":" + mf + ":" + ss;
    return _this.gettime;
}
/* GET home page. */
//评论点赞检验（寄）
router.get('/checkclikes', (req, res, next) => {
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

//删除收到的赞通知
router.get('/dellikes', (req, res, next) => {
    var state = req.query.state
    if (state == 1) {
        var {
            cid,
            user_no,
            cuser_no } = req.query
        let sql = 'update zan set readed=? where user_no=? and commentid=? and cuser_no=?'
        query(sql, [0, user_no, cid, cuser_no], function (err, result) {
            if (err) {
                res.json({ flag: false, msg: '删除失败' })
            } else {
                res.json({ flag: true, msg: '该条通知已删除' })
            }
        })
    } else {
        var {
            notesid,
            user_no,
            cuser_no } = req.query
        let sql = 'update likes set readed=? where user_no=? and notesid=? and cuser_no=?'
        query(sql, [0, user_no, notesid, cuser_no], function (err, result) {
            if (err) {
                res.json({ flag: false, msg: '删除失败' })
            } else {
                res.json({ flag: true, msg: '该条通知已删除' })
            }
        })
    }
})

//删除vip系统通知
router.get('/delreport', (req, res, next) => {
    var {
        notesid,
        user_no } = req.query
    let sql = 'update report set readed=? where user_no=? and notesid=?'
    query(sql, [0, user_no, notesid], function (err, result) {
        if (err) {
            res.json({ flag: false, msg: '删除失败' })
        } else {
            res.json({ flag: true, msg: '该条通知已删除' })
        }
    })
})
//删除系统通知
router.get('/delnotice', (req, res, next) => {
    var { id } = req.query
    let sql = 'update notice set readed=? where id=?'
    query(sql, [0, id], function (err, result) {
        if (err) {
            res.json({ flag: false, msg: '删除失败' })
        } else {
            res.json({ flag: true, msg: '该条通知已删除' })
        }
    })
})
//删除我的回复通知
router.get('/delmsg', (req, res, next) => {
    var { cid, fqid } = req.query
    let sql = 'update ' + fq[fqid] + ' set readed=? where id=?'
    query(sql, [0, cid], function (err, result) {
        if (err) {
            res.json({ flag: false, msg: '删除失败' })
        } else {
            res.json({ flag: true, msg: '该条通知已删除' })
        }
    })
})

//我的通知
router.get('/notice', (req, res, next) => {
    var user_no = req.cookies.user_no;
    let sql = 'select * from notice where user_no=? and readed=1 order by id desc'
    query(sql, user_no, function (err, result) {
        if (err) {
            console.log(err);
        }
        res.json(result)
    })
})

//收到的赞
router.get('/likes', (req, res, next) => {
    var user_no = req.cookies.user_no;
    let sql = 'select * from likes where cuser_no=? and readed=1 and user_no!=? '
    let sql2 = 'select * from zan where cuser_no=? and readed=1 and user_no!=? '
    query(sql, [user_no, user_no], function (err, result) {
        query(sql2, [user_no, user_no], function (err, ress) {
            var zans = result.concat(ress);
            //console.log(zans);
            res.json(zans)
        })
    })
})

//vip的通知
router.get('/report', (req, res, next) => {
    var user_no = req.cookies.user_no;
    let sql = 'select * from report where readed=1'
    query(sql, user_no, function (err, result) {
        if (err) {
            console.log(err);
        }
        res.json(result)
    })
})

//我的回复
router.get('/reply', (req, res, next) => {
    var user_no = req.cookies.user_no;
    async.map(fq, function (item, callback) {
        let sql = 'select * from ' + item + ' where cuser_no=? and readed=1 and user_no!=? order by id desc'
        query(sql, [user_no, user_no], function (err, result) {
            if (result) {
                callback(null, result);
            }
        })
    }, function (err, results) {
        //console.log(results);
        var onearr = results.flat();
        res.json(onearr);
    });
})

//我的评论
router.get('/mycomment', (req, res, next) => {
    var user_no = req.cookies.user_no;
    var newArr = []
    async.map(notesfq, function (item, callback) {
        let sql = 'select id,fq from ' + item + ' where user_no=? order by id desc'
        query(sql, user_no, function (err, result) {
            if (result) {
                callback(null, result);
            }
        })
    }, function (err, results) {
        var onearr = results.flat();
        async.map(onearr, function (item, callback) {
            let sql1 = 'select * from ' + fq[item.fq] + ' where notesid=? and state=0 and readed=1 and user_no!=? order by id desc'
            query(sql1, [item.id, user_no], function (err, result) {
                if (result) {
                    callback(null, result);
                }
            })
        }, function (err, results2) {
            var onearr2 = results2.flat();
            //console.log(onearr2);
            res.json(onearr2);
        });
    });
    // var newArr = [] 
    //let notes = [];
    // for (let index = 0; index < 5; index++) {
    //     let sql = 'select id,fq from ' + notesfq[index] + ' where user_no=? order by id desc'
    //     query(sql, user_no, function (err, result) {
    //         if (result) {
    //             notes = notes.concat(result)
    //             if (index == 4) {
    //                 //console.log(notes);
    //                 notes.map((item, index) => {
    //                     let sql1 = 'select * from ' + fq[item.fq] + ' where notesid=? and state=0 and readed=1 and user_no!=? order by id desc'
    //                     //console.log(item.fq, item.id);
    //                     query(sql1, [item.id, user_no], function (err, ress) {
    //                         if (ress.length > 0) {
    //                             ress.map((item, index) => {
    //                                 newArr.push(ress[index]);
    //                             })
    //                         }
    //                         if (index + 1 == notes.length) {
    //                             //console.log(newArr);
    //                             res.json(newArr);
    //                         }
    //                     })
    //                 })
    //             }
    //         }
    //     })
    // }
})
//评论点赞和取消
router.post('/zzzan', (req, res, next) => {
    let param = req.body.data.scope
    let user_no = req.cookies.user_no
    let user_name = req.cookies.user_name
    //点赞或踩
    let zann = req.body.data.czan;
    //分区id
    let fqid = param.fq;
    //评论id
    let cid = param.fq.toString() + param.id.toString();
    //console.log(cid);
    let date = getdate();
    let img = "http://localhost:3000/uploads/" + user_no + ".jpg"
    let sql1 = 'update ' + fq[fqid] + ' set zan=zan+1 where id=?'
    let sql2 = 'update ' + fq[fqid] + ' set zan=zan-1 where id=?'
    let sql3 = 'insert into zan(commentid,user_no,comment,cuser_no,user_name,img,date,notesid,fq,state) values (?,?,?,?,?,?,?,?,?,?)'
    let sql4 = 'delete from zan where user_no=? and commentid=?'
    let sql
    if (zann == 0) {
        query(sql3, [cid, user_no, param.comment, param.user_no, user_name, img, date, param.notesid, param.fq, param.state], function (err, result) {
        })
        sql = sql1
    } else {
        query(sql4, [user_no, cid], function (err, result) {
        })
        sql = sql2
    }
    query(sql, param.id, function (err, result) {
        if (result) {
            // console.log(result)
            res.json(result)
        }
    })
})

//评论删除
router.get('/commentdel/:id', (req, res, next) => {
    let id = req.params.id
    //分区id
    let fqid = id.charAt(0);
    //文章id
    let noteid = id.substr(1);
    let sql = 'delete from ' + fq[fqid] + '  where id=?'
    let sql2 = 'delete from ' + fq[fqid] + '  where state=?'
    query(sql, noteid, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ flag: false, msg: '删除失败' })
        } else {
            query(sql2, noteid, function (err, result) {
                if (err) {
                    console.log(err);
                    res.json({ flag: false, msg: '删除失败' })
                }
            })
            res.json({ flag: true, msg: '删除成功' })
        }
    })
})

//评论详情
router.get('/comment/:id', (req, res, next) => {
    let id = req.params.id
    //分区id
    let fqid = id.charAt(0);
    //文章id
    let noteid = id.substr(1);
    let user_no = req.cookies.user_no
    let sql = 'select * from ' + fq[fqid] + ' where notesid=? and state=0 order by id desc'
    query(sql, noteid, function (err, result) {
        if (result) {
            let newArr = []
            result.map((item, index) => {
                let sql2 = 'select * from ' + fq[fqid] + ' where state=? order by id desc'
                let sql3 = 'select * from zan where user_no=? and commentid=?'
                let commentid = fqid + item.id

                query(sql3, [user_no, commentid], function (err, resss) {
                    if (resss.length != 0) {
                        newArr.push(
                            Object.assign(item, { czan: 1 })
                        )
                    } else {
                        newArr.push(
                            Object.assign(item, { czan: 0 })
                        )
                    }
                    query(sql2, item.id, function (err, ress) {
                        if (ress.length != 0) {
                            newArr.push(
                                Object.assign(item, { hcomment: ress })
                            )
                        }
                        if (index + 1 == result.length) {
                            res.json(result)
                        }
                    })
                })
            })
            // newArr.push(
            //     Object.assign(item, { zanimg: "require('../assets/zan.png')" })
            // )
            // let arr = result.forEach(index => {
            //     return (result[index]['zanimg'] = 'require("../assets/zan.png")')
            // });
            //console.log(result);
            //res.json(result)
        } else {
            res.json([])
        }
    })
})

//评论回复
router.get('/hcomment/:id', (req, res, next) => {
    let id = req.params.id
    //分区id
    let fqid = id.charAt(0);
    //回复state
    let state = id.substr(1);
    let sql = 'select * from ' + fq[fqid] + ' where state=? order by id desc'
    query(sql, state, function (err, result) {
        if (result) {
            res.json(result)
        }
    })
})

//评论发送
router.post('/sendcomment', (req, res, next) => {
    let { notesid,
        user_no,
        user_name,
        comment,
        zan,
        date,
        state,
        img,
        cuser_no,
        index } = req.body;
    let fqid = index.charAt(0);
    console.log(cuser_no);
    let sql = "insert into " + fq[fqid] + " (notesid,user_no,user_name,comment,zan,date,state,img,cuser_no) values('" + notesid + "', '" + user_no + "', '" + user_name + "','" + comment + "'," + 0 + ", '" + date + "', " + state + ", '" + img + "', '" + cuser_no + "')"
    query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ flag: false, msg: '评论失败' })
        } else {
            res.json({ flag: true, msg: '评论成功' })
        }
    })
    //console.log(req.body);
})
module.exports = router;
