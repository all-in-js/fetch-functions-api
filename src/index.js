import deepmerge from 'deepmerge';

export default class Fetch {
  constructor(url, commonOption) {
    /**
     * GET 请求
     * @param {string} fnApi 
     * @param {object} vars 
     */
    const $fetch = function(fnApi, vars) {
      const option = deepmerge(commonOption, {
        method: 'GET'
      });
      return fnApifetchWrapper(url, fnApi, vars, option);
    }

    $fetch.get = $fetch;
    
    /**
     * POST 请求，默认请求json格式数据
     * @param {strign} fnApi z
     * @param {object} vars 
     */
    $fetch.post = function(fnApi, vars) {
      const option = deepmerge(commonOption, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return fnApifetchWrapper(url, fnApi, vars, option);
    }

    /**
     * 合并请求
     * {
     *  'api/user': {
     *     id: 'a'
     *   },
     * }
     */
    $fetch.combine = function(fnApiMap) {
      if (typeof fnApiMap !== 'object') {
        return [];
      }
      const fns = [];
      const vars = [];
      Object.keys(fnApiMap).forEach((fnApi) => {
        const params = typeof fnApiMap[fnApi] === 'object' ? fnApiMap[fnApi] : {};
        fns.push(fnApi);
        vars.push(params);
      });

      return $fetch.post(fns, vars);
    }
    return $fetch;
  }
}

function fnApifetchWrapper(url = '/api/functions', fnApi, vars, option) {
  // 调试请求的 api
  const debugApi = option.debugApi ? `debuging-api=${fnApi.toString()}` : '';
  if (option.debugApi) {
    url += (url.indexOf('?') !== -1 ? '&' : '?') + debugApi;
  }
  const f = fetch(url, {
    ...option,
    body: JSON.stringify({
      $fns: fnApi,
      $vars: vars
    })
  }).then((res) => {
    const resContentType = res.headers.get('Content-Type');
    const contType = resContentType.split(/;\s+/)[0].split(/\//)[1];

    if (contType === 'json') {
      return res.json();
    }
    if (contType === 'plain') {
      return res.text();
    }
    return res;
  });
  return f;
}
