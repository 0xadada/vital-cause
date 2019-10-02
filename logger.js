/*global process*/
const LOGLEVEL = process.env.LOGLEVEL || "info";

module.exports = function Logger(
  logLevel = LOGLEVEL,
  format = ':loglevel :datetime :method ":url"'
) {
  return async function(ctx, next) {
    const dt = new Date();
    const str = format
      .replace(":loglevel", logLevel.toUpperCase())
      .replace(":datetime", dt.toISOString())
      .replace(":method", ctx.method)
      .replace(":url", ctx.url);
    console[logLevel](`${str}`);
    await next();
  };
};
