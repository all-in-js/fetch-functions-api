# fetch-functions-api

简化前端通过 fetch 请求 koa-functions-api

后端需要通过 [koa-functions-api](https://github.com/all-in-js/koa-functions-api) 实现 `/api/functions` 接口

```js
import Fetch from '@all-in-js/fetch-functions-api';

const $fetch = new Fetch('/api/functions');

// GET
$fetch('api/helloWorld', {});

// POST, 暂时只支持 json
$fetch.post('api/helloWorld', {});

// combine
$fetch.combine({
  'api/helloWorld': {},
  'api/whatelse': {}
});
```