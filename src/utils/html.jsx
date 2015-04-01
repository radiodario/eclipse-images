var React = require('react');

// Handle the HTML rendering on the server
var Html = React.createClass({
render: function() {
  return (
      <html lang="en">
        <head>
          <meta charSet="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=0.75"/>
          <meta name="theme-color" content="#212b39"/>
          <title>Eclipse Images</title>
          <link rel="stylesheet" href="/style.css"/>
        </head>
        <body>
          <div id="container" className="cont" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
          <script type="text/javascript" src="/js/app.js"></script>
        </body>
      </html>
  );
}
});

module.exports = Html;