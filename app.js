var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/translator');
var Schema = mongoose.Schema;

var userCollection = require('./collections/users.collection');
var keyCollection = require('./collections/keys.collection');

var index = require('./routes/index');
var users = require('./routes/users');
var translate = require('./routes/translate');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


app.get('/create_key', function (req, res) {

    keyCollection.create({
        owner_id: 1027,
        key: 'vfhbyjxrf123'
    }, function (err, doc) {

        if(!err && doc) {
            res.send(doc);
        }else {
            res.send({
                status: false
            })
        }

    })

});

app.post('/translate', function (req, res, next) {
    var key = req.param('key');
    var from = req.param('from');
    var to = req.param('to');
    var text = req.param('text');

    if (key && from && to && text) {

        keyCollection.findOne({
            key: key
        }, function(err, doc) {

            if(err) {
                res.send({
                    status: false,
                    desc: 'Some database error'
                });
            }

            if (!err && doc && doc.key == key) {

                request({url: 'https://www.googleapis.com/language/translate/v2', qs: {
                    'key': 'AIzaSyBNl6H2VeDwBUoAYpP6B1eqm9XmgGwlp_s',
                    'source': from,
                    'target': to,
                    'q': text
                }}, function (err, response, body) {
                    if(err) { res.send({status: false}) }
                    var jsonBody = JSON.parse(body);

                    res.send({
                        status: true,
                        translated: jsonBody.data.translations[0].translatedText
                    });
                })
            }else {
                res.send({
                    status: false,
                    desc: 'Key error'
                })
            }
        });

    }else {

        res.send({
            status: false,
            desc: 'Нет необходимых параметров!'
        })

    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
