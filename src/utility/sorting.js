export function chineseResultSortFunctionCreator(field, input) {
  return (a, b) => {
    if (a[field] === input) {
      return -1;
    } else if (b[field] === input) {
      return 1;
    } else {
      var diff = a[field].indexOf(input) - b[field].indexOf(input);
      if (diff === 0) {
        return a[field].length - b[field].length;
      } if (diff < 0) {
        return -1;
      }
      return 1;
    }
  };
}
