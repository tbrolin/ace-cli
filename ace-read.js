#!/usr/bin/env node

function resolveArg (alias) {
  let split = alias && alias.split (':') || [];
  if (split.length > 1) {
    return { alias: split[1], workspace: split[0] };
  }
  return { alias };
}

const cmd = require('commander'),
  version = require('./package.json').version,
  axios = require('axios');

cmd
  .usage ('[options] [<workspaceId>:]<alias> [view]')
  .description ('alias is on the format: namespace/alias, workspaceId and view are mutually exclusive, workspaceId takes precedence.')
  .option ('-t, --token <token>', 'use token, if not provided trying to use $TOKEN from environment')
  .option ('-o, --output-format <format>', 'format of output (raw | pretty | console)','pretty')
  .option ('-i, --include-headers', 'Include the response headers in the output')
  .option ('--metadata', 'read content metadata')
  .option ('-v, --variant <variant>', 'get content in variant')
  .option ('-P --port <port>', 'host port', '8080')
  .option ('-H --host <host>', 'host', 'localhost')
  .option ('-S --path <path>', 'path to service, should always start with "/"', '/content-service')
  .parse (process.argv);

  let token = cmd.token || process.env.TOKEN,
      { alias, workspace } = resolveArg (cmd.args[0]),
      view = cmd.args[1],
      outputFormat = cmd.outputFormat,
      params = {},
      url = 'http://' + cmd.host + ':' + cmd.port;

  if (cmd.path && cmd.path !== '/') {
    url = url + cmd.path;
  }

  if (!token) {
    console.error ('Cannot make request - no token present');
    cmd.help ();
  }

  if (!alias) {
    console.error ('Cannot make request - no alias present');
    cmd.help ();
  }

  if (workspace) {
    url += '/content/workspace/' + workspace + '/alias/' + alias;
    if (view) {
      console.warn ('WARNING: Getting workspace content on a view is not supported (view argument is ignored).');
    }
  } else if (view) {
    url += '/content/view/' + view + '/alias/' + alias;
  } else {
    url += '/content/alias/' + alias;
  }

  if (cmd.variant) {
    params.variant = cmd.variant;
  }

  if (cmd.metadata) {
    url += '/metadata';
  }

  axios.get (url,
    { headers: { 'content-type': 'application/json',
                 'x-auth-token': token },
      params: params })
    .then (function (response) {
      let output = response.data;

      if (cmd.includeHeaders) {
        output['http-headers'] = response.headers;
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