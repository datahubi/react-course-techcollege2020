import { length, routes } from './routes';

export const getParamObj = query => {
  if (!query) return "";
  const actualQueryString = query.slice(
    query.indexOf("?") + 1,
    query.length
  );
  if (actualQueryString.length === query.length) return "";
  const queryArray = actualQueryString.split("&");
  if (queryArray.length < 1) return "";
  return queryArray.reduce((queryObj, queryString) => {
    const [key, val] = queryString.split("=");
    if (key && val) {
      queryObj[key] = val;
    }
    return queryObj;
  }, {});
};

export const getNextPath = (pathname, next = true) => {
  const index = routes.findIndex(({ path }) => path === pathname);
  const nextIndex = index + 1;
  if (next) {
    return routes[nextIndex > length ? 0 : nextIndex].path;
  }
  const prevIndex = index - 1;
  return routes[prevIndex < 0 ? length : prevIndex].path;
};

export const getPrevPath = (pathname, next = false) =>
  getNextPath(pathname, next);

export const getNextPathIdx = (pathname, next = true) =>
  routes.findIndex(({ path }) => path === getNextPath(pathname, next));

export const getPrevPathIdx = (pathname, next = false) =>
  routes.findIndex(({ path }) => path === getNextPath(pathname, next));

export const getNextIdx = idx => {
  const next = idx + 1;
  if (next > length) {
    return 0;
  }
  return next;
};

export const getPrevIdx = idx => {
  const prev = idx - 1;
  if (prev < 0) {
    return length;
  }
  return prev;
};