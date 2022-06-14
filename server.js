var express = require("express");
var app = express();
var ejs = require("ejs");

var cookieParser = require("cookie-parser");

const controllers = require('./controllers');

//Read the parameters from post request
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.listen(3000,function(){
    console.log('server is running on 3000');
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

app.get('/', controllers.search);

app.post('/', controllers.search);

app.get('/login', controllers.loginGet);
app.post('/login', controllers.loginPost);

app.get('/preview', controllers.preview);

app.get('/preview-bg', controllers.previewBG);

app.get('/visit-count', controllers.visitCount);
