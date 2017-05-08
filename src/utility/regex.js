import _ from 'underscore';

export function replacex(source, find, replace, flags = 'ig', originalSource = undefined, level = 0) {
  if (source === originalSource) return source;
  if (originalSource === undefined) originalSource = source;

  if (_.isString(source)) {
    const exp = new RegExp(find, flags);
    return source.replace(exp, replace);
  } else if (_.isArray(source)) {
    return source.map(function(cur) {return replacex(cur, find, replace, flags, originalSource, level + 1);});
  } else if (_.isObject(source)) {
    const keys = _.keys(source);
    return keys.reduce(function(results, cur){
      results[cur] = replacex(source[cur], find, replace, flags, originalSource, level + 1);
      return results;
    }, {});
  }

  return source;
}
