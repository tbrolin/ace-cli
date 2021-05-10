#!/usr/bin/env node

const cmd = require('commander'),
  fs = require('fs'),
  axios = require('axios');

cmd
  .usage ('[options] <data | @filepath> <matcher>')
  .option ('-m, --updateMode <mode>', '[merge | update | replace]')
  .option ('-t, --token <token>', 'use token, if not provided trying to use $TOKEN from environment')
  .option ('-o, --output-format <format>', 'format of output (raw | pretty | console)','pretty')
  .option ('-P --port <port>', 'host port', '8080')
  .option ('-H --host <host>', 'host', 'localhost')
  .option ('-S --path <path>', 'path to service', '/content-service')
  .parse (process.argv);

  let token = cmd.token || process.env.TOKEN,
      data = cmd.args[0],
      matcher = cmd.args[1],
      outputFormat = cmd.outputFormat,
      updateMode = cmd.updateMode || 'update',
      params = {},
      url = 'http://' + cmd.host + ':' + cmd.port + cmd.path + '/content';

  if (!token || !data || !matcher) {
    console.error();
    !token && console.error ('  ERROR: No token present');
    !data && console.error ('  ERROR: No data provided.');
    !matcher && console.error ('  ERROR: No matcher provided.');
    console.error ()
    cmd.help ();
  }

  try {
    if (data.startsWith ('@')) {
        data = JSON.parse (fs.readFileSync (data.slice(1), 'utf8'));
    } else {
        data = JSON.parse (data);
    }
  } catch (error) {
      console.error ();
      console.error (`  ERROR: ${error.message}`);
      console.error ();
      cmd.help ();
  }

  delete data.status
  url += '/alias/' + data.system.id + '?updateMode=' + updateMode

  axios.put (url, data,
    { headers: { 'content-type': 'application/json',
                 'x-auth-token': token, 'if-match': matcher },
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
      if (error.response) {
        let msg = error.response.status || 'NO_STATUS';
        if (error && error.response && error.response.data) {
          msg += ' - ' + error.response.data.message;
        }
        console.error (msg, error);
      } else {
        console.error ('Something went wrong', error);
      }

    });