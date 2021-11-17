#!/usr/bin/env node

const cmd = require ('commander'),
  util =    require ('util'),
  axios =   require ('axios');

cmd
  .usage ('[options]')
  .option ('-c, --content-type <content-type>', 'Reindex only content of type content-type')
  .option ('-t, --token <token>', 'use token, if not provided trying to use $TOKEN from environment')
  .option ('-P --port <port>', 'host port', '8080')
  .option ('-H --host <host>', 'host', 'localhost')
  .option ('-S --service-path <path>', 'path to service', '/content-service')
  .parse (process.argv);

  const options = cmd.opts();

  const token = options.token || process.env.TOKEN,
      alias = cmd.args[0],
      outputFormat = options.outputFormat;

  if (!token) {
    console.error ('Cannot make request - no token present');
    cmd.help ();
  }

  let endpoint = '/full'
  if (options.contentType) {
    endpoint = `/contentType/${contentType}`
  }
  if (options.aliases) {
    endpoint = `${endpoint}?aliases=${options.aliases}`
  }

  const url = `http://${options.host}:${options.port}${options.servicePath}/index/reindex${endpoint}`

  axios.post (url, {},
    { headers: { 'content-type': 'application/json',
                 'x-auth-token': token } })
    .then (function (response) {
      console.error (response.data || response || 'No response ??');
    })
    .catch (function (error) {
      // console.error ('Could not issue a reindex -', error);
      if (error.response) {
        if (error.response.data) {
          console.error (util.inspect(error.response.data, {}));
        }
      } else {
        console.error (error.code);
        console.error (error.config.url);
      }
      consumer.close(true, () => {
        process.exit (1);
      });
    });

    process.on ('SIGINT', () => {
      console.error ('Closing consumer...');
      consumer.close(true, () => {
        console.error ('Consumer closed!');
        process.exit();
      });
    });