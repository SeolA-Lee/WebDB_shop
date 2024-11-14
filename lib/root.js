const db = require('./db');
var util = require('./util'); // util.js 추가
var sanitizeHtml = require('sanitize-html');

module.exports = {
    home : (req, res) => {
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM product;`;
        var sql3 = `SELECT * FROM code;`;
        db.query(sql1 + sql2 + sql3, (error, results) => {
            if(error) { throw error; }
            var {name, login, cls} = util.authIsOwner(req, res);
            var body = '';
            var boardtypes = results[0];
            var products = results[1];
            var codes = results[2];
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
                products : products, 
                codes : codes,
                path : 'root'
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
    },
    /* categoryview, search, detail 모듈 추가 */
    categoryview : (req, res) => {
        var sntzedCategory = sanitizeHtml(req.params.categ);
        var main_id = sntzedCategory.substr(0, 4);
        var sub_id = sntzedCategory.substr(4, 4);
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM product WHERE main_id=${main_id} AND sub_id=${sub_id};`;
        var sql3 = `SELECT * FROM code;`;
        db.query(sql1 + sql2 + sql3, (error, results) => {
            if(error) { throw error; }
            var {name, login, cls} = util.authIsOwner(req, res);
            var boardtypes = results[0];
            var products = results[1];
            var codes = results[2];
    
            var context = { 
                who : name, 
                login : login,
                body : 'product.ejs',
                cls : cls,
                boardtypes : boardtypes,
                products : products, 
                codes : codes,
                path : 'root'
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
    },
    search : (req, res) => {
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM code;`;
        var sql3 = `SELECT * FROM product WHERE name LIKE '%${req.body.search}%' OR 
                                                brand LIKE '%${req.body.search}%' OR 
                                                supplier LIKE '%${req.body.search}%'`;
        db.query(sql1 + sql2 + sql3, (error, results) => {
            if(error) { throw error; }
            var {name, login, cls} = util.authIsOwner(req, res);
            var boardtypes = results[0];
            var codes = results[1];
            var products = results[2];
    
            var context = { 
                who : name, 
                login : login,
                body : 'product.ejs',
                cls : cls,
                boardtypes : boardtypes,
                products : products, 
                codes : codes,
                path : 'root'
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });
        });
    },
    detail : (req, res) => {
        var sntzedMerId = sanitizeHtml(req.params.merId);
        var sntzedLoginId = sanitizeHtml(req.session.loginid);
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM code;`;
        var sql3 = `SELECT * FROM product WHERE mer_id=${sntzedMerId};`;
        db.query(sql1 + sql2 + sql3, (error, results) => {
            if(error) { throw error; }
            var {name, login, cls} = util.authIsOwner(req, res);
            var boardtypes = results[0];
            var codes = results[1];
            var product = results[2];

            var context = { 
                who : name, 
                login : login,
                body : 'productDetail.ejs',
                cls : cls,
                boardtypes : boardtypes,
                codes : codes,
                product : product,
                sntzedLoginId : sntzedLoginId
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });  
        });
    }
}