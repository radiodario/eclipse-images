var React = require('react');
var {Link, RouteHandler, Navigation } = require('react-router');
var S3Upload = require('../utils/s3upload');
var uuid = require('node-uuid');

var Upload = React.createClass({

  mixins: [Navigation],

  handleUpload: function() {
    var status_elem = document.getElementById("status");
    var url_elem = document.getElementById("pic_url");
    var preview_elem = document.getElementById("preview");
    var s3upload = new S3Upload({
        s3_object_name: 'eclipse-images/'+uuid.v1(),
        file_dom_selector: 'files',
        s3_sign_put_url: '/sign_s3',
        onProgress: function(percent, message) {
            status_elem.innerHTML = 'Upload progress: ' + percent + '% ' + message;
        },
        onFinishS3Put: function(public_url) {
            status_elem.innerHTML = 'Upload completed. Uploaded to: '+ public_url;
            url_elem.value = public_url;
            preview_elem.innerHTML = '<img src="'+public_url+'" style="width:300px;" />';
        },
        onError: function(status) {
            status_elem.innerHTML = 'Upload error: ' + status;
        }
    });
  },

  render: function() {
    return (
      <div className="section center">
        <h1>Upload your Image of the Eclipse</h1>

        <div id="preview">
          <img src="/img/default.png" style={{width:300}} />
        </div>
        <div id="selectwrapper">
            <p id="status"></p>
            <p>
              <input type="file" id="files" className="custom-file-input" onChange={this.handleUpload}/>
            </p>
        </div>
        <form method="POST" action="/submit_form/">
            <input type="hidden" id="pic_url" name="pic_url" value="/img/default.png" />
            <input type="text" name="title" placeholder="title" /><br />
            <input type="text" name="email" placeholder="email" /><br /><br />
            <input type="submit" className="btn" value="Submit Picture" />
        </form>
      </div>
    );
  }

});


module.exports = Upload;