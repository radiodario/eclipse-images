var React = require('react');
var { Link, RouteHandler, Navigation } = require('react-router');
var Firebase = require('firebase');
var IMAGE_SIZE = 150;
var IMAGE_MARGIN = 10;

var Pictures = React.createClass({
  mixins : [Navigation],

  getInitialState () {
    return {
      viewportWidth: window.innerWidth,
      lastChildId: null,
      pictures: []
    }
  },

  handleResize () {
    this.setState({ viewportWidth: window.innerWidth })
  },

  componentWillMount () {
    this.picStore = new Firebase('https://eclipse-pics.firebaseio.com/');
    this.picStore.on('value', (picsObject) => {
      var pictures = this._toArray(picsObject.val());
      this.setState({pictures: pictures});
    });
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize);
  },

  /* Returns true if the inputted object is a JavaScript array */
  _isArray (obj) {
    return (Object.prototype.toString.call(obj) === "[object Array]");
  },

  /* Converts a Firebase object to a JavaScript array */
  _toArray (obj) {
    var out = [];
    if (obj) {
      if (this._isArray(obj)) {
        out = obj;
      }
      else if (typeof(obj) === "object") {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            obj[key].id = key;
            out.push(obj[key]);
          }
        }
      }
    }
    return out;
  },

  generateThumbUrl (url) {
    var extension = url.split('.').pop();
    var thumbUrl = url.split('.'+extension)[0]+'_thumb.jpg';

    return thumbUrl;
  },

  calcPicturesPerRow () {
    var fullWidth = IMAGE_SIZE + (IMAGE_MARGIN * 2);
    return Math.floor(this.state.viewportWidth / fullWidth);
  },

  calcRowWidth () {
    var fullWidth = IMAGE_SIZE + (IMAGE_MARGIN * 2);
    var picsPerRow = this.calcPicturesPerRow();
    var numberOfPics = this.state.pictures.length;
    if (numberOfPics < picsPerRow) {
      return numberOfPics * fullWidth;
    }
    return picsPerRow * fullWidth;
  },

  calcRows () {
    var picsPerRow = this.calcPicturesPerRow();
    return this.state.pictures.reduce((rows, picture, index) => {
      if (index % picsPerRow === 0)
        rows.push([]);
      rows[rows.length - 1].push(picture);
      return rows
    }, [[]]);
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

  renderRow (row, index) {
    return (
      <div key={index}>
        {row.map(this.renderPicture)}
      </div>
    )
  },

  render () {
    var pictures = this.calcRows().map(this.renderRow);
    var rowWidth = this.calcRowWidth();
    return (
      <div>
        <div className="picture-gallery" style={{width: rowWidth}}>
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