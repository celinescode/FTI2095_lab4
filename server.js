// git commit -m "first commit"
// git remote add origin https://github.com/celinescode/FTI2095_lab4.git
// git push -u origin master

var express=require('express');
var app=express();

//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
let bodyParser = require('body-parser');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017/";
//reference to the database (i.e. collection)
let db;
//Connect to mongoDB server
MongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true},function(err,client){
    if(err){
        console.log('err',err);
    }else{
        db = client.db('fit2095db');
        console.log("Connected successfully to server");
        
    }
})

//config, Setup the view Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html'); // use html template

//Setup the static assets directories, without this step they will not be able to use
app.use(express.static('images'));
app.use(express.static('css'));
//when a request arrive, bodyparser will do some pre-processing
app.use(bodyParser.urlencoded({
    extended: false //only string or array
}));
app.use(bodyParser.json()); //handle more complex format such as nested

//home page
app.get('/', function (req, res) {
    res.render('index.html');
});

//newtask page
app.get('/newtask', function (req, res) {
    res.render('newtask.html')  
})

//list tasks page
app.get('/listtasks',function(req,res){
    db.collection('task').find({}).toArray(function (err, data) {
        res.render('listTasks', { tasks: data });   
    });
});

app.get('/deletetask',function (req,res) {
    res.render('deletetask.html')
    
})

app.get('/deletecomplete', function (req,res) {
    db.collection('task').find({}).toArray(function (err, data) {
        res.render('deletecomplete', { tasks: data });   
    });    
})

app.get('/updatetask', function (req,res) {
    res.render('updatetask.html')
    
})

//when receive a new post request
// app.post('/addnewtask',function(req,res){ // need to be same path with the form
//     db.push(req.body);
//     console.log(req.body);
//     res.render("listtasks",{taskDb: db});
// });

//POST request: receive the details from the client and insert new document (i.e. object) to the collection (i.e. table)
app.post('/addnewtask', function (req, res) {
    let taskDetails = req.body;
    //let date = new Date(taskDetails.dueDate);

    db.collection('task').insertOne({ taskName: taskDetails.taskName, assignTo: taskDetails.assignTo, dueDate: taskDetails.dueDate, taskStatus: taskDetails.taskStatus, taskDescription: taskDetails.taskDescription });
    res.redirect('/listtasks'); // redirect the client to list users page
});

app.post('/deletetaskdata',function (req,res) {

    let query ={_id: new mongodb.ObjectID(req.body.taskID)};
    db.collection('task').deleteOne(query);
    res.redirect('/listtasks')
    console.log('a task has been deleted')
    
});

app.post('/deletecompletedata',function (req,res) {

    let query ={taskStatus: 'Completed'};
    db.collection('task').deleteMany(query,function (err,obj) {
        console.log(obj.result);
    });
    res.redirect('/listtasks')
    
});

app.post('/update', function (req,res) {
    let query ={_id: new mongodb.ObjectID(req.body.taskID)};
    let theUpdate = {$set: {taskStatus: req.body.taskStatus}};
    db.collection('task').updateOne(query, theUpdate);
    res.redirect('listtasks');

})


app.listen(8080,()=>console.log("server is running at http://localhost:8080"))