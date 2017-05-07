import { jsonVERB, encodeURIObject } from '../http/http';

const SERVER = process.env.SERVER || 'http://localhost:3000';

export function requestData(input) {
  return jsonVERB(SERVER + '?' + encodeURIObject({ input }), 'GET');
}
