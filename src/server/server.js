import express from 'express';
import _ from 'underscore';
// import { getChineseMatches } from '../chinese/pinyin';
import { execute } from '../storage/sqlite';

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
      const input = req.query.input;
      if (_.isEmpty(input)) {
        res.status(400).send(JSON.stringify({ error: 'Must specify an input' }));
      } else {
        execute(`select * from translations where simplified like '%${input}%' LIMIT 200`).then((data) => {
          data.sort((a, b) => {
            if (a.simplified === input) {
              return -1;
            } else if (b.simplified === input) {
              return 1;
            } else if (a.simplified.indexOf(input) === 0) {
              return -1;
            } else if (b.simplified.indexOf(input) === 0) {
              return 1;
            } else {
              return a.simplified.indexOf(input) - b.simplified.indexOf(input);
            }
          });
          res.send(JSON.stringify({ results: data }));
        }).catch((err) => {
          res.status(500).send(JSON.stringify({ err }));
        });
      }

    }
  });

  app.listen(port);
}
