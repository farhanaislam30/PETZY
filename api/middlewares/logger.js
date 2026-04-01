export const log = (req, res, next) => {
  console.log(
    `Current URL: ${req.url}; Method: ${req.method}; Timestamp: ${new Date()}`
  );
  next();
};
