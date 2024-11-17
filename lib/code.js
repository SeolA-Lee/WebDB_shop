var db = require('./db');
var util = require('./util'); // util.js 추가
var sanitizeHtml = require('sanitize-html');

module.exports = {
    view : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = 'SELECT * FROM code;';
            db.query(sql1 + sql2, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var codes = results[1];
    
                var context = { 
                    who : name,
                    login : login,
                    body : 'code.ejs', // code.ejs를 넘겨줌
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes 
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });
            });
        } else { res.redirect('/') }
    },
    create : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = 'SELECT * FROM code;';
            db.query(sql1 + sql2, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var codes = results[1];
    
                var context = {
                    who : name,
                    login : login,
                    body : 'codeCU.ejs', // codeCU.ejs를 넘겨줌
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes,
                    crud : 'create' // codeCU.ejs 에 넘겨줄 변수
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });
            });
        } else { res.redirect('/') }
    },
    create_process : (req, res) => {
        var code = req.body;
        var sntzedMainId = sanitizeHtml(code.main_id);
        var sntzedSubId = sanitizeHtml(code.sub_id);
        var sntzedMainName = sanitizeHtml(code.main_name);
        var sntzedSubName = sanitizeHtml(code.sub_name);
        var sntzedStart = sanitizeHtml(code.start);
        var sntzedEnd = sanitizeHtml(code.end);
        db.query(`INSERT INTO code VALUES(?, ?, ?, ?, ?, ?)`, 
                 [sntzedMainId, sntzedSubId, sntzedMainName, sntzedSubName, sntzedStart, sntzedEnd], (error, result) => {
            if(error) { throw error; }
            res.redirect('/code/view');
        });
    },
    update : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sntzedMainId = sanitizeHtml(req.params.main);
            var sntzedSubId = sanitizeHtml(req.params.sub);
            var start = req.params.start;
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM code WHERE main_id=${sntzedMainId} AND sub_id=${sntzedSubId} AND start=${start};`;
            var sql3 = 'SELECT * FROM code;';
            db.query(sql1 + sql2 + sql3, (error, results) => {
                var boardtypes = results[0];
                var code = results[1];
                var codes = results[2];
    
                var context = {
                    who : name,
                    login : login,
                    body : 'codeCU.ejs', // codeCU.ejs를 넘겨줌
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes,
                    /* --- codeCU.ejs 에 넘겨줄 변수 --- */
                    code : code,
                    crud : 'update'
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });
            });
        }
    },
    update_process : (req, res) => {
        var code = req.body;
        var sntzedMainName = sanitizeHtml(code.main_name);
        var sntzedSubName = sanitizeHtml(code.sub_name);
        var sntzedStart = sanitizeHtml(code.start);
        var sntzedEnd = sanitizeHtml(code.end);
        var sntzedMainId = sanitizeHtml(code.main_id);
        var sntzedSubId = sanitizeHtml(code.sub_id);
        db.query('UPDATE code SET main_name=?, sub_name=?, start=?, end=? WHERE main_id=? AND sub_id=?',
                 [sntzedMainName, sntzedSubName, sntzedStart, sntzedEnd, sntzedMainId, sntzedSubId], (error, result) => {
            if(error) { throw error; }
            res.redirect('/code/view');
        });
    },
    delete_process : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sntzedMainId = sanitizeHtml(req.params.main);
            var sntzedSubId = sanitizeHtml(req.params.sub);
            var start = req.params.start;
            db.query('DELETE FROM code WHERE main_id=? AND sub_id=? AND start=?', 
                     [sntzedMainId, sntzedSubId, start], (error, result) => {
                if(error) { throw error; }
                res.redirect('/code/view');
            });
        } else { res.redirect('/') }
    }
}