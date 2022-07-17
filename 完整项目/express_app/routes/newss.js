var express = require('express');
var router = express.Router();
const query = require('../db/db');
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const upload = multer({ dest: __dirname + '/../uploads' })

//获取活动文章
router.get('/activity', function (req, res, next) {
    let sql = 'select * from notes_5 order by id desc'
    query(sql, function (err, result) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.json(result)
        }
    })
});

//获取新闻
router.get('/news', (req, res, next) => {
    let sql = 'select * from news order by id desc '
    query(sql, function (err, result) {
        if (result) {
            res.json(result)
        } else {
            res.json(err)
        }
    })
})

//轮播图修改
router.post("/upload", upload.single('file'), function (req, res) {
    const file = req.file;
    //console.log(file);
    //获取后缀名
    let extname = path.extname(file.originalname);
    //获取上传成功之后的文件路径
    let filepath = file.path;
    //上传之后文件的名称
    let filename = req.body.no + extname;
    //console.log(req.body.no);
    //console.log(filename);
    //重命名，借用fs的rename重命名的方法，第一参数是源文件地址路径，第二个参数是将源文件改名后的地址(和参数一地址相同，只不过名字变了而已，两个参数都是地址)
    fs.rename(filepath, path.join(path.dirname(filepath), filename), async err => {
        if (!err) {
            console.log('/upload/' + filename);
        }
    })
    file.url = `http://localhost:3000/uploads/` + filename
    img = file.url
    //console.log(img);
    //console.log(file);
});

module.exports = router;
