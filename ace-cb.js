const couchbase = require ('couchbase');

const cluster = new couchbase.Cluster('couchbase://localhost');
cluster.authenticate ('admin', 'admin123');

const cmbucket = cluster.openBucket ('cmbucket');
const n1ql = couchbase.N1qlQuery;

let query = n1ql.fromString('SELECT mainAlias FROM cmbucket WHERE meta().id LIKE "c:%"');

cmbucket.query (query, function (err, rows, meta) {
  if (!err) {
      let result = [], consumed = [];
      console.error (meta);
      rows.map(function (arr) {
        return arr.mainAlias;
      }).forEach(function (alias) {
        if (consumed.indexOf (alias) === -1) {
          consumed.push (alias);
          return;
        } else {
          console.error('Found a duplicate');
          result.push(alias);
        }
      });
      result.forEach(function (moreThanOne) {
          console.log(moreThanOne);
      });
      process.exit(0);
  } else {
      console.error(err);
      process.exit(1);
  }
});