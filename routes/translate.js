var express = require('express');
var router = express.Router();

router.post('/translate', function (req, res, next) {
    var key = req.param.key;
    var from = req.param.from;
    var to = req.param.to;
    var text = req.param.to;

    if (key && from && to && text) {
        res.send({
            status: true
        });
    }else {
        res.send({
            status: false
        });
    }

});

module.exports = router;