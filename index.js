const LOGLEVEL = process.env.LOGLEVEL || "info";
const PORT = process.env.PORT || 3000;
const AUTH_TOKEN = process.env.AUTH_TOKEN || null;
const VERSION = require("./package").version;

const Koa = require("koa");
const koaBody = require("koa-body");
const Logger = require("./logger");

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

app.use(logger);

// parse body
app.use(koaBody());

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

// Healthcheck
app.use(async (ctx, next) => {
  if (ctx.path !== `/health`) return next();

  let valid = false;

  if (ctx.headers["content-type"] === "text/plain" &&
      ctx.request.method === "GET") {
    valid = true;
  }

  if (valid) {
    ctx.status = 200;
    ctx.body = "OK";
  } else {
    ctx.status = 403;
    ctx.body = "Forbidden";
  }
});

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
