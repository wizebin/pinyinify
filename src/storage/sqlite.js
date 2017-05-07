import sqlite3 from 'sqlite3';

var db = new sqlite3.Database('chinese.db');

export function execute(statement) {
  return new Promise((resolve) => {
    return db.all(statement, (err, results) => {
      resolve(results);
    });
  });
}
