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
    login : (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            if(error) { throw error; }
            var {name, login, cls} = authIsOwner(req, res);

            var context = { 
                who : name,
                login : login,
                body : 'login.ejs',
                cls : cls,
                boardtypes : boardtypes
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
    },
    login_process : (req, res) => {
        var post = req.body;
        var sntzedLogined = sanitizeHtml(post.loginid);
        var sntzedPassword = sanitizeHtml(post.password);
        db.query(`SELECT COUNT(*) AS num FROM person WHERE loginid=? AND password=?`, [sntzedLogined, sntzedPassword], (error, results) => {
            if(error) { throw error; }
            if(results[0].num === 1) {
                db.query(`SELECT name, class, loginid, grade FROM person WHERE loginid=? AND password=?`, [sntzedLogined, sntzedPassword], (error2, result) => {
                    if(error2) { throw error2; }
                    req.session.is_logined = true;
                    req.session.loginid = result[0].loginid
                    req.session.name = result[0].name
                    req.session.cls = result[0].class
                    req.session.grade = result[0].grade
                    res.redirect('/');
                });
            } else {
                req.session.is_logined = false;
                req.session.name = 'Guest';
                req.session.cls = 'NON';
                res.redirect('/');
            }
        });
    },
    logout_process : (req, res) => {
        req.session.destroy((err) => {
            res.redirect('/');
        });
    },

    register : (req, res) => {
        db.query('SELECT * FROM boardtype', (error, boardtypes) => {
            if(error) { throw error; }
            var {name, login, cls} = authIsOwner(req, res);
            if(login == true) { // 로그인이 되어 있을 때 회원가입 클릭 시 '/'로 redirect
                res.redirect('/');
            }

            var context = { 
                who : name,
                login : login,
                body : 'personCU.ejs',
                cls : cls,
                boardtypes : boardtypes,
                crud : 'register' // personCU.ejs에 넘겨줄 변수
            };
            req.app.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
    },
    register_process : (req, res) => {
        var post = req.body;
        var sntzedLogined = sanitizeHtml(post.loginid);
        var sntzedPassword = sanitizeHtml(post.password);
        var sntzedName = sanitizeHtml(post.name);
        var sntzedAddress = sanitizeHtml(post.address);
        var sntzedTel = sanitizeHtml(post.tel);
        var sntzedBirth = sanitizeHtml(post.birth);
        db.query(`INSERT INTO person VALUES(?, ?, ?, ?, ?, ?,'CST','S')`,  // 입력 시 class는 자동으로 CST, grade는 자동으로 S로 지정
                 [sntzedLogined, sntzedPassword, sntzedName, sntzedAddress, sntzedTel, sntzedBirth], (error, result) => {
            if(error) { throw error; }
            res.redirect('/');
            res.end();
        });
    }
}