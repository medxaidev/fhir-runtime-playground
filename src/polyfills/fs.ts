export const readFileSync = () => {
  throw new Error('fs.readFileSync is not available in browser environment');
};

export const existsSync = () => false;
export const mkdirSync = () => {};
export const writeFileSync = () => {};
