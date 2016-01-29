var express = require('express'),
    app = express(),
    mongojs = require('mongojs'),
    db = mongojs('beerdata', ['userlist']),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    expressSession = require('express-session'),
    objectId = require('mongojs').ObjectId,
    port = process.env.PORT || 80;

var errorType = null;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
passport.use(new LocalStrategy({
        session: true
    },
    function (username, password, done) {
        //    console.log(username,password);
        db.userlist.findOne({
            username: username
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                errorType = 1;
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            if (user.password != password) {
                errorType = 2;
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user._id);

});
passport.deserializeUser(function (id, done) {
    db.userlist.findOne({
        '_id': objectId(id)
    }, function (err, user) {
        done(err, user);
    });
});

app.use(expressSession({
    secret: 'must work',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/beerdata', function (req, res) {
    db.userlist.find(function (err, docs) {
        res.json(docs);
    });
});

app.post('/beerdata', function (req, res) {
    db.userlist.findOne({
        'username': req.body.username
    }, function (err, docs) {
        if (docs) {} else {
            db.userlist.insert(req.body, function (err, doc) {});

            db.userlist.update({
                username: req.body.username
            }, {
                $push: {
                    beers: {
                        bname: "First Beer Is On The House!",
                        blabel: "https://untappd.akamaized.net/site/assets/images/temp/badge-beer-default.png",
                        style: "The beers overall character or origin.",
                        abv: "This is alcohol % by volume.",
                        desc: "Hopefully a thourough and hardy description of the beer.",
                        location: ["Where you've had this beer."],
                        userinput: "Any comment you leave yourself while checking in the beer.",
                        rating: "Rate it! Why not?"
                    }
                }
            }, function (err, doc) {
                res.json(doc);
            });
        }
    });
});


app.get('/recent/:id', function (req, res) {
    var id = req.params.id;
    db.userlist.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, docs) {
        res.json(docs);
    })
});

app.put('/brewInfo', function (req, res) {
    var id = req.body._id;
    db.userlist.findOne({
        _id: mongojs.ObjectId(id)
    }, {
        _id: 0,
        beers: {
            $elemMatch: {
                bname: req.body.bname
            }
        }
    }, function (err, doc) {
        res.json(doc);
        console.log("My Response: ", doc);
    });
});

app.put('/brewWish', function (req, res) {
    var id = req.body._id;
    db.userlist.findOne({
        _id: mongojs.ObjectId(id)
    }, {
        _id: 0,
        wishList: {
            $elemMatch: {
                bname: req.body.bname
            }
        }
    }, function (err, doc) {
        res.json(doc);
    });
});

app.put('/deletebeer', function (req, res) {
    db.userlist.update({
        username: req.body.username
    }, {
        $pull: {
            beers: {
                bname: req.body.bname
            }
        }
    }, {
        multi: true
    }, function (err, doc) {
        res.json(doc);
    });
});

app.put('/deletewish', function (req, res) {
    db.userlist.update({
        username: req.body.username
    }, {
        $pull: {
            wishList: {
                bname: req.body.bname
            }
        }
    }, {
        multi: true
    }, function (err, doc) {
        res.json(doc);
    });
});


app.get('/beerdata/:id', function (req, res) {
    var id = req.params.id;
    db.userlist.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    });
});

app.put('/addcheckin', function (req, res) {
    db.userlist.update({
        username: req.body.username
    }, {
        $push: {
            beers: {
                bname: req.body.bname,
                blabel: req.body.blabel,
                style: req.body.bstyle,
                abv: req.body.babv,
                desc: req.body.bdesc,
                location: [req.body.blocation],
                userinput: req.body.buserinput,
                rating: req.body.brating
            }
        }
    }, function (err, doc) {
        res.json(doc);
    });
});

app.put('/updateBeer', function (req, res) {
    db.userlist.update({
            username: req.body.username,
            'beers.bname': req.body.bname
        }, {
            $push: {
                "beers.$.location": req.body.blocation
            }
        },
        function (err, doc) {
            res.json(doc);
        });
});

app.put('/addwishlist', function (req, res) {
    db.userlist.update({
        username: req.body.username
    }, {
        $push: {
            wishList: {
                bname: req.body.bname,
                blabel: req.body.blabel,
                style: req.body.bstyle,
                abv: req.body.babv,
                desc: req.body.bdesc
            }
        }
    }, function (err, doc) {
        res.json(doc);
    });
});

app.post('/login', passport.authenticate('local'), function (req, res) {
    res.json(req.user);
});

app.get('/userCheck', function (req, res) {
    res.json(req.user);
});

app.post('/logout', function (req, res) {
    req.logout();
    res.sendStatus(200);
});

app.get('*', function (req, res) {
    res.sendFile('/index.html');

});

app.listen(port);