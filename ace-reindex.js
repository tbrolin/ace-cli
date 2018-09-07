#!/usr/bin/env node

const cmd = require('commander'),
  version = require('./package.json').version,
  axios = require('axios');

cmd
  .usage ('[options]')
  .option ('-c, --content-type <content-type>', 'Reindex only content of type content-type')
  .option ('-t, --token <token>]', 'use token, if not provided trying to use $TOKEN from environment')
  .option ('-o, --output-format <format>', 'format of output (raw | pretty | console)','pretty')
  .option ('-P --port <port>', 'host port', '8080')
  .option ('-H --host <host>', 'host', 'localhost')
  .option ('-S --service-path <path>', 'path to service', '/content-service')
  .parse (process.argv);

  let token = cmd.token || process.env.TOKEN,
      alias = cmd.args[0],
      outputFormat = cmd.outputFormat;

  if (!token) {
    console.error ('Cannot make request - no token present');
    cmd.help ();
  }

  let contentType = cmd.contentType ? '?contentType=' + cmd.contentType
                                    : '';

  let url = 'http://' + cmd.host + ':' + cmd.port + cmd.servicePath + '/index/reindex' + contentType;

  axios.post (url, {},
    { headers: { 'content-type': 'application/json',
                 'x-auth-token': token } })
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
      // console.error ('Could not issue a reindex -', error);
      if (error && error.response && error.response.data) {
        console.error (error.response.data.message);
      }
    });