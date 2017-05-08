import express from 'express';
import _ from 'underscore';
import { execute } from '../storage/sqlite';
import { chineseResultSortFunctionCreator } from '../utility/sorting';
import { languages } from '../utility/constants';

// XXX: Upgrade this to actually clean sql
function cleanSql(input) {
  return input.replace("'", "''");
}

function getLanguage(requested) {
  if (languages.indexOf(requested) !== -1) {
    return requested;
  }
  return 'simplified';
}

export function serve() {
  const app = express();
  const port = process.env.SERVER_PORT || '3000';

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.get('/', function (req, res) {
    if (req.method === 'GET') {
      const input = cleanSql(req.query.input);
      const lang = getLanguage(req.query.language);
      if (_.isEmpty(input)) {
        res.status(400).send(JSON.stringify({ error: 'Must specify an input' }));
      } else {
        const query = `select * from translations where ${lang} like '%${input}%' LIMIT 300`;
        execute(query).then((data) => {
          res.send(JSON.stringify({ results: data.sort(chineseResultSortFunctionCreator(lang, input)) }));
        }).catch((err) => {
          res.status(500).send(JSON.stringify({ err }));
        });
      }
    }
  });

  app.listen(port);
}
