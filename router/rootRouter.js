const express = require('express');
var router = express.Router();

var root = require('../lib/root');

router.get('/', (req, res) => {
    root.home(req, res);
});

/* category, serch, detail 링크 추가 */
router.get('/category/:categ', (req, res) => {
    root.categoryview(req, res);
});
router.post('/search', (req, res) => {
    root.search(req, res);
});
router.get('/detail/:merId', (req, res) => {
    root.detail(req, res);
});

/* MNG - cart RUD 관련 링크 추가 */
router.get('/cartview', (req, res) => {
    root.cartview(req, res);
});
router.get('/cartupdate/:cartId', (req, res) => {
    root.cartupdate(req, res);
});
router.post('/cartupdate_process', (req, res) => {
    root.cartupdate_process(req, res);
});
router.get('/delete/:cartId', (req, res) => {
    root.cartdelete_process(req, res);
});

module.exports = router;