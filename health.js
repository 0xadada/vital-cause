const randomEmoji = require("./random-emoji");

module.exports = function health() {
  return async function health(ctx, next) {
    if (ctx.path !== `/health`) return next();

    if (ctx.request.method === "GET") {
      let emoji = randomEmoji();
      console.info(`  OK ${emoji}`);
      ctx.status = 200;
      ctx.body = `${ctx.status} OK`;
    } else {
      ctx.status = 400;
      ctx.body = `${ctx.status} Bad Request`;
    }
  };
};
