var db = require('./db');
var util = require('./util'); // util.js 추가
var sanitizeHtml = require('sanitize-html');

module.exports = {
    view : (req, res) => {
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = 'SELECT * FROM person;';
        var sql3 = `SELECT * FROM code;`;
        db.query(sql1 + sql2 + sql3, (error, results) => {
            if(error) { throw error; }
            var {name, login, cls} = util.authIsOwner(req, res);
            var boardtypes = results[0];
            var people = results[1];
            var codes = results[2];

            var context = {
                who : name,
                login : login,
                body : 'person.ejs', // person.ejs를 넘겨줌
                cls : cls,
                boardtypes : boardtypes,
                codes : codes,
                people : people // person.ejs에 넘겨줄 변수
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
    },
    create : (req, res) => {
        var sql1 = `SELECT * FROM boardtype;`;
        var sql2 = `SELECT * FROM code;`;
        db.query(sql1 + sql2, (error, results) => {
            if(error) { throw error; }
            var {name, login, cls} = util.authIsOwner(req, res);
            var boardtypes = results[0];
            var codes = results[1];

            var context = {
                who : name,
                login : login,
                body : 'personCU.ejs', // personCU.ejs를 넘겨줌
                cls : cls,
                boardtypes : boardtypes,
                codes : codes,
                crud : 'create' // personCU.ejs에 넘겨줄 변수
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
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
        var sntzedLoginId = sanitizeHtml(req.params.loginId);
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            if(error) { throw error; }
            db.query('SELECT * FROM person WHERE loginid=?', [sntzedLoginId], (error2, person) => {
                if(error2) { throw error2; }
                db.query('SELECT * FROM code', (error3, codes) => {
                    if(error3) { throw error3; }
                    var {name, login, cls} = util.authIsOwner(req, res);

                    var context = {
                        who : name,
                        login : login,
                        body : 'personCU.ejs', // personCU.ejs를 넘겨줌
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
            });
        });
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
        var sntzedLoginId = sanitizeHtml(req.params.loginId);
        db.query('DELETE FROM person WHERE loginid=?', [sntzedLoginId], (error, result) => {
            if(error) { throw error; }
            res.redirect('/person/view');
        });
    }
}