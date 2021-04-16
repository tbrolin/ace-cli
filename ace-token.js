#!/usr/bin/env node

const cmd = require('commander'),
  version = require('./package.json').version,
  axios = require('axios');

cmd
  .option ('-u, --username <username>', 'username', 'admin')
  .option ('-p, --password <password>', 'password', '123456')
  .option ('-P --port <port>', 'host port', '8080')
  .option ('-H --host <host>', 'host', 'http://localhost')
  .option ('-S --path <path>', 'path to service', '/content-service')
  .parse (process.argv);

  let url = cmd.host + ':' + cmd.port + cmd.path + '/security/token';

  axios.post (url,
    { username: cmd.username, password: cmd.password },
    { headers: { 'content-type': 'application/json' } })
    .then (function (response) {
      console.log (response.data.token);
    })
    .catch (function (error) {
      console.error ('Could not get token -', error.code);
      if (error && error.message && error.message.data) {
        console.error (error.response.data.message);
      }
    });