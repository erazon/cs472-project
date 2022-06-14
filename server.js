var express = require("express");
var app = express();
var ejs = require("ejs");

var cookieParser = require("cookie-parser");

const controllers = require('./controllers');

//Read the parameters from post request
app.use(cookieParser('pass-salt'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

const port = 80
app.listen(port,function(){
    console.log('server is running on post' , port);
});

app.use((req, res, next)=>{
    if(req.signedCookies && req.signedCookies.isLogged){
        if(req.url == '/login'){
            res.redirect('/cars');
        }
        else{
            next();
        }
    }
    else{
        if(req.url == '/login'){
            next();
        }
        else{
            res.redirect('/login');
        }
    }
});

app.get('/login', controllers.loginGet);
app.post('/login', controllers.loginPost);
app.get('/cars', controllers.cars);

app.use((req, res, next)=>{
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});
