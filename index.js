const LOGLEVEL = process.env.LOGLEVEL || "info";
const PORT = process.env.PORT || 3000;
const AUTH_TOKEN = process.env.AUTH_TOKEN || null;

const VERSION = require("./package").version;
const Koa = require("koa");
const Logger = require("./logger");

const app = new Koa();
const logger = Logger(LOGLEVEL);

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

// authentication
app.use(async (ctx, next) => {
  if (ctx.query.token && ctx.query.token === AUTH_TOKEN) {
    next();
  } else {
    ctx.response.status = 403;
    ctx.body = `${ctx.response.status} Forbidden`;
  }
});

// response body
app.use(async ctx => {
  ctx.body = `200 OK`;
  ctx.response.status = 200;
});

if (AUTH_TOKEN === null) {
  console.log("error, AUTH_TOKEN environment variable must be set.");
  process.exit(1);
}

console.log(`listening on port ${PORT}`);
app.listen(PORT);
