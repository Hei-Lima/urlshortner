const express = require('express');
const router = express.Router();
const controller = require('../controller/UrlController')

router.post("/api/shorten", controller.create);

router.get("/:shortUrl", controller.redirect);

module.exports = router;