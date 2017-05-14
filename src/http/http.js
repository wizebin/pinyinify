export function httpVERB(url, verb, params, headers) {
  return new Promise((resolve, reject) => {
    try {
      const xhr = typeof XMLHttpRequest !== 'undefined'
      ? new XMLHttpRequest()
      : new window.ActiveXObject('Microsoft.XMLHTTP');
      xhr.onerror = (err) => {reject(err);};
      xhr.open(verb, url, true);

      headers && Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]));

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const status = xhr.status;
          if (status >= 200 && status <= 300) {
            try {
              resolve(xhr.responseText);
            } catch (err) {
              reject(err.message + xhr.responseText);
            }
          } else {
            if (xhr.status === 0) {
              reject(new Error('Request error, check your console, possibly a url misconfiguration (did you forget http?)- you tried to access ' + url + ' ' + verb));
            } else {
              const status = xhr.status;
              const responseText = xhr.responseText;
              reject(new Error(`Http Error ${status}: ${responseText}`));
            }
          }
        }
      };
      xhr.send(params);
    } catch (err) {
      reject(err);
    }
  });
}

export function jsonVERB(url, verb, params, headers) {
  return httpVERB(url, verb, params, headers).then(result => JSON.parse(result));
}

export function encodeURIObject(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
}
