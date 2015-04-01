var React = require('react');
var Router = require('react-router');
var { Route } = Router;

var Pictures = require('./views/pictures.jsx');
var Picture = require('./views/picture.jsx');
var Upload = require('./views/upload.jsx');
var App = require('./app.jsx');

var routes = (
  <Route handler={App}>
    <Route name="pictures" path="/" handler={Pictures}/>
    <Route name="picture" path="picture/:id" handler={Picture}/>
  // <Route name="upload" path="/upload" handler={Upload}/>
  </Route>
);

module.exports = routes;