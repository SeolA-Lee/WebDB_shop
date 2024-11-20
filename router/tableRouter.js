const express = require('express');
var router = express.Router();

var table = require('../lib/table');

/* MNG - Table Manage 관련 링크 */
router.get('/', (req, res) => {
    table.table(req, res);
});
router.get('/view/:tableName', (req, res) => {
    table.view(req, res);
});

module.exports = router;