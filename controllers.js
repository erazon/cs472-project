const path = require("path");
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('cars.db');

let obj = {};

obj.cars = (req, res, next)=>{
    res.render('cars', {username:'admin'});
};

obj.index = (req, res, next)=>{
    console.log('index');
}

obj.loginGet = (req, res, next)=>{
    res.render('login.html', {error: false});
};

obj.loginPost = (req, res, next)=>{
    db.get("SELECT username, password from users where username=$username and password=$password", {
        $username: req.body.username,
        $password: req.body.password
    }, (err, row)=>{
        console.log(row);
        if(row){
            //console.log(row);
            res.cookie('isLogged', false, {maxAge: 1000*60*60*24*7, signed: true});
            res.redirect('/cars');
        }
        else{
            res.render('login.html', {error: "! You have entered invalid username/password "});
        }
    });
};

module.exports = obj;