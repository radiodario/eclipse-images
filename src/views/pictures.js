var React = require('react');
var { Link, RouteHandler, Navigation } = require('react-router');
var Firebase = require('firebase');

var IMAGE_SIZE = 150;
var IMAGE_MARGIN = 10;

var Pictures = React.createClass({
  mixins : [Navigation],

  getInitialState() {
    return {
      pictures: []
    }
  },

  componentWillMount () {
    this.picStore = new Firebase('https://eclipse-pics.firebaseio.com/');
    this.picStore.on('child_added', (child) => {
      var picture = child.val();
      picture.id = child.key();
      this.setState({pictures: this.state.pictures.concat([picture])});
    });
  },

  generateThumbUrl: function generateThumbUrl(url) {
    var extension = url.split('.').pop();
    var thumbUrl = url.split('.'+extension)[0]+'_thumb.jpg';

    return thumbUrl;
  },

  renderPicture (picture) {
    var styles = {
      display: 'inline-block',
      margin: IMAGE_MARGIN
    };

    return (
      <div style={styles} key={picture.id}>
        <Link to="picture" params={{id: picture.id}}>
          <img style={{height: IMAGE_SIZE, width: IMAGE_SIZE}}
            src={this.generateThumbUrl(picture.picUrl)}/>
        </Link>
      </div>
    );
  },

  render () {
    var pictures = this.state.pictures.map(this.renderPicture);

    return (
      <div>
        <div className="picture-gallery">
          {pictures}
        </div>
        <div className="center">
          <Link className="btn" to="upload">
            Upload your Picture
          </Link>
        </div>
      </div>
    );
  }

});

module.exports = Pictures;