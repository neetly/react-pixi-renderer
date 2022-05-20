const onRecoverableError =
  typeof reportError === "function"
    ? (error: unknown) => reportError(error)
    : (error: unknown) => console.error(error);

export { onRecoverableError };
