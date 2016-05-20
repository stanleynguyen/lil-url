var express = require("express");
var mongo = require("mongodb").MongoClient;
var myEngine = require("./engine");

var app = express();

app.get('/', function(req, res){
    res.render(__dirname+'/views/index.ejs');
});

app.get('/new/:url', function(req, res){
    var url = req.params.url.replace(/itsaslash/g, '/').replace(/itsaquestion/g, '?').replace(/itsaequal/g, '=').replace(/itsahash/g, '#');
    mongo.connect('mongodb://stanley:hung123@ds025232.mlab.com:25232/lilurl', function(err, db){
        if(err) throw err;
        db.collection('lilurls').find({
            'original': url
        }).toArray(function(err, docs){
            if(err) throw err;
            if(docs.length === 0){
                myEngine.getCount(myEngine.writeData, url, res, req);
            }else{
                var hostUrl = req.protocol+'://'+req['hostname']+'/';
                res.render(__dirname+'/views/new.ejs', {oriUrl: url, shortUrl: hostUrl+docs[0]['_id']});
            }
            db.close();
        });
    });
});


app.get('/:id', function(req, res){
    if(isNaN(Number(req.params.id))){
        res.render(__dirname+'/views/notindb.ejs', {url: req.protocol+'://'+req.hostname+req.url});
    }else{
        mongo.connect('mongodb://stanley:hung123@ds025232.mlab.com:25232/lilurl', function(err, db){
            if(err) throw err;
            db.collection('lilurls').find({
                '_id': Number(req.params.id)
            }).toArray(function(err, docs){
                if(err) throw err;
                if(docs.length === 0){
                    res.render(__dirname+'/views/notindb.ejs', {url: req.protocol+'://'+req.hostname+req.url});
                }else{
                    res.redirect('http://'+docs[0].original);
                }
            });
        });
    }
});

app.listen(process.env.PORT, function(){
    console.log('LISTENING AT', process.env.PORT);
});