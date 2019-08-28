//echo "# FTI2095_lab4" >> README.md
//git init
// git add README.md
// git commit -m "first commit"
// git remote add origin https://github.com/celinescode/FTI2095_lab4.git
// git push -u origin master

var express=require('express');
var app=express();
var db = [];
//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
let bodyParser = require('body-parser')

//Setup the view Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Setup the static assets directories, without this step they will not be able to use
app.use(express.static('images'));
app.use(express.static('css'));

app.use(bodyParser.urlencoded({
    extended: false //only string or array
}))

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
    res.render("listTasks",{taskDb: db});
});

//when receive a new task
app.post('/newtask',function(req,res){
    db.push(req.body);
    res.render("listtasks",{taskDb: db});
});


app.listen(8080,()=>console.log("server is running at http://localhost:8080"))