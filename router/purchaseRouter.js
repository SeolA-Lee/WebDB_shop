const express = require('express');
var router = express.Router();

var purchase = require('../lib/purchase');

router.get('/', (req, res) => {
    purchase.purchase(req, res);
});

router.get('/detail/:merId', (req, res) => {
    purchase.purchasedetail(req, res);
});

router.post('/purchase_process', (req, res) => {
    purchase.purchase_process(req, res);
});
router.get('/cancel/:purchaseId', (req, res) => {
    purchase.cancel_process(req, res);
});

router.get('/cart', (req, res) => {
    purchase.cart(req, res);
});
router.post('/put_in_cart', (req, res) => {
    purchase.put_in_cart(req, res);
});
router.post('/delete_process', (req, res) => {
    purchase.delete_process(req, res);
});
router.post('/cartpurchase_process', (req, res) => {
    purchase.cartpurchase_process(req, res);
});

router.get('/view', (req, res) => {
    purchase.view(req, res);
});

module.exports = router;