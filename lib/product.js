var db = require('./db');
var util = require('./util'); // util.js 추가
var sanitizeHtml = require('sanitize-html');

module.exports = {
    view : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = 'SELECT * FROM product;';
            var sql3 = `SELECT * FROM code;`;
            db.query(sql1 + sql2 + sql3, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var products = results[1];
                var codes = results[2];
    
                var context = {
                    who : name,
                    login : login,
                    body : 'product.ejs', // product.ejs를 넘겨줌
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes,
                    /* --- product.ejs에 넘겨줄 변수 --- */
                    products : products, 
                    path : 'product'
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
            var sql3 = `SELECT * FROM code;`;
            db.query(sql1 + sql2 + sql3, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var categories = results[1];
                var codes = results[2];
    
                var context = {
                    who : name,
                    login : login,
                    body : 'productCU.ejs', // productCU.ejs를 넘겨줌
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes,
                    /* --- productCU.ejs에 넘겨줄 변수 --- */
                    categories : categories,
                    crud : 'create',      
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });
            });
        } else { res.redirect('/') }
    },
    create_process : (req, res) => {
        var product = req.body;
        var sntzedCategory = sanitizeHtml(product.category);
        var main_id = sntzedCategory.substr(0, 4);
        var sub_id = sntzedCategory.substr(4, 4);
        var sntzedName = sanitizeHtml(product.name);
        var sntzedPrice = parseInt(sanitizeHtml(product.price));
        var sntzedStock = parseInt(sanitizeHtml(product.stock));
        var sntzedBrand = sanitizeHtml(product.brand);
        var sntzedSupplier = sanitizeHtml(product.supplier);
        var sntzedFile = product.file;
        var sntzedSaleYn = sanitizeHtml(product.sale_yn);
        var sntzedSalePrice = parseInt(sanitizeHtml(product.sale_price));
        if(isNaN(sntzedSalePrice)) { sntzedSalePrice = 0; } // sale_price 값이 NaN일 때 0으로 채움
        db.query(`INSERT INTO product(main_id, sub_id, name, price, stock, brand, supplier, image, sale_yn, sale_price) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [main_id, sub_id, sntzedName, sntzedPrice, sntzedStock, sntzedBrand, sntzedSupplier, sntzedFile, sntzedSaleYn, sntzedSalePrice], (error, result) => {
            if(error) { throw error; }
            res.redirect('/product/view');
        });
    },
    update : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sntzedMerId = sanitizeHtml(req.params.merId);
            var sql1 = 'SELECT * FROM boardtype;'; 
            var sql2 = 'SELECT * FROM code;';
            var sql3 = `SELECT * FROM product WHERE mer_id=${sntzedMerId};`;
            var sql4 = `SELECT * FROM code;`;
            db.query(sql1 + sql2 + sql3 + sql4, (error, results) => {
                if(error) { throw error; }
                var boardtypes = results[0];
                var categories = results[1];
                var product = results[2];
                var codes = results[3];
                        
                var context = {
                    who : name,
                    login : login,
                    body : 'productCU.ejs', // productCU.ejs를 넘겨줌
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes,
                    /* --- productCU.ejs에 넘겨줄 변수 --- */    
                    categories : categories, 
                    product : product,       
                    crud : 'update'
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });
            });
        } else { res.redirect('/') }
    },
    update_process : (req, res) => {
        var product = req.body;
        var sntzedCategory = sanitizeHtml(product.category);
        var main_id = sntzedCategory.substr(0, 4);
        var sub_id = sntzedCategory.substr(4, 4);
        var mer_id = sanitizeHtml(product.mer_id);
        var sntzedName = sanitizeHtml(product.name);
        var sntzedPrice = parseInt(sanitizeHtml(product.price));
        var sntzedStock = parseInt(sanitizeHtml(product.stock));
        var sntzedBrand = sanitizeHtml(product.brand);
        var sntzedSupplier = sanitizeHtml(product.supplier);
        var sntzedFile = product.file;
        var sntzedSaleYn = sanitizeHtml(product.sale_yn);
        var sntzedSalePrice = parseInt(sanitizeHtml(product.sale_price));
        if(isNaN(sntzedSalePrice)) { sntzedSalePrice = 0; } // sale_price 값이 NaN일 때 0으로 채움
        db.query(`UPDATE product SET main_id=?, sub_id=?, name=?, price=?, stock=?, brand=?, supplier=?, image=?, sale_yn=?, sale_price=?
                  WHERE mer_id=?`,
                  [main_id, sub_id, sntzedName, sntzedPrice, sntzedStock, sntzedBrand, sntzedSupplier, sntzedFile, sntzedSaleYn, sntzedSalePrice, mer_id], (error, result) => {
            if(error) { throw error; }
            res.redirect('/product/view');
        });
    },
    delete_process : (req, res) => {
        var {name, login, cls} = util.authIsOwner(req, res);
        /* --- 관리자로 로그인되어 있을 경우에만 --- */
        if(login === true && cls === 'MNG') {
            var sntzedMerId = sanitizeHtml(req.params.merId);
            db.query('DELETE FROM product WHERE mer_id=?', [sntzedMerId], (error, result) => {
                if(error) { throw error; }
                res.redirect('/product/view');
            });
        } else { res.redirect('/') }
    }
}