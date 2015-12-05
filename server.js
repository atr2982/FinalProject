var express = require('express'),
    app = express(),
    mongojs = require('mongojs'),
    db = mongojs('beerdata', ['userlist']),
    bodyParser = require('body-parser');


app.use(express.static(__dirname + "/public")); //tells the server where to look for static files in the "public" folder
app.use(bodyParser.json());



//GET USER DATA
//GET USER DATA
app.get('/beerdata', function (req, res) {
    console.log("GET request");

    db.userlist.find(function (err, docs) {
        console.log("i got the data");
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
app.delete('/beerdata/:id', function(req, res) {
    var id = req.params.id;
    console.log(id);
    db.userlist.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
        res.json(doc);
    })
});


//EDIT
//EDIT
app.get('/beerdata/:id', function(req, res) {
    var id = req.params.id;
    console.log(id);
    db.userlist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
        console.log(doc);
        res.json(doc);
    });
});


//update after edit
app.put('/beerdata/:id', function(req, res) {
    var id = req.params.id;
    console.log(req.body.name);
    db.userlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
        update: {$set: {username: req.body.username, email: req.body.email}},
        new: true}, function(err, doc) {
        res.json(doc);
        
    });
});




app.listen(3000);
console.log("running on 3000"); 