// import _ from 'underscore';
import { execute } from './sqlite';
import lineReader from 'line-by-line';

export function setupDatabase() {
  const statement = `
  CREATE TABLE IF NOT EXISTS translations(
    id INTEGER NOT NULL PRIMARY KEY,
    simplified VARCHAR(128),
    traditional VARCHAR(128),
    pinyin VARCHAR(128),
    english TEXT
  );`;

  const indexes = `
    CREATE INDEX index_simplified ON translations USING btree (simplified);
    CREATE INDEX index_traditional ON translations USING btree (traditional);
    CREATE INDEX index_pinyin ON translations USING btree (pinyin);
  `;

  var ret = [];

  ret.push(execute(statement));
  ret.push(execute(indexes));

  return ret;
}

function transformDictionaryRow(line) {
  var result = line.match('^(.*?) (.*?) (.*?)] (.*)$');
  if (result === null) return null;
  result = result.slice(1);
  result[2] = result[2].slice(1);
  return result;
}

export function importDictionary(filename) {
  return new Promise((resolve) => {
    const reader = new lineReader(filename);
    let count = 0;
    reader.on('line', function (line) {
      const cols = transformDictionaryRow(line);
      if (cols !== null) {
        const row = cols.map(val => "'" + val.replace("'", "''") + "'");
        const values = row.join(',');
        const statement = `INSERT INTO translations (traditional, simplified, pinyin, english) VALUES(${values})`;
        execute(statement);
        count++;
      }
    });

    reader.on('end', function () {
      resolve(count);
    });
  });
}

export function fillDatabaseFromConfig() {
  setupDatabase();
  execute('DELETE FROM translations');
  execute('BEGIN TRANSACTION;');
  importDictionary(process.env.DICTIONARY_FILENAME).then(() => {
    execute('END TRANSACTION;');
  });
}
