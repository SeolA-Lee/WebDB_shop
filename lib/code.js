var db = require('./db');
var sanitizeHtml = require('sanitize-html');

function authIsOwner(req, res) {
    var name = 'Guest';
    var login = false;
    var cls = 'NON';
    if(req.session.is_logined) {
        name = req.session.name;
        login = true;
        cls = req.session.cls;
    }
    return { name, login, cls }
}

module.exports = {
    view : (req, res) => {
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = 'SELECT * FROM code;';
        db.query(sql1 + sql2, (error, results) => {
            if(error) { throw error; }
            var {name, login, cls} = authIsOwner(req, res);
            var boardtypes = results[0];
            var codes = results[1];

            var context = { 
                who : name,
                login : login,
                body : 'code.ejs', // code.ejs를 넘겨줌
                cls : cls,
                boardtypes : boardtypes,
                codes : codes // code.ejs 에 넘겨줄 변수
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
    },
    create : (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            if(error) { throw error; }
            var {name, login, cls} = authIsOwner(req, res);

            var context = {
                who : name,
                login : login,
                body : 'codeCU.ejs', // codeCU.ejs를 넘겨줌
                cls : cls,
                boardtypes : boardtypes,
                crud : 'create' // codeCU.ejs 에 넘겨줄 변수
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
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
        var sntzedMainId = sanitizeHtml(req.params.main);
        var sntzedSubId = sanitizeHtml(req.params.sub);
        var start = req.params.start;
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM code WHERE main_id=${sntzedMainId} AND sub_id=${sntzedSubId} AND start=${start};`;
        db.query(sql1 + sql2, (error, results) => {
            var {name, login, cls} = authIsOwner(req, res);
            var boardtypes = results[0];
            var code = results[1];

            var context = {
                who : name,
                login : login,
                body : 'codeCU.ejs', // codeCU.ejs를 넘겨줌
                cls : cls,
                boardtypes : boardtypes,
                /* --- codeCU.ejs 에 넘겨줄 변수 --- */
                code : code,
                crud : 'update'
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
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
        var sntzedMainId = sanitizeHtml(req.params.main);
        var sntzedSubId = sanitizeHtml(req.params.sub);
        var start = req.params.start;
        db.query('DELETE FROM code WHERE main_id=? AND sub_id=? AND start=?', 
                 [sntzedMainId, sntzedSubId, start], (error, result) => {
            if(error) { throw error; }
            res.redirect('/code/view');
        });
    }
}