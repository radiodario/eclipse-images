var React = require('react');
var Router = require('react-router');
var Pictures = require('./views/pictures');
var Picture = require('./views/picture');
var Upload = require('./views/upload');

var { Route, RouteHandler } = Router;

var App = React.createClass({
  render: function() {
    return (
      <div>
        <div className="logoholder center shadow">
          <svg height="100" width="100">
            <circle fill="#FFFFFF" cx="45.756" cy="49.532" r="37.243"/>
            <path fill="#FFFFFF" d="M54.771,87.775c-20.528,0-37.229-17.221-37.229-38.388S34.243,11,54.771,11S92,28.221,92,49.388    S75.3,87.775,54.771,87.775z M54.771,13c-19.425,0-35.229,16.323-35.229,36.388s15.804,36.388,35.229,36.388    C74.196,85.775,90,69.452,90,49.388S74.196,13,54.771,13z"/>
          </svg>
          <h2 className="tagline">Eclipse Pics</h2>
        </div>

        <RouteHandler {...this.props}/>
      </div>
      );
  }
});


var routes = (
  <Route handler={App}>
    <Route name="pictures" path="/" handler={Pictures}/>
    <Route name="picture" path="picture/:id" handler={Picture}/>
  // <Route name="upload" path="/upload" handler={Upload}/>
  </Route>
);

Router.run(routes, function (Handler, state) {
  React.render(<Handler {...state}/>, document.getElementById('container'));
});