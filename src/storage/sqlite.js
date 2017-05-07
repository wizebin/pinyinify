import sqlite3 from 'sqlite3';

var db = new sqlite3.Database('./chinese.db');

export function execute(statement, values) {
  return new Promise((resolve) => {
    return db.all(statement, values, (err, results) => {
      resolve(results, err);
    });
  });
}
