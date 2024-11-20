const express = require('express');
var router = express.Router();

var anal = require('../lib/ceoAnal');

/* CEO - Analytic 관련 링크 */
router.get('/customer', (req, res) => {
    anal.analytic(req, res);
});

module.exports = router;