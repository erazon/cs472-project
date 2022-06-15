const path = require("path");
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('cars.db');

let obj = {};

obj.carDelete = (req, res, next)=>{
    //console.log(req.query.id);
    db.run("DELETE from cars WHERE id=?",
    [req.query.id], function(err){
        //console.log(err);
        if(err){
            res.send({deleted: false});
        }
        else{
            res.send({deleted: true});
        }
    });
};

obj.carEntryForm = (req, res, next)=>{
    res.render('addCar', {error: false});
}

obj.carFilter = (req, res, next)=>{
    let filter = [];
    if(req.body.condition){
        filter.push("condition="+req.body.condition);
    }
    if(req.body.make){
        filter.push("make="+req.body.make);
    }
    if(req.body.model){
        filter.push("model="+req.body.model);
    }
    filter = filter.join(' AND ');
    if(filter){
        db.all("SELECT * from cars WHERE ", (err, row)=>{
            res.send({data: row});
        });
    }
}

obj.cars = (req, res, next)=>{
    let data = [];
    db.all("SELECT * from cars", (err, row)=>{
        res.render('cars', {username:req.cookies.username, data: row});
    });
};

obj.carSave = (req, res, next)=>{
    db.run("INSERT INTO cars (condition, make, model, price, distance, zip) VALUES (?,?,?,?,?,?)",
    ["Used", "BMW", "M-850", 35000, "22 miles", "52552"], function(err){
        //console.log(err);
        //console.log(this.lastID);
        if(err){
            res.render('addCar', {error: "Something went wrong. Please try again."});
        }
    });
}

obj.loginGet = (req, res, next)=>{
    res.render('login', {error: false});
};

obj.loginPost = (req, res, next)=>{
    db.get("SELECT username, password from users where username=$username and password=$password", {
        $username: req.body.username,
        $password: req.body.password
    }, (err, row)=>{
        console.log(row);
        if(row){
            //console.log(row);
            res.cookie('isLogged', true, {maxAge: 1000*60*60*24*7, signed: true});
            res.cookie('username', req.body.username);
            res.redirect('/cars');
        }
        else{
            res.render('login', {error: "! You have entered invalid username/password "});
        }
    });
};

obj.logout = (req, res, next)=>{
    res.clearCookie('isLogged');
    res.redirect('/login');
}

module.exports = obj;