var express = require('express'),
    app = express(),
    mongojs = require('mongojs'),
    db = mongojs('beerdata', ['userlist']),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    expressSession = require('express-session'),
    objectId = require('mongojs').ObjectId;

//severside management

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
passport.use(new LocalStrategy({
        session: true
    },
    function (username, password, done) {
    console.log(username,password);
        db.userlist.findOne({
            username: username
        }, function (err, user) {
            console.log(err, user)
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (user.password != password) {
                return done(null, false);
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

//server routes

app.get('/beerdata', function (req, res) {
    console.log("GET request");
    db.userlist.find(function (err, docs) {
        console.log("i received");
        res.json(docs);
    });
});


//REGISTER
//REGISTER
app.post('/beerdata', function (req, res) { //*data flow 4* app.get written to match $http.get in controller.js so the server can receive the data
    console.log(req.body);
    //req is the data going into the front end
    db.userlist.insert(req.body, function (err, doc) { //doc is the object that is
        res.json(doc); //*data flow 5* res is the data coming back from the server/ res gets transferred to controller.js -->
    });
});


//DELETE
//DELETE
app.delete('/beerdata/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    db.userlist.remove({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        res.json(doc);
    })
});



//EDIT
//EDIT
app.get('/beerdata/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    db.userlist.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
        console.log(doc);
        res.json(doc);
    });
});


//UPDATE AFTER EDIT
//UPDATE AFTER EDIT
app.put('/beerdata/:id', function (req, res) {
    var id = req.params.id;
    console.log(req.body.name);
    db.userlist.findAndModify({
        query: {
            _id: mongojs.ObjectId(id)
        },
        update: {
            $set: {
                username: req.body.username,
                email: req.body.email
            }
        },
        new: true
    }, function (err, doc) {
        res.json(doc);

    });
});

app.post('/login', passport.authenticate('local'), function (req, res) {
    res.json(req.user);
});

app.get('/userCheck', function (req, res) {
    console.log(req.user);
    res.json(req.user);
});

app.post('/logout', function (req, res) {
    req.logout();
    res.sendStatus(200);
});

//express traffic

app.get('*', function (req, res) {
    res.sendFile('/index.html'); 

});

app.listen(3000);
console.log("running on 3000");