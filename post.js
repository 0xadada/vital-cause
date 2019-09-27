module.exports = function post() {
  return async function post(ctx, next) {
    if (ctx.path !== `/post`) return next();

    if (ctx.request.method === "POST" && ctx.is("application/json")) {
      let { body } = ctx.request;
      let output = `${JSON.stringify(body)}`;
      ctx.body = output;
      console.info(`  ${output}`);
      ctx.response.status = 200;
    } else {
      ctx.status = 400;
      ctx.body = `${ctx.status} Bad Request`;
    }
  };
};
