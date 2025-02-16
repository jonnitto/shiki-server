# Shiki docker microservice / server

Standalone [shiki](https://shiki.style) server, listening on port 8090/tcp. Usefull if you want to use the awesome code
highlighting from [shiki](https://shiki.style), but without to include the javascript in the frontend. It adds also
support for the language [Neos Fusion](https://www.neos.io). (The key for this language is `neosfusion`)

## Overview

This image spools up a simple shiki server instance, listening to port 8090/tcp per default.

Starting the image is as easy as running a test instance through docker

```sh
docker run -it --rm jonnitto/shiki-server
```

or `docker-compose` with the following example:

```yml
services:
  shiki:
    image: jonnitto/shiki-server
    # environment:
    # to change the port:
    #   - PORT=8081
    # to change the default theme
    #   - DEFAULT_THEME=github-dark
    # to change the default language
    #   - DEFAULT_LANGUAGE=javascript
    # for development, uncomment the following lines:
    #   - CORS=*
```

## Defaults

The production defaults, without any override, default to:

```sh
CORS ""
PORT 8090
HEALTHCHECK "true"
CHARSET "utf8"
DEFAULT_RESPONSE_CONTENT_TYPE "text/html; charset=utf-8"
DEFAULT_THEME "vitesse-dark"
DEFAULT_LANGUAGE "javascript"
```

## Development

For development environments I would suggest to switch it to

```sh
CORS "*"
```

## API

An api call should look like this:

```js
const body = {
  code: '<button type="button">Hello World</button>',
  lang: 'html',
  theme: 'github-light',
  themeDark: 'github-dark',
};

fetch('http://YOUR_ENDPOINT:8090/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  body: JSON.stringify(body)
});
```

or with PHP and Guzzle

```php
use GuzzleHttp\Pool;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;

$client = new Client();

$request = new Request(
  "POST",
  "http://YOUR_ENDPOINT:8090/",
  [
      "Content-Type" => "application/json; charset=utf-8"
  ],
  "{\"code\":\"<button type=\\\"button\\\">Hello World</button>\",\"lang\":\"html\",\"theme\":\"github-light\",\"themeDark\":\"github-dark\"}");

$response = $client->send($request);
```

But you can use any language you want to create the request

## Returned object

The server response with an JSON object:

```json
{
  "html": "The Markup as html",
  "colors": {
    "default": {
      "fg": "foreground color of the theme",
      "bg": "background color of the theme"
    },
    "dark": {
      "fg": "foreground color of the dark theme (if set, otherwise dark will be null)",
      "bg": "background color of the dark theme (if set, otherwise dark will be null)"
    },
  },
  "markup": "The original markup passed"
}
```

## Useage togehter with ddev

I you use [ddev](https://ddev.com) for development like me, you can add this service like that:

Create a file called `docker-compose.shiki.yaml` in you `.ddev` folder:

```yaml
services:
  shiki:
    container_name: ddev-${DDEV_SITENAME}-shiki
    hostname: ${DDEV_SITENAME}-shiki
    image: jonnitto/shiki-server
    labels:
      com.ddev.site-name: ${DDEV_SITENAME}
      com.ddev.approot: $DDEV_APPROOT
    environment:
      - CORS=*
      - HEALTHCHECK=false
```

Add a enviroment variable in you `config.yaml`:

```yaml
web_environment:
  - SHIKI_API_ENDPOINT=ddev-${DDEV_SITENAME}-shiki:8090
```

Now you can use the enviroment variable `SHIKI_API_ENDPOINT` as your endpoint.
