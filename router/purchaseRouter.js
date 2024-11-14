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

module.exports = router;