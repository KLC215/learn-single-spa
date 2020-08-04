import { LOADING_SOURCE_CODE, NOT_BOOTSRAPPED } from "../applications/helpers";

function flattenFnArray(fns) {
  fns = Array.isArray(fns) ? fns : [fns];

  // Promise chain
  return function (props) {
    // Promise.resolve().then(() => fn1(props)).then(() => fn2(props))
    return fns.reduce((promise, fn) => promise.then(() => fn(props)), Promise.resolve());
  };
}

export async function toLoadPromise(app) {
  if (app.loadPromise) {
    return app.loadPromise; // cache
  }

  // TLDR: To solve application loaded twice, cache loadApp()
  // 1. In registerApplication(), it will load / pre-load all registered application and cache the function because it is async function
  // 2. In start(), check whether loadPromise is assigned and use cached function to continue to load application
  return (app.loadPromise = Promise.resolve().then(async () => {
    app.status = LOADING_SOURCE_CODE;

    let { bootstrap, mount, unmount } = await app.loadApp(app.customProps);

    app.status = NOT_BOOTSRAPPED;
    // bootstrap, mount and unmount can be array of promise
    app.bootstrap = flattenFnArray(bootstrap);
    app.mount = flattenFnArray(mount);
    app.unmount = flattenFnArray(unmount);

    // Remove loadPromise after application loaded
    delete app.loadPromise;

    return app;
  }));
}
