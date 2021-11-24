const hasOwnProperty = (object: unknown, key: string) => {
  return Object.prototype.hasOwnProperty.call(object, key);
};

export { hasOwnProperty };
