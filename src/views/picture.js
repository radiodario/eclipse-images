var React = require('react');
var { Link, RouteHandler, Navigation} = require('react-router');
var Firebase = require('firebase');


var Picture = React.createClass({
  mixins: [Navigation],

  getInitialState() {
    return {
      picture : {}
    }
  },

  componentWillMount () {
    this.pic = new Firebase('http://eclipse-pics.firebaseio.com/' + this.props.params.id);
    this.pic.on('value', function(snapshot) {
      this.setState({picture: snapshot.val()})
    }.bind(this))
  },

  render () {
    return (
      <div className="picturePage">
        <img src={this.state.picture.picUrl}/>
      </div>
      );
  }



});

module.exports = Picture;