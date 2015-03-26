var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var aws = require('aws-sdk');
var Firebase = require('firebase');


var app = express();
app.set('port', process.env.PORT || 5000);

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));


var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;
var FIREBASE_URL = process.env.FIREBASE_URL;

var eclipsePicsStore = new Firebase(FIREBASE_URL);


app.get('/upload', function(req, res){
    res.render('upload.html');
});

app.get('/sign_s3', function(req, res){
    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
    var s3 = new aws.S3();
    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.s3_object_name,
        Expires: 60,
        ContentType: req.query.s3_object_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.s3_object_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
});

app.post('/submit_form', function(req, res){
    title = req.body.title;
    email = req.body.email;
    pic_url = req.body.pic_url;
    var picObject = {
      title:title,
      email:email,
      picUrl:pic_url
    };
    var ref = eclipsePicsStore.push(picObject, function onComplete(err) {
      if (err) {
        req.status(500);
      }
      var key = ref.key();
      res.redirect('/view/'+key);
    });
});


app.listen(app.get('port'));

