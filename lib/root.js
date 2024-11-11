const db = require('./db');

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
    home : (req, res) => {
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM product;`;
        db.query(sql1 + sql2, (error, results) => {
            if(error) { throw error; }
            var {name, login, cls} = authIsOwner(req, res);
            var body = '';
            var boardtypes = results[0];
            var products = results[1];
            if(products.length == 0) { // product가 없을 땐 body에 test.ejs를 넘겨줌
                body = 'test.ejs'; 
            } else {
                body = 'product.ejs'; 
            }
    
            var context = { 
                who : name, 
                login : login,
                body : body,
                cls : cls,
                boardtypes : boardtypes,
                products : products, // product.ejs에 필요한 변수
                path : 'root'
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
    }
}