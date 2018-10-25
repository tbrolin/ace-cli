#!/usr/bin/env node

const cmd = require('commander'),
  fs = require('fs'),
  axios = require('axios'),
  doT = require('doT'),
  uuid =  require('uuid/v4');

cmd
  .usage ('[options] <template> <numberOfContent>')
  .description ('Creates numberOfContent number of content from template.')
  .option ('--interval <ms>', 'Set the delay between generations', 50)
  .option ('-t, --token <token>', 'use token, if not provided trying to use $TOKEN from environment')
  .option ('-o, --output-format <format>', 'format of output (raw | pretty | console)','pretty')
  .option ('-P --port <port>', 'host port', '8080')
  .option ('-H --host <host>', 'host', 'localhost')
  .option ('-S --path <path>', 'path to service', '/content-service')
  .parse (process.argv);

  let token = cmd.token || process.env.TOKEN,
      data = cmd.args[0],
      numberOfContent = parseInt(cmd.args[1]),
      outputFormat = cmd.outputFormat,
      params = {},
      url = 'http://' + cmd.host + ':' + cmd.port + cmd.path + '/content';

  if (!token) {
    console.error ('ERROR: Cannot make request - no token present');
    cmd.help ();
  }

  if (isNaN (numberOfContent)) {
    if (cmd.args[1] === undefined) {
      numberOfContent = 1;
    } else {
      console.error ('ERROR: numberOfContent must be a positive integer.');
      cmd.help ();
    }
  }

  if (!Number.isInteger(cmd.interval)) {
    cmd.interval = parseInt(cmd.interval);
    if (isNaN (cmd.interval)) {
      console.error ('ERROR: --interval must be a positive integer');
      cmd.help ();
    }
  }

  try {
    if (data.startsWith ('@')) {
        template = fs.readFileSync (data.slice(1), 'utf8');
    } else {
        template = JSON.stringify (JSON.parse (data));
    }

    const createContent = function (content) {
      return axios.post (url, content,  { headers: { 'content-type': 'application/json', 'x-auth-token': token }, params: params })
      .catch(function (error) {
        if (error.response && error.response.data) {
          console.error(error.response.data.message);
        } else {
          console.log(error);
        }
        process.exit(1);
      });
    }

    if (numberOfContent > 0) {
      const generateData = doT.template (template);
      let counter = 0;
      console.time('duration');
      const intervalId = setInterval (function () {
        counter++;
        if (counter >= numberOfContent) {
          clearInterval(intervalId);
          createContent (generateData ({ uniq: uuid () }))
            .then (function () {
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(counter + '/' + numberOfContent + ' - Done.\n') ;
              console.timeEnd ('duration');
            });
        } else {
          createContent (generateData ({ uniq: uuid () }));
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(counter + '/' + numberOfContent);
        }
      }, cmd.interval);
    } else {
      console.log ('0/0 - No content generated');
    }
  } catch (error) {
      console.error (error.message);
      process.exit (1);
  }

