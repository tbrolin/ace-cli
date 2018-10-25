#!/usr/bin/env node
const cmd = require('commander'),
  pkg = require('./package.json'),
  version = pkg.version,
  name = pkg.name;

cmd
  .version (name + ' ' + version)
  .description ('Collection of useful scripts when working with an ace system.')
  .command ('config <config-id>', 'Read the configuration of config-id')
  .command ('create', 'Create a content')
  .command ('eventlog', 'log ace events')
  .command ('generate <template> <n>', 'Generate n content from template')
  .command ('read <alias> [view]', 'Read content by alias [from view]')
  .command ('reindex', 'Issue a reindexing of content')
  .command ('taxonomy [id] [depth]', 'Read a taxonomy structure. No argument lists all available taxonomies.')
  .command ('token', 'Get auth token')
  .command ('type [type]', 'List or show information about types in the system')
  .command ('variants [variant]', 'Lists variants in the system or shows [variant] configuration.')
  .parse (process.argv);
