const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Form = require('./form');
const CanvasAPI = require('./canvas-api');
const DinoPassAPI = require('./dinopass-api');

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  const formHtml = ReactDOMServer.renderToString(React.createElement(FormComponent));
  const html = `
    <html>
      <head>
        <title>Canvas Sandpit Generator</title>
      </head>
      <body>
        <div id="root">${formHtml}</div>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `;
  res.send(html);
});

app.post('/', async (req, res) => {
  const form = new Form((result) => {
    res.send(result);
  });
  const errors = form.validate(req.body);
  if (Object.keys(errors).length > 0) {
    res.status(400).send(errors);
  } else {
    await form.submit(req.body);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});
