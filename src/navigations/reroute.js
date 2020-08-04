import { getAppChanges } from "../applications/app";
import { toBootstrapPromise } from "../lifecycles/bootstrap";
import { toLoadPromise } from "../lifecycles/load";
import { toMountPromise } from "../lifecycles/mount";
import { toUnmountPromise } from "../lifecycles/unmount";
import { started } from "../start";

// !!! CORE
export function reroute() {
  // Get applications to load
  // Get applications to mount
  // Get applications to unmount
  const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();

  // start() is sync but loadApps() is async,
  // so application will be loaded twice. ( registerApplication and start will call reroute() )
  if (started) {
    // Mount app
    return performAppChanges();
  }

  // Pre-load application when register
  return loadApps();

  // Pre-load application
  async function loadApps() {
    // Get bootstrap, mount and unmount and put it into application
    let apps = await Promise.all(appsToLoad.map(toLoadPromise));
  }
  // Load application based on URL path
  async function performAppChanges() {
    // Unmount unnecessary applications
    let umountPromises = appsToUnmount.map(toUnmountPromise);
    // Load required applications
    appsToLoad.map(async (app) => {
      // 1. Load
      app = await toLoadPromise(app);
      // 2. Bootstrap
      app = await toBootstrapPromise(app);
      // 3. Mount
      return await toMountPromise(app);
    });

    appsToMount.map(async (app) => {
      app = await toBootstrapPromise(app);

      return toMountPromise(app);
    });
  }
}

// TODO: Intercept browser router to load application when hash is changed
