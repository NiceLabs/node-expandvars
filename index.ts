export type Environ = Record<string, string | undefined>;

export function expandUser(input: string, environ: Environ = process.env) {
  if (typeof input !== 'string') {
    throw new Error('The input type not is string');
  }
  const home = environ.HOME ?? environ.USERPROFILE;
  return home ? input.replace(/^~/g, home) : input;
}

expandUser.bind = (environ: Environ) => (input: string) => expandUser(input, environ);

export function expandVars(input: string, environ: Environ = process.env) {
  if (typeof input !== 'string') {
    throw new Error('The input type not is string');
  }
  if (input.indexOf('$') === -1) {
    return input;
  }
  return input.replace(/\$(\w+|\{[^}]*\})/g, (match, p1: string) => {
    if (p1[0] === '{' && p1[p1.length - 1] === '}') {
      p1 = p1.slice(1, -1);
    }
    return environ[p1] ?? match;
  });
}

expandVars.bind = (environ: Environ) => (input: string) => expandVars(input, environ);
