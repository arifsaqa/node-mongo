const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const  api  = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../server/', 'public')))
app.use(morgan('combined'));

app.use('/v1', api);
app.get('/*', (req, res) => {
 return res.sendFile(path.join(__dirname, '../../server/', 'public','index.html'));
})

module.exports = app;