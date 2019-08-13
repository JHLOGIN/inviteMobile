var express = require('express');
var mysql = require("mysql");
var app = express();

/**
 * 数据库连接
 */
var mysqTool = {
  host: "39.108.219.59",
  user: "root",
  password: "Gxnu@2019",
  database: "peopleinfodatabase",
  sqlCon: null,
  /**
   * 创建数据库连接
   */
  createCon:function(){
    try {
      this.sqlCon = mysql.createConnection({
        host: this.host,
        user: this.user,
        password: this.password,
        port: '3306',
        database: this.database
      })
      console.log("创建数据库连接成功");
    } catch (e) {
      console.log("创建数据库连接失败" + e);
    }
  },
  /**
   * 查询数据库
   * @param {*} sql 
   * @param {*} callback 
   */
  querySql:function(sql,paramter=null, callback) {
    var resultData={
      code:0,
      data:null
  }
    try {
      this.createCon();
      this.sqlCon.connect();
      if(paramter==null){
        this.sqlCon.query(sql, function (err, result) {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
          } else {
            console.log('--------------------------SELECT----------------------------');
            // console.log("SELECT:",result);
            resultData.code=1;
            resultData.data=result;
            callback(resultData);
            console.log('------------------------------------------------------------\n\n');
          }
        })
      }else{
        this.sqlCon.query(sql,paramter, function (err, result,fields) {
          if (err) {
            console.log('[SELECT ERROR] - ', err.message);
          } else {
            console.log('--------------------------SELECT----------------------------');
            // console.log("SELECT:",result);
            resultData.code=1;
            resultData.data=result;
            callback(resultData);
            console.log('------------------------------------------------------------\n\n');
          }
        })
      }
      this.sqlCon.end();
    } catch (e) {
      console.log("select:" + e);
      resultData.code=0;
      resultData.data=null;
      resultData.msg=JSON.stringify(e);
      callback(resultData);
    }
  },
  /**
   * 插入数据库
   * @param {*} sql 
   * @param {*} paramater 
   * @param {*} callback 
   */
  insertSql:function(sql,paramater,callback){
    var resultData={
        code:0,
        data:null
    }
    try {
      this.createCon();
      this.sqlCon.connect();
      this.sqlCon.query(sql,paramater, function (err, result) {
        if (err) {
          console.log('[SELECT ERROR] - ', err.message);
          return;
        } else {
          console.log('--------------------------insert----------------------------');
          console.log('INSERT ID:',result); 
          resultData.code=1;
          resultData.data=result;
          callback(resultData);
          console.log('------------------------------------------------------------\n\n');
        }
      })
      this.sqlCon.end();
    } catch (error) {
      console.log("insert:" +error);
      resultData.code=0;
      resultData.data=null;
      resultData.msg=JSON.stringify(error);
      callback(resultData);
    }
  }
}
app.use(express.static("dist"));
// app.use("error",express.s)
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});
app.get('/savepeople', function (req, res) {
  let user = {
    userName: req.query.user_name,
    userEmail: req.query.user_email,
    userMobile: req.query.user_mobile
  }
  if(user.userEmail==""||user.userEmail==null||user.userName==""||user.userName==null||
     user.user_mobile==""||user.userMobile==null){
       console.log(JSON.stringify(req));
       res.send(JSON.stringify({
         code:0,
         data:null,
       }));
       return 0;
     }
  var queryResult=false;
  var selectSql="select * from people_table where user_name =? and user_mobile=?";
  mysqTool.querySql(selectSql,[user.userName,user.userMobile],function(result){
      if(result.code==1&&result.data.length>0){
        queryResult=true;
      }
  })
  if(!queryResult){
    var insertsql="INSERT INTO people_table (user_name,user_email,user_mobile) VALUES(?,?,?)";
    var param=[user.userName,user.userEmail,user.userMobile];
    mysqTool.insertSql(insertsql,param,function(result){
           res.send(JSON.stringify(result));
    })
  }else{
     res.send(JSON.stringify({
       code:0,
       msg:"你已注册！无需再注册"
     }))
  }
})
app.get('/getAllPeopleInfo',function(req,res){
    var SELECT="select * from people_table";
    mysqTool.querySql(SELECT,null,function(result){
         res.send(JSON.stringify(result));
    })
})
try {
  var server = app.listen(8080,"localhost", function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("start server http://%s:%s", host, port)

  })
} catch (e) {
  console.log("server start failed " + e);
}
