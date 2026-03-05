export const join = (...args: string[]) => args.join('/');
export const dirname = (path: string) => {
  const parts = path.split('/');
  parts.pop();
  return parts.join('/');
};
export const resolve = (...args: string[]) => args.join('/');
export const basename = (path: string) => {
  const parts = path.split('/');
  return parts[parts.length - 1] || '';
};
export const extname = (path: string) => {
  const base = basename(path);
  const dotIndex = base.lastIndexOf('.');
  return dotIndex > 0 ? base.slice(dotIndex) : '';
};
export const sep = '/';
