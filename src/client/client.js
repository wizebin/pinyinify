import { jsonVERB, encodeURIObject } from '../http/http';

function pathToPort(port) {
  return window.location.protocol + '//' + window.location.hostname + ':' + port;
}

const SERVER = process.env.SERVER || 'http://localhost:3000';

export function requestData(input, language) {
  let passServer = SERVER;
  if (window && window.location) {
    passServer = pathToPort('3000');
  }
  return jsonVERB(passServer + '?' + encodeURIObject({ input, language }), 'GET');
}
