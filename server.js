const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require('path');

const cookieParser = require("cookie-parser");

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

app.get('/', controllers.index);
app.get('/add-car', controllers.carEntryForm);
app.post('/add-car', controllers.carSave);
app.delete('/delete-car', controllers.carDelete);
app.post('/car-list', controllers.carList);
//app.post('/car-sort', controllers.carSort);
app.get('/cars', controllers.cars);
app.get('/login', controllers.loginGet);
app.post('/login', controllers.loginPost);
app.get('/logout', controllers.logout);

app.use((req, res, next)=>{
    res.status(404).sendFile(path.join(__dirname, 'views','404.html'));
});
