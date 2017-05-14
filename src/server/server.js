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

function getResultsForLanguage(language, input, limit, offset) {
  let query = `select * from translations where ${language} like '%${input}%'`;
  if (limit) {
    query += ` LIMIT ${limit}`;
  }
  if (offset) {
    query += ` OFFSET ${offset}`;
  }
  return execute(query).then(result => result.sort(chineseResultSortFunctionCreator(language, input)));
}

function getResultsForAnyLanguage(input, limit, offset) {
  const passLangs = _.without(languages, 'any');
  const promises = passLangs.map(language => getResultsForLanguage(language, input, limit, offset));
  return Promise.all(promises).then((result) => {
    return result.reduce((culm, result, dex) => Object.assign(culm, { [passLangs[dex]]: result }), {});
  });
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
        let prom;
        if (lang !== 'any') {
          prom = getResultsForLanguage(lang, input).then(result => {return { [lang]: result };});
        } else {
          prom = getResultsForAnyLanguage(input);
        }

        prom.then((results) => res.send(JSON.stringify({ results })))
            .catch((err) => res.status(500).send(JSON.stringify({ err })));
      }
    }
  });

  app.listen(port);
}

serve();
