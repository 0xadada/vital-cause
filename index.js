const LOGLEVEL = process.env.LOGLEVEL || "info";
const PORT = process.env.PORT || 3000;
const AUTH_TOKEN = process.env.AUTH_TOKEN || null;
const GITHUB_USER = process.env.GITHUB_USER || null;
const GITHUB_REPO = process.env.GITHUB_REPO || null;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || null;
const VERSION = require("./package").version;

const Koa = require("koa");
const koaBody = require("koa-body");
const Logger = require("./logger");
const health = require("./health");
const post = require("./post");

const app = new Koa();
const logger = Logger(LOGLEVEL);

// response time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  let log = ms > 1000 ? console.warn : console.debug;
  log(" ", `${ms}ms`);
});

// log request
app.use(logger);

// parse body
app.use(koaBody());

// log response
app.use(async (ctx, next) => {
  await next();
  console.info(" ", ctx.response.status, ctx.response.message);
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
    ctx.response.body = `${ctx.response.status} Forbidden`;
  }
});

// GET /health
app.use(health());

// POST /post
app.use(post(GITHUB_USER, GITHUB_REPO, GITHUB_TOKEN));

// bail out if any require env vars are missing
if ([AUTH_TOKEN, GITHUB_USER, GITHUB_REPO, GITHUB_TOKEN].includes(null)) {
  console.log("error, required environment variable is not set.");
  process.exit(1);
}

console.log(`listening on port ${PORT}`);
app.listen(PORT);
