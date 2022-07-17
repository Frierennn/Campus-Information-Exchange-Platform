var mysql = require("mysql");

var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'test',
  port: 3306
});

var query = function (sql, callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log('和mysql数据库建立连接失败');
      callback(err, null, null);
    } else {
      console.log('和mysql数据库连接成功');
      conn.query(sql, function (qerr, vals, fields) {
        //释放连接
        conn.release();
        //事件驱动回调
        callback(qerr, vals, fields);
      });
    }
  });
};
module.exports = query;