'use strict';

const express = require('express');
const router = express.Router();

// Route for angular to handle all other requests
router.get('*', (req, res) => {
    // define the root path for res.sendFile by getting the
    // directory path with __dirname and removing the routes
    // directory to get back out to /app
    let dirname = __dirname.split('/').slice(0,-1).join('/');

    res.sendFile('/index.html', { root: dirname });
});

module.exports = router;