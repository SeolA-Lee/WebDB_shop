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
    },
    /* cart 관련 모듈 추가 */
    cartview : (req, res) => {
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM code;`;
        var sql3 = `SELECT c.*, p.name AS product_name, ps.name FROM cart c INNER JOIN product p ON c.mer_id=p.mer_id INNER JOIN person ps ON c.loginid=ps.loginid;`
        db.query(sql1 + sql2 + sql3, (error, results) => {
            if(error) { throw error; }
            var {name, login, cls} = util.authIsOwner(req, res);
            var boardtypes = results[0];
            var codes = results[1];
            var cartviews = results[2];

            var context = { 
                who : name, 
                login : login,
                body : 'cartView.ejs',
                cls : cls,
                boardtypes : boardtypes,
                codes : codes,
                cartviews : cartviews
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });  
        });
    },
    cartupdate : (req, res) => {
        var sntzedCartId = sanitizeHtml(req.params.cartId);
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM code;`;
        var sql3 = `SELECT * FROM cart WHERE cart_id=${sntzedCartId};`
        var sql4 = `SELECT * FROM person WHERE class='CST';`
        var sql5 = `SELECT * FROM product;`
        db.query(sql1 + sql2 + sql3 + sql4 + sql5, (error, results) => {
            if(error) { throw error; }
            var {name, login, cls} = util.authIsOwner(req, res);
            var boardtypes = results[0];
            var codes = results[1];
            var cartview = results[2];
            var customers = results[3];
            var products = results[4];

            var context = { 
                who : name, 
                login : login,
                body : 'cartU.ejs',
                cls : cls,
                boardtypes : boardtypes,
                codes : codes,
                cartview : cartview,
                customers : customers,
                products : products
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });  
        });
    },
    cartupdate_process : (req, res) => {
        var cart = req.body;
        var sntzedLoginId = sanitizeHtml(cart.loginid);
        var sntzedMerId = sanitizeHtml(cart.mer_id);
        var sntzedCartId = sanitizeHtml(cart.cart_id);
        db.query('UPDATE cart SET loginid=?, mer_id=? WHERE cart_id=?', [sntzedLoginId, sntzedMerId, sntzedCartId], (error, result) => {
            if(error) { throw error; }
            res.redirect('/cartview');
        });
    },
    cartdelete_process : (req, res) => {
        var sntzedCartId = sanitizeHtml(req.params.cartId);
        db.query('DELETE FROM cart WHERE cart_id=?', [sntzedCartId], (error, result) => {
            if(error) { throw error; }
            res.redirect('/cartview');
        });
    }
}