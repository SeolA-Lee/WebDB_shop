const db = require('./db');
var util = require('./util'); 

module.exports = {
    /* 경영진 기능 - Analytic */
    analytic : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 경영진으로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'CEO') {
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = 'SELECT * FROM code;';
            var sql3 = `SELECT address, ROUND((COUNT(*)/ (SELECT COUNT(*) FROM person)) * 100, 2) AS rate FROM person GROUP BY address;`;
            db.query(sql1 + sql2 + sql3, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var codes = results[1];
                var percentage = results[2];

                var context = {
                    who : name,
                    login : login, 
                    body : 'ceoAnal.ejs',
                    cls : cls, 
                    boardtypes : boardtypes,
                    codes : codes,
                    percentage : percentage
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });
            });
        } else { res.redirect('/'); }
    }
}