var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var aws = require('aws-sdk');
var Firebase = require('firebase');
var ThumbClient = require('thumbd').Client;

var app = express();
app.set('port', process.env.PORT || 5000);

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));



var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var AWS_REGION = process.env.AWS_REGION;
var S3_BUCKET = process.env.S3_BUCKET;
var SQS_QUEUE = process.env.SQS_QUEUE;
var FIREBASE_URL = process.env.FIREBASE_URL;

var eclipsePicsStore = new Firebase(FIREBASE_URL);

var thumbClient = new ThumbClient({
    awsKey: AWS_ACCESS_KEY,
    awsSecret: AWS_SECRET_KEY,
    awsRegion: AWS_REGION,
    sqsQueue: SQS_QUEUE,
    s3Bucket: S3_BUCKET,
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
    var title = req.body.title;
    var email = req.body.email;
    var pic_url = req.body.pic_url;
    var s3_url = pic_url.replace('https://'+S3_BUCKET+'.s3.amazonaws.com/', '');
    thumbClient.thumbnail(s3_url, [{
            suffix: 'thumb',
            width: 150,
            height: 150,
            background: 'red',
            strategy: 'fill'
        }], {
        // notify: 'https://callback.example.com', // optional web-hook when processing is done.
        // prefix: 'foobar' // optional prefix for thumbnails created.
    });
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
      res.redirect('/');
    });
});


app.listen(app.get('port'));

