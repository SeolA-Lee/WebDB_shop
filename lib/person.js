var db = require('./db');
var util = require('./util'); 
var sanitizeHtml = require('sanitize-html');

module.exports = {
    view : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = 'SELECT * FROM person;';
            var sql3 = `SELECT * FROM code;`;
            db.query(sql1 + sql2 + sql3, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var people = results[1];
                var codes = results[2];
    
                var context = {
                    who : name,
                    login : login,
                    body : 'person.ejs', 
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes,
                    /* --- person.ejs에 넘겨줄 변수 --- */
                    people : people 
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
            var sql1 = `SELECT * FROM boardtype;`;
            var sql2 = `SELECT * FROM code;`;
            db.query(sql1 + sql2, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var codes = results[1];
    
                var context = {
                    who : name,
                    login : login,
                    body : 'personCU.ejs', 
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes,
                    /* --- personCU.ejs에 넘겨줄 변수 --- */
                    crud : 'create' 
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });
            });
        } else { res.redirect('/') }
    },
    create_process : (req, res) => {
        var person = req.body;
        var sntzedId = sanitizeHtml(person.loginid);
        var sntzedPassword = sanitizeHtml(person.password);
        var sntzedName = sanitizeHtml(person.name);
        var sntzedAddress = sanitizeHtml(person.address);
        var sntzedTel = sanitizeHtml(person.tel);
        var sntzedBirth = sanitizeHtml(person.birth);
        var sntzedClass = sanitizeHtml(person.class);
        var sntzedGrade = sanitizeHtml(person.grade);
        db.query('INSERT INTO person VALUES(?, ?, ?, ?, ?, ?, ?, ?)', 
                  [sntzedId, sntzedPassword, sntzedName, sntzedAddress, sntzedTel, sntzedBirth, sntzedClass, sntzedGrade], (error, result) => {
            if(error) { throw error; }
            res.redirect('/person/view');
        });
    },
    update : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sntzedLoginId = sanitizeHtml(req.params.loginId);
            var sql1 = `SELECT * FROM boardtype;`;
            var sql2 = `SELECT * FROM person WHERE loginid='${sntzedLoginId}';`;
            var sql3 = `SELECT * FROM code;`;
            db.query(sql1 + sql2 + sql3, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var person = results[1];
                var codes = results[2];

                var context = {
                    who : name,
                    login : login,
                    body : 'personCU.ejs', 
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes,
                    /* --- personCU.ejs에 넘겨줄 변수 --- */
                    person : person,
                    crud : 'update'
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });
            });
        } else { res.redirect('/') }
    },
    update_process : (req, res) => {
        var person = req.body;
        var sntzedId = sanitizeHtml(person.loginid);
        var sntzedPassword = sanitizeHtml(person.password);
        var sntzedName = sanitizeHtml(person.name);
        var sntzedAddress = sanitizeHtml(person.address);
        var sntzedTel = sanitizeHtml(person.tel);
        var sntzedBirth = sanitizeHtml(person.birth);
        var sntzedClass = sanitizeHtml(person.class);
        var sntzedGrade = sanitizeHtml(person.grade);
        db.query('UPDATE person SET password=?, name=?, address=?, tel=?, birth=?, class=?, grade=? WHERE loginid=?', 
                  [sntzedPassword, sntzedName, sntzedAddress, sntzedTel, sntzedBirth, sntzedClass, sntzedGrade, sntzedId], (error, result) => {
            if(error) { throw error; }
            res.redirect('/person/view');
        });
    },
    delete_process : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sntzedLoginId = sanitizeHtml(req.params.loginId);
            db.query('DELETE FROM person WHERE loginid=?', [sntzedLoginId], (error, result) => {
                if(error) { throw error; }
                res.redirect('/person/view');
            });
        } else { res.redirect('/') }
    }
}