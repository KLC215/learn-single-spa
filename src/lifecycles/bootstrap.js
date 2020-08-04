import { BOOTSTRAPPING, NOT_BOOTSRAPPED, NOT_MOUNTED } from "../applications/helpers";

export async function toBootstrapPromise(app) {
  if (app.status !== NOT_BOOTSRAPPED) {
    return app;
  }

  app.status = BOOTSTRAPPING;

  await app.bootstrap(app.customProps);

  app.status = NOT_MOUNTED;

  return app;
}
