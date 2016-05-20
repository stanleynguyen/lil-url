module.exports.writeData = function(id, oriUrl){
    var mongo = require("mongodb").MongoClient;
    
    mongo.connect('mongodb://stanley:hung123@ds025232.mlab.com:25232/lilurl', function(err, db){
        if(err) throw err;
        db.collection('lilurls').insert({
            "_id": id,
            'original': oriUrl
        }, function(){
            db.close();
        });
    });
}

module.exports.getCount = function(fn, oriUrl, res, req){
    var mongo = require('mongodb').MongoClient;
    
    mongo.connect('mongodb://stanley:hung123@ds025232.mlab.com:25232/lilurl', function(err, db){
        if(err) throw err;
        db.collection('lilurls').count({}, function(err, count){
            if(err) throw err;
            fn(count, oriUrl);
            var hostUrl = req.protocol+'://'+req['hostname']+'/';
            res.render(__dirname+'/views/new.ejs', {oriUrl: oriUrl, shortUrl: hostUrl+count.toString()});
            db.close();
        });
    });
}
