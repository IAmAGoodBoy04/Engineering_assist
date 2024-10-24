const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url.controller');

router.get('/url', urlController.getURL);

module.exports = router;