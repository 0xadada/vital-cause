const Koa = require("koa");
const LOGLEVEL = process.env.LOGLEVEL || "info";
const PORT = process.env.PORT || 8080;
const VERSION = require("./package").version;
const Logger = require("./logger");

const app = new Koa();
const logger = Logger();

// response time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.debug(`  ${ms}ms`);
});

app.use(logger);

app.use(async (ctx, next) => {
  await next();
  console.info(`  ${ctx.response.status} OK`);
});

// version
app.use(async (ctx, next) => {
  ctx.set("X-Server-Version", VERSION);
  next();
});

// response body
app.use(async ctx => {
  ctx.body = `200 OK`;
  ctx.response.status = 200;
});

console.log("started");
app.listen(PORT);
