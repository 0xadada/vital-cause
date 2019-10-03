# vital-cause

[![CircleCI](https://img.shields.io/circleci/project/github/0xadada/vital-cause/master.svg?style=flat-square)](https://circleci.com/gh/0xadada/vital-cause/tree/master)

_Koa.js app to handle IFTTT webhooks and output markdown files to a GitHub repo._


## Get Started

You'll need these tools installed

* [Node.js LTS/10.x](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)

```bash
git clone <repository-url> && cd vital-cause
yarn
```

## Environment variables

Set your environment variables, copy them from the `.env.example` file and edit
as necessary:

```bash
cp .env.example .env
```

`AUTH_TOKEN` acts as an API token, all requests must send the `?token=` query
parameter that will be compared against the value set in this variable. It should
be set to a value with a high degree of entropy. I suggest a 32 character random
string:

```bash
base64 < /dev/urandom | tr -d 'O0Il1+\/' | head -c 32  # generate a 32-char string
```

You will need to create a [GitHub Personal Access
Token](https://github.com/settings/tokens) if you want to write files to your repo.

`GITHUB_TOKEN` is a personal access token that will grant access to this app
to create new files in your repo. It *only* needs to be granted the
`repo:public_repo` scope.


## Running

This will run the server on port `3000` with the `.env` file settings.

```bash
export (cat .env | xargs) && node index
```

There are 2 endpoints available to make requests. You must send send the `token`
query parameter equal to the value set in the `AUTH_TOKEN` environment variable.

* health check: `curl -i http://localhost:3000/health?token=changeme`
* post new file: `curl -i -H 'Content-Type: application/json' http://localhost:3000/post?token=changeme`


## Example posts

Create a Youtube post:

For this JSON data:
```JSON
{
  "layout": "webmention-like",
  "date": "2021-09-22 17:55:32",
  "generator": "youtube.com",
  "target": "https://www.youtube.com/watch?v=9bZkp7q19f0",
  "title": "PSY - GANGNAM STYLE(강남스타일) M/V",
  "content": "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/9bZkp7q19f0\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>"
}
```

Use curl to make a POST request:

```bash
curl \
  -H 'Content-Type: application/json' \
  --data '{"layout": "webmention-like", "date": "2021-09-22 17:55:32", "generator": "youtube.com", "target": "https://www.youtube.com/watch?v=9bZkp7q19f0", "title": "PSY - GANGNAM STYLE(강남스타일) M/V", "content": "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/9bZkp7q19f0\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>"}' \
  http://localhost:3000/post?token=changeme
```

## IFTTT Recipes

On IFTTT, the recipe would look like this:

Make a web hook request:

* URL: `https://<project-name>.glitch.me/post?token=changeme`
* Method: `POST`
* Content-type: `application/json`
* Body:
```JSON
{
  "layout": "webmention-like",
  "date": "{{LikedAt}}",
  "generator": "youtube.com",
  "target": "{{Url}}",
  "title": "{{Title}}",
  "content": "<<<{{EmbedCode}}>>>"
}
```
