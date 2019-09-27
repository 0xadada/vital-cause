const LOGLEVEL = process.env.LOGLEVEL || "info";
const PORT = process.env.PORT || 3000;
const AUTH_TOKEN = process.env.AUTH_TOKEN || null;
const VERSION = require("./package").version;

const Koa = require("koa");
const koaBody = require("koa-body");
const Logger = require("./logger");
const health = require("./health");

const app = new Koa();
const logger = Logger(LOGLEVEL);

// response time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  let log = ms > 1000 ? console.warn : console.debug;
  log(`  ${ms}ms`);
});

// log incoming request
app.use(logger);

// parse body
app.use(koaBody());

// log outgoing request status
app.use(async (ctx, next) => {
  await next();
  console.info(`  ${ctx.response.status} ${ctx.response.message}`);
});

// app version
app.use(async (ctx, next) => {
  ctx.set("X-Server-Version", VERSION);
  next();
});

// authentication
app.use(async (ctx, next) => {
  if (ctx.query.token && ctx.query.token === AUTH_TOKEN) {
    next();
  } else {
    ctx.response.status = 403;
    ctx.body = `${ctx.response.status} Forbidden`;
  }
});

// GET /health check
app.use(health());

// response body
app.use(async ctx => {
  let { body } = ctx.request;
  ctx.response.status = 200;
  ctx.body = `${ctx.response.status} OK
    POST data:
      ${JSON.stringify(body)}`;
});

// bail out if no auth token is provided on boot
if (AUTH_TOKEN === null) {
  console.log("error, AUTH_TOKEN environment variable must be set.");
  process.exit(1);
}

console.log(`listening on port ${PORT}`);
app.listen(PORT);
