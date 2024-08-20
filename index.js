require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const shortid = require('shortid');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Basic Configuration
const port =  3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
const urlDatabase = {};

// Endpoint to create a short URL
app.post('/api/shorturl', (req, res) => {
    const { url } = req.body;

    // Check if the URL is valid
    if (!validUrl.isWebUri(url)) {
        return res.json({ error: 'invalid url' });
    }

    // Generate a short ID for the URL
    const shortUrl = shortid.generate();

    // Store the URL in the database
    urlDatabase[shortUrl] = url;

    // Respond with the original and short URL
    res.json({
        original_url: url,
        short_url: shortUrl
    });
});

// Endpoint to redirect to the original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
    const { shortUrl } = req.params;

    const originalUrl = urlDatabase[shortUrl];

    if (originalUrl) {
        // Redirect to the original URL
        res.redirect(originalUrl);
    } else {
        res.json({ error: 'No short URL found for the given input' });
    }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
