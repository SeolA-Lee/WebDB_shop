const db = require('./db');
var util = require('./util'); 
var sanitizeHtml = require('sanitize-html');

module.exports = {
    /* --- 관리자 기능: Table Manage --- */
    table : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM code;`;
            var sql3 = `SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE table_schema='webdb2024';`
            db.query(sql1 + sql2 + sql3, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var codes = results[1];
                var tables = results[2];

                var context = { 
                    who : name, 
                    login : login,
                    body : 'tableManage.ejs',
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes,
                    /* --- tableManage.ejs에 넘겨줄 변수 --- */
                    tables : tables
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });  
            });
        } else { res.redirect('/'); }
    },
    view : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sntzedTableName = sanitizeHtml(req.params.tableName);
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM code;`;
            var sql3 = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema='webdb2024' AND TABLE_NAME='${sntzedTableName}';`;
            var sql4 = `SELECT * FROM ${sntzedTableName};`;
            db.query(sql1 + sql2 + sql3 + sql4, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var codes = results[1];
                var tableview = results[2];
                var values = results[3];

                var context = { 
                    who : name, 
                    login : login,
                    body : 'tableView.ejs',
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes,
                    /* --- tableView.ejs에 넘겨줄 변수 --- */
                    tableview : tableview,
                    values : values
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });  
            });
        } else { res.redirect('/'); }
    }
}