import execute from '../storage/sqlite';

export function chineseToPinyin(chinese) {
  return execute(`SELECT * FROM chinese WHERE chinese like '${chinese}'`);
}

export function fixPinyin(pinyin) {
  return pinyin;
}
