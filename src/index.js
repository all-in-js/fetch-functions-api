import deepmerge from 'deepmerge';

const INNER_FETCH_TYPE = 'fetchFnApi';

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
    
    /**
     * POST 请求，默认请求json格式数据
     * @param {strign} fnApi 
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
     * @param f1,f2,...
     */
    $fetch.combine = function(...fetchs) {
      if (!fetchs.length) {
        return [];
      }
      const fns = [];
      const vars = [];
      fetchs.forEach((fetchFnApi) => {
        const {
          fnApi,
          vars: fnVars
        } = fetchFnApi.type !== INNER_FETCH_TYPE ? {} : fetchFnApi;
        fns.push(fnApi);
        vars.push(fnVars);
      });

      return $fetch.post(fns, vars);
    }
    return $fetch;
  }
}

function fnApifetchWrapper(url, fnApi, vars, option) {
  const f = fetch(url, {
    ...option,
    body: JSON.stringify({
      $fns: fnApi,
      $vars: vars
    })
  });
  f.fnApi = fnApi;
  f.vars = vars;
  f.type = INNER_FETCH_TYPE;
  return f;
}

// const fetch = new Fetch('url');
// const f1 = fetch('api/users', {id: 1});
// const f2 = fetch('api/user', {id: 2});

// f1.then();
// f2.then();

// const [
//   res1,
//   res2
// ] = fetch.combine(f1, f2);