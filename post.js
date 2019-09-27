const COMMIT_MSG = "new post";
const MANDATORY_FIELDS = ["date", "generator", "target", "title"];
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || null;
const APPNAME = require("./package").name;
const VERSION = require("./package").version;
const USER_AGENT = `${APPNAME} v${VERSION}`;

const Octokit = require("@octokit/rest"); // require("@octokit/rest");
const randomEmoji = require("./random-emoji");
const octokit = Octokit({
  auth: GITHUB_TOKEN,
  userAgent: USER_AGENT
});

module.exports = function post(githubUser, githubRepo) {
  return async function post(ctx, next) {
    if (ctx.path !== `/post`) return next();

    if (ctx.request.method === "POST" && ctx.is("application/json")) {
      let { body } = ctx.request;

      // check for mandatory fields
      for (let index in MANDATORY_FIELDS) {
        let field = MANDATORY_FIELDS[index];
        if (!Object.keys(body).includes(field)) {
          // data is missing field
          let msg = `POST body is missing field: '${field}'`;
          ctx.response.status = 400;
          ctx.response.body = msg;
          console.log(" ", msg);
          console.log(" ", "body", JSON.stringify(body));
          return next();
        }
      }

      let { date, generator, target, title, content } = body;

      // prep filename
      let now = new Date(); // UTC time
      now.setUTCHours(now.getUTCHours() - 4); // set time to America/New_York
      let yyyymmdd = formatDate(now);
      let hhmm = formatTime(now);
      let slug = slugify(title);
      let filename = `_posts/${yyyymmdd}-${slug}.md`;

      // prepare context
      let context = {
        layout: "webmention-like",
        title: title,
        target: target,
        date: `${yyyymmdd} ${hhmm}`,
        generator: generator,
        content: content || ""
      };
      let filecontents = markdown(context);

      try {
        octokit.repos.createOrUpdateFile({
          owner: githubUser,
          repo: githubRepo,
          path: filename,
          message: `${randomEmoji()} ${COMMIT_MSG} ${title}`,
          content: Buffer.from(filecontents).toString("base64")
        });
      } catch (error) {
        ctx.response.status = 500;
        let msg = `${ctx.response.status} GitHub commit failed: ${error.message}`;
        ctx.response.body = msg;
        console.error(" ", msg);
        return next();
      }
      ctx.response.status = 200;
      ctx.response.body = filecontents;
      console.info(" ", title);
      console.debug(" ", date);
      console.log(filecontents);
    } else {
      ctx.response.status = 400;
      ctx.response.body = `${ctx.response.status} Bad Request`;
    }
  };
};

function slugify(string) {
  return string
    .trim()
    .toLowerCase()
    .replace(/\ /g, "-")
    .replace(/[^A-z0-9\-]/g, "");
}

function formatDate(datetime) {
  return datetime.toISOString().split("T")[0];
}

function formatTime(datetime) {
  return datetime
    .toISOString()
    .split("T")[1]
    .split(".")[0];
}

function markdown(context) {
  return `---
layout: ${context.layout}
title: >
  ${context.title}
target: ${context.target}
date: ${context.date}
tags: [webmentions]
generator: ${context.generator}
hidden: true
---

${context.content}
`;
}
