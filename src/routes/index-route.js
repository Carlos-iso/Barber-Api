'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=> {
    res.status(200).send({
        title: "Node Barber",
        version: "0.0.1",
        environment: "Development"
    });
});

module.exports = router;