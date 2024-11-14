var db = require('./db');
var util = require('./util');
var sanitizeHtml = require('sanitize-html');

module.exports = {
    purchase : (req, res) => {
        var sntzedLoginId = sanitizeHtml(req.session.loginid);
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM code;`;
        db.query(sql1 + sql2, (error, results) => {
            if(error) { throw error; }
            db.query('SELECT pc.*, pd.name, pd.image FROM purchase pc INNER JOIN product pd ON pc.mer_id=pd.mer_id WHERE pc.loginid=?', [sntzedLoginId], (error2, purchaseLists) => {
                if(error2) { throw error2; }
                var {name, login, cls} = util.authIsOwner(req, res);
                var boardtypes = results[0];
                var codes = results[1];
    
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
    },
    /* Cart 관련 모듈 */
    cart : (req, res) => {
        var sntzedLoginId = sanitizeHtml(req.session.loginid);
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM code;`;
        db.query(sql1 + sql2, (error, results) => {
            if(error) { throw error; }
            db.query(`SELECT c.*, p.image, p.name, p.price FROM cart c INNER JOIN product p ON c.mer_id=p.mer_id WHERE loginid=?`, [sntzedLoginId], (error2, cartLists) => {
                if(error2) { throw error2; }
                var {name, login, cls} = util.authIsOwner(req, res);
                var boardtypes = results[0];
                var codes = results[1];
    
                var context = { 
                    who : name, 
                    login : login,
                    body : 'cart.ejs',
                    cls : cls,
                    boardtypes : boardtypes,
                    codes : codes,
                    cartLists : cartLists,
                    sntzedLoginId : sntzedLoginId
                };
                res.render('mainFrame', context, (err, html) => {
                    res.end(html);
                });  
            });
        });       
    },
    put_in_cart : (req, res) => { // 장바구니 담기
        var cart = req.body;
        var sntzedLoginId = sanitizeHtml(cart.loginid);
        var sntzedMerId = sanitizeHtml(cart.mer_id);
        var sntzedDate = util.dateOfEightDigit();
        db.query(`SELECT * FROM cart WHERE loginid=? AND mer_id=?`, [sntzedLoginId, sntzedMerId], (error, cart) => {
            if(error) { throw error; }
            if(cart.length > 0) {
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
                res.end(`<script language=JavaScript type="text/javascript">
                            alert("장바구니에 이미 있는 제품입니다.");
                            setTimeout("location.href='http://localhost:3000/purchase/cart'", 1000);
                         </script>`);
                return;
            }
            db.query('INSERT INTO cart(loginid, mer_id, date) VALUES(?, ?, ?)', 
                        [sntzedLoginId, sntzedMerId, sntzedDate], (error, result) => {
                if(error) { throw error; }
                res.redirect('/purchase/cart');
            });
        });
    },
    cartpurchase_process : (req, res) => { // 코드 수정
        var cart = req.body;
        var sntzedLoginId = sntzedLoginId
        var isChecked = cart.is_checked;
        db.query(`SELECT * FROM cart WHERE loginid=?`, [sntzedLoginId], (error, cartLists) => {
            if(error) { throw error; }
            for(i = 0; i < cartLists.length; i++) {
                if(document.querySelectorAll(".checkboxes")[i].checked) {

                }
            }
        });
    },
    delete_process : (req, res) => { // 장바구니에 담겨 있던 상품 삭제
        // 코드 추가
    }
}