#!/usr/bin/env node
const cmd = require('commander'),
  pkg = require('./package.json'),
  version = pkg.version,
  name = pkg.name;

cmd
  .version (name + ' ' + version)
  .description ('Collection of useful scripts when working with an ace system.')
  .command ('create', 'Create a content')
  .command ('read <alias> [view]', 'Read content by alias [from view]')
  .command ('update <alias> <data> <matcher>', 'Update content by alias')
  .command ('version <versionId>', 'Read a specific version of a content')
  .command ('generate <template> <n>', 'Generate n content from template')
  .command ('reindex', 'Issue a reindexing of content')
  .command ('token', 'Get auth token')
  .command ('taxonomy [id] [depth]', 'Read a taxonomy structure. No argument lists all available taxonomies.')
  .command ('type [type]', 'List or show information about types in the system')
  .command ('variants [variant]', 'Lists variants in the system or shows [variant] configuration.')
  .command ('config <config-id>', 'Read the configuration of config-id')
  .parse (process.argv);
