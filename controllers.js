const path = require("path");
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('cars.db');

let obj = {};

obj.cars = (req, res, next)=>{
    res.render('cars', {username:'admin'});
};

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

obj.previewBG = (req, res, next)=>{
    let visit = 1;
    if(req.cookies.previewVisit){
        visit = parseInt(req.cookies.previewVisit);
    }
    if(visit <= 2){
        bg = "yellow";
    }
    else{
        bg = "green";
    }
    res.send(bg);
};

obj.search = (req, res, next)=>{
    // init search history
    let history = {
        make: {
            '2019': 0,
            '2020': 0,
            '2021': 0
        },
        model: {
            'yes': 0,
            'no': 0
        }
    };
    if(req.cookies.searchHistory){
        console.log(req.cookies.searchHistory);
    }
    else{
        res.cookie('searchHistory', history);
    }
    
    let visit = 1;
    if(req.cookies.searchVisit){
        visit = parseInt(req.cookies.searchVisit) + 1;
    }
    res.cookie('searchVisit', visit);
    res.sendFile(path.join(__dirname, '../views/search.html'));
};

obj.visitCount = (req, res, next)=>{
    let visitPreview = 0;
    if(req.cookies.searchVisit){
        visitPreview = parseInt(req.cookies.previewVisit);
    }
    let visitSearch = 0;
    if(req.cookies.searchVisit){
        visitSearch = parseInt(req.cookies.searchVisit);
    }
    res.send({visitPreview:visitPreview, visitSearch:visitSearch});
};

obj.search = (req, res, next)=>{
    if(req.cookies.searchHistory){
        history = req.cookies.searchHistory;
        history.make[req.body.make]++;
        history.model[req.body.model]++;
    }
    
    console.log(req.body);
    res.cookie('userData', req.body);
    res.cookie('searchHistory', history);
    res.redirect('/preview');
};

module.exports = obj;