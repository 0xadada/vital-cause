# vital-cause 
[![CircleCI](https://circleci.com/gh/0xadada/vital-cause/tree/master.svg?style=svg)](https://circleci.com/gh/0xadada/vital-cause/tree/master)


_Koa app to handle requests from IFTTT._


## Environment Variables

Use `.env.example` as a reference.

```bash
AUTH_TOKEN=changeme
LOGLEVEL=info
PORT=3000
```


## Running

```bash
export (cat .env | xargs) node index
```

