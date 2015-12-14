var express         = require('express'),
    app             = express(),
    mongojs         = require('mongojs'),
    db              = mongojs('beerdata', ['userlist']),
    bodyParser      = require('body-parser'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    expressSession  = require('express-session'),
    objectId        = require('mongojs').ObjectId,
    UserManagement  = require('user-management'),
    port 		    = process.env.PORT || 3000;


//severside management

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
    db.userlist.find(function (err, docs) {
        res.json(docs);
    });
});

//REGISTER
//REGISTER
app.post('/beerdata', function (req, res) { //*data flow 4* app.get written to match $http.get in controller.js so the server can receive the data
    console.log('request user',req.body.username);

            db.userlist.findOne({'username' : req.body.username},function(err,docs){
                console.log(docs);

                if(docs){
                    console.log('user exists');
                }else{
                    db.userlist.insert(req.body, function (err, doc) {
                        res.json(docs);
                    })
                }

            });

});

app.get('/beerdata/:id', function (req, res){

    var id = req.params.id;

    db.userlist.findOne({
        _id : mongojs.ObjectId(id)
    },function(err,docs){
        res.json(docs);
    })


});


//DELETE
//DELETE
app.get('/beerdata/:id', function (req, res) {
    var id = req.params.id;
//    console.log(id);
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
//    console.log(id);
    db.userlist.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, doc) {
//        console.log(doc);
        res.json(doc);
    });
});

//CHECKIN BEER
//CHECKIN BEER
app.put('/beerdata/:bdata', function (req, res) {

    console.log(req.params.bdata);
    console.log(req.body);
    var name = req.params.bdata;

    console.log(req.params.checkFunt);

    db.userlist.update({
        username: name
    }, {
        $push: {
            beers: {

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

app.put('/beerdata/:uData', function (req, res) {

    console.log(req.params.uData);
    console.log(req.body);
    var name = req.params.uData;

    db.userlist.update({
        username: name
    }, {
        $push: {
            wishBeers: {

                wname: req.body.wname,
                wlabel: req.body.wlabel,
                wstyle: req.body.wstyle,
                wabv: req.body.wabv,
                wdesc: req.body.wdesc
            }
        }
    }, function (err, doc) {
        res.json(doc);
        console.log(doc);
    });


});

app.post('/login', passport.authenticate('local'), function (req, res) {
    res.json(req.user);
});

app.get('/userCheck', function (req, res) {
//    console.log(req.user);
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

app.listen(port);
console.log("running on port: ", port);
