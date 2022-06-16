const path = require("path");
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('cars.db');

let obj = {};

obj.index = (req, res, next)=>{    
    res.redirect('/cars')
};

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
    //console.log(req.query.id);
    const carTypes = 
        {
            "Acura": ["CL", "ILX", "ILX Hybrid"],
            "Audi": ["A6", "A7", "A8"],
            "BMW": ["1500", "1600", "2000"],
            "Buick": ["California", "Cascada", "Centurion"]
        };

    if(req.query.id){
        db.get("SELECT make, model from cars where id=$id", {
            $id: req.query.id
        }, (err, row)=>{
            console.log(row);
            if(row){
                console.log(row);
                res.render('addCar', {carTypes:carTypes, username:req.cookies.username, error: false});
            }
            else{
                res.render('addCar', {carTypes:carTypes, username:req.cookies.username, error: false});
            }
        });
    }
    else{
        res.render('addCar', {carTypes:carTypes, username:req.cookies.username, error: false});
    }
}

obj.carList = (req, res, next)=>{
    let filter = ["id>0"];
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
    //console.log(filter);
    db.all("SELECT * from cars WHERE " + filter, (err, row)=>{
        //console.log(row, err);
        res.send(row);
    });
}

obj.cars = (req, res, next)=>{
    res.render('cars', {username:req.cookies.username});
};

obj.carSave = (req, res, next)=>{
    db.run("INSERT INTO cars (condition, make, model, price, distance, zip) VALUES (?,?,?,?,?,?)",
    ["Used", "BMW", "1500", 5000, "22 miles", "52552"], function(err){
        //console.log(err);
        //console.log(this.lastID);
        if(err){
            res.render('addCar', {error: "Something went wrong. Please try again."});
        }
        else{
            res.redirect('/cars');
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