#!/usr/bin/env node
const cmd = require('commander'),
  version = require('./package.json').version;

cmd
  .version (version)
  .description ('Collection of useful scripts when working with an ace system.')
  .command ('create', 'Create a content')
  .command ('generate <template> <n>', 'Generate n content from template')
  .command ('read <alias> [view]', 'Read content by alias [from view]')
  .command ('reindex', 'Issue a reindexing of content')
  .command ('token', 'Get auth token')
  .parse (process.argv);
