const kafka = require ('kafka-node');
const cmd = require ('commander');

cmd
  .usage ('[options]')
  .option ('--verbose', 'Extend output with metadata')
  .option ('--from-beginning', 'Play events from beginning of time', false)
  .option ('--logger-id <name>', 'Use a consumer with <name> to be able to have independent loggers', 'ace-cli-event-logger')
  .option ('--from-offset <offset>', 'Play events from <offset>')
  .option ('-P --port <port>', 'host port', '9092')
  .option ('-H --host <host>', 'host', 'localhost')
  .parse (process.argv);

let offset = 0;

if (cmd.fromOffset || parseInt (cmd.fromOffset) === 0) {
  cmd.fromBeginning = true;
  offset = parseInt (cmd.fromOffset);
}

const connectionString = cmd.host + ':' + cmd.port;  
const client = new kafka.KafkaClient(connectionString);
const consumer = new kafka.Consumer (client, [{ topic: 'aceEvents', offset }], { groupId: cmd.loggerId, fromOffset: cmd.fromBeginning });

consumer.on ('message', (message) => {
  if (cmd.verbose) {
    console.log ();
    console.log (message);
  } else {
    console.log (message.offset + ': ' + JSON.parse(message.value).payload);
  }
});

consumer.on ('error', (error) => {
  console.error ('ERROR: ', error);
});