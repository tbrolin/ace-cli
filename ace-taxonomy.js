#!/usr/bin/env node

const cmd = require('commander'),
  axios = require('axios');

cmd
  .usage ('[options] taxonomy_id <depth>')
  .option ('-t, --token <token>', 'use token, if not provided trying to use $TOKEN from environment')
  .option ('-o, --output-format <format>', 'format of output (raw | pretty | console)','pretty')
  .option ('-i, --include-headers', 'Include the response headers in the output')
  .option ('-P --port <port>', 'host port', '8080')
  .option ('-H --host <host>', 'host', 'localhost')
  .option ('-S --path <path>', 'path to service, should always start with "/"', '/taxonomy-service')
  .parse (process.argv);

  let token = cmd.token || process.env.TOKEN,
      taxonomy_id = cmd.args[0],
      depth = parseInt(cmd.args[1]),
      outputFormat = cmd.outputFormat,
      params = {},
      url = 'http://' + cmd.host + ':' + cmd.port;

  if (cmd.path && cmd.path !== '/') {
    url = url + cmd.path + '/structure';
  }

  if (!token) {
    console.error ('Cannot make request - no token present');
    cmd.help ();
  }

  if (taxonomy_id) {
    url += `/${taxonomy_id}`;
  }

  if (depth) {
    params.depth = depth;
  }

  axios.get (url,
    { headers: { 'content-type': 'application/json',
                 'x-auth-token': token },
      params: params })
    .then (function (response) {
      let output = response.data;

      if (cmd.includeHeaders) {
        output = {
          structure: output,
          'http-headers': response.headers
        };
      }

      if (outputFormat === 'raw') {
        console.log (JSON.stringify(output));
      } else if (outputFormat === 'pretty') {
        console.log (JSON.stringify(output, null, 2));
      } else if (outputFormat === 'console') {
        console.dir (output, { depth: null, colors: true });
      } else {
        console.error ('Unknown output format "' + outputFormat + '". Defaulting to "pretty"');
        console.log (JSON.stringify(output, null, 2));
      }
    })
    .catch (function (error) {
      // console.error ('Could not fetch content -', error);
      if (error.response) {
        if (error.response.status) {
          console.error (error.response.status);
        } 
        if (error.response.data) {
          console.error (error.response.data.message);
        }
      } else {
        console.error (error.code);
        console.error (error.config.url);
      }
    });