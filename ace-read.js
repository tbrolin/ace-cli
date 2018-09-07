#!/usr/bin/env node

const cmd = require('commander'),
  version = require('./package.json').version,
  axios = require('axios');

cmd
  .usage ('[options] <alias> [view]')
  .option ('-t, --token <token>', 'use token, if not provided trying to use $TOKEN from environment')
  .option ('-o, --output-format <format>', 'format of output (raw | pretty | console)','pretty')
  .option ('-v, --variant <variant>', 'get content in variant')
  .option ('-P --port <port>', 'host port', '8080')
  .option ('-H --host <host>', 'host', 'localhost')
  .option ('-S --path <path>', 'path to service', '/content-service')
  .parse (process.argv);

  let token = cmd.token || process.env.TOKEN,
      alias = cmd.args[0],
      view = cmd.args[1],
      outputFormat = cmd.outputFormat,
      params = {},
      url = 'http://' + cmd.host + ':' + cmd.port + cmd.path;

  if (!token) {
    console.error ('Cannot make request - no token present');
    cmd.help ();
  }

  if (!alias) {
    console.error ('Cannot make request - no alias present');
    cmd.help ();
  }

  if (view) {
    url += '/content/view/' + view + '/alias/' + alias;
  } else {
    url += '/content/alias/' + alias;
  }

  if (cmd.variant) {
    params.variant = cmd.variant;
  }

  axios.get (url,
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
      console.error (error.response.status);
      if (error && error.response && error.response.data) {
        console.error (error.response.data.message);
      }
    });