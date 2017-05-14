// Find any path that begins with a forward slash, and replace the slash with the path to the
// root of the project. Any path that begins with a back slash will be replaced with a forward
// slash, indicating the root of the file system (which nobody wants)
function getReplacePath(path, cwd) {
  if (path.length > 0) {
    if (path[0] === '/') {
      return cwd + path;
    } else if (path[0] === '\\') {
      return '/' + path.slice(1);
    }
  }
  return undefined;
}

export default function(babel) {
  const cwd = process.cwd();
  return {
    visitor: {
      ImportDeclaration(visitor) {
        const replacePath = getReplacePath(visitor.node.source.value, cwd);
        if (replacePath) {
          visitor.node.source.value = replacePath;
        }
      },
      CallExpression(visitor) {
        if (visitor.node.callee.name === 'require') {
          const args = visitor.node.arguments;

          if (args.length > 0 && babel.types.isStringLiteral(args[0])) {
            const replacePath = getReplacePath(args[0], cwd);
            if (replacePath) {
              args[0] = replacePath;
            }
          }
        }
      },
    }
  };
}
