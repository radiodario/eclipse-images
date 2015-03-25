var S3Upload = require('./s3upload');
var uuid = require('node-uuid');

function s3_upload(){
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
}

(function() {
    var input_element = document.getElementById("files");
    input_element.onchange = s3_upload;
})();