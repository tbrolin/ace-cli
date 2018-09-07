#!/usr/bin/env node
const cmd = require('commander'),
  version = require('./package.json').version;

cmd
  .version (version)
  .description ('Collection of useful scripts when working with an ace system.')
  .command ('token', 'Get auth token')
  .command ('create', 'Create a content')
  .command ('read <alias> [view]', 'Read content by alias [from view]')
  .command ('reindex', 'Issue a reindexing of content')
  .parse (process.argv);
