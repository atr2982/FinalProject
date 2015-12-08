/**
 * Created by patrickhalton on 12/2/15.
 */
var express = require('express'),
        app = express(),
    mongojs = require('mongojs'),
         db = mongojs('beerdata',['userlist']),
 bodyParser = require('body-parser'),
    passport       = require('passport'),
    LocalStrategy  = require('passport-local').Strategy;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

passport.use(new LocalStrategy(
    function(username, password, done) {
        db.userlist.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));

app.get('/beerdata', function(req,res){
        console.log("GET request");

db.userlist.find(function(err,docs){

    console.log("i received");
    res.json(docs);

     });

});

app.post('/beerdata', function(req,res){//*data flow 4* app.get written to match $http.get in controller.js so the server can receive the data
    console.log(req.body);
    //req is the data going into the front end
    db.userlist.insert(req.body,function(err,doc){//doc is the object that is
       res.json(doc);//*data flow 5* res is the data coming back from the server/ res gets transferred to controller.js -->

    });
});

app.get('*', function (req, res) {
    res.sendFile('/index.html');
});
app.listen(3000);
console.log("running on 3000");