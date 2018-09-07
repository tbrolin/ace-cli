#!/usr/bin/env node

const cmd = require('commander'),
  fs = require('fs'),
  axios = require('axios');

cmd
  .usage ('[options] [data]')
  .option ('-t, --token <token>', 'use token, if not provided trying to use $TOKEN from environment')
  .option ('-o, --output-format <format>', 'format of output (raw | pretty | console)','pretty')
  .option ('-P --port <port>', 'host port', '8080')
  .option ('-H --host <host>', 'host', 'localhost')
  .option ('-S --path <path>', 'path to service', '/content-service')
  .parse (process.argv);

  let token = cmd.token || process.env.TOKEN,
      data = cmd.args[0],
      outputFormat = cmd.outputFormat,
      params = {},
      url = 'http://' + cmd.host + ':' + cmd.port + cmd.path + '/content';

  if (!token) {
    console.error ('Cannot make request - no token present');
    cmd.help ();
  }

  try {
    if (data.startsWith ('@')) {
        data = JSON.parse (fs.readFileSync (data.slice(1), 'utf8'));
    } else {
        data = JSON.parse (data);
    }
  } catch (error) {
      console.error (error.message);
      process.exit (1);
  }


  axios.post (url, data,
    { headers: { 'content-type': 'application/json',
                 'x-auth-token': token },
      params: params })
    .then (function (response) {
      if (outputFormat === 'raw') {
        console.log (JSON.stringify(response.data));
      } else if (outputFormat === 'pretty') {
        console.log (JSON.stringify(response.data, null, 2));
      } else if (outputFormat === 'console') {
        console.dir (response.data, { depth: null, colors: true });
      } else {
        console.error ('Unknown output format "' + outputFormat + '". Defaulting to "pretty"');
        console.log (JSON.stringify(response.data, null, 2));
      }
    })
    .catch (function (error) {
      // console.error ('Could not fetch content -', error);
      let msg = error.response.status || 'NO_STATUS';
      if (error && error.response && error.response.data) {
        msg += ' - ' + error.response.data.message;
      }
      console.error (msg);
    });