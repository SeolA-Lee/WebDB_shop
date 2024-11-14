var db = require('./db');
var util = require('./util');
var sanitizeHtml = require('sanitize-html');

module.exports = {
    purchase : (req, res) => {
        // purchase.ejs
        // purchase DB
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM code;`;
        var sql3 = `SELECT pc.*, pd.name, pd.image FROM purchase pc INNER JOIN product pd ON pc.mer_id=pd.mer_id;`;
        db.query(sql1 + sql2 + sql3, (error, results) => {
            if(error) { throw error; }
            var {name, login, cls} = util.authIsOwner(req, res);
            var boardtypes = results[0];
            var codes = results[1];
            var purchaseLists = results[2];

            var context = { 
                who : name, 
                login : login,
                body : 'purchase.ejs',
                cls : cls,
                boardtypes : boardtypes,
                codes : codes,
                purchaseLists : purchaseLists,
            };
            res.render('mainFrame', context, (err, html) => {
                res.end(html);
            });  
        });
    },
    purchasedetail : (req, res) => {
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
                body : 'purchaseDetail.ejs',
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
    purchase_process : (req, res) => {
        var purchase = req.body;
        var sntzedLoginId = sanitizeHtml(purchase.loginid);
        var sntzedMerId = sanitizeHtml(purchase.mer_id);
        var sntzedDate = util.dateOfEightDigit();
        var sntzedPrice = sanitizeHtml(purchase.price);
        var sntzedQty = sanitizeHtml(purchase.qty);
        var sntzedTotal = sanitizeHtml(sntzedPrice * sntzedQty);
        db.query('INSERT INTO purchase(loginid, mer_id, date, price, point, qty, total, payYN, cancel, refund) VALUES(?, ?, ?, ?, 0, ?, ?, ?, ?, ?)', 
                  [sntzedLoginId, sntzedMerId, sntzedDate, sntzedPrice, sntzedQty, sntzedTotal, 'N', 'N', 'N'], (error, result) => {
            if(error) { throw error; }
            res.redirect('/purchase');
        });
    },
    cancel_process : (req, res) => {
        var sntzedPurchaseId = sanitizeHtml(req.params.purchaseId);
        db.query(`UPDATE purchase SET cancel="Y" WHERE purchase_id=${sntzedPurchaseId}`, (error, result) => {
            if(error) { throw error; }
            res.redirect('/purchase');
        });
    }
}