const express = require('express');

const api = express.Router();

const planetRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');

api.use('/planets', planetRouter);
api.use('/launches', launchesRouter);

module.exports = api;