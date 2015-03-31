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
      <div className="picture-page">
        <img src={this.state.picture.picUrl} style={{"max-width": '90vw'}}/>
      </div>
      );
  }



});

module.exports = Picture;