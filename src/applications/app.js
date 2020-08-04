import { reroute } from "../navigations/reroute";
import {
  BOOTSTRAPPING,
  LOADING_SOURCE_CODE,
  MOUNTED,
  NOT_BOOTSRAPPED,
  NOT_LOADED,
  NOT_MOUNTED,
  shouldBeActive,
  SKIP_BECAUSE_BROKEN,
} from "./helpers";

// Store all registered applications
const apps = [];

/**
 * Manage application statuses
 * @param {String} appName Application name
 * @param {Promise} loadApp Promise function to load application
 * @param {Function} activeWhen When active, execute loadApp
 * @param {Object} customProps Custom properties for application
 */
export function registerApplication(appName, loadApp, activeWhen, customProps) {
  // Register app
  apps.push({
    name: appName,
    loadApp,
    activeWhen,
    customProps,
    status: NOT_LOADED,
  });

  console.log("registerApplication -> apps", apps);
  // Load application
  reroute();
}

export function getAppChanges() {
  // Get applications to load
  const appsToLoad = [];
  // Get applications to mount 
  const appsToMount = [];
  // Get applications to unmount
  const appsToUnmount = [];

  apps.forEach((app) => {
    const appShouldBeActive = app.status !== SKIP_BECAUSE_BROKEN && shouldBeActive(app);

    switch (app.status) {
      case NOT_LOADED:
      case LOADING_SOURCE_CODE:
        if (appShouldBeActive) {
          appsToLoad.push(app);
        }
        break;

      case NOT_BOOTSRAPPED:
      case BOOTSTRAPPING:
      case NOT_MOUNTED:
        if (appShouldBeActive) {
          appsToMount.push(app);
        }
        break;

      case MOUNTED:
        if (!appShouldBeActive) {
          appsToUnmount.push(app);
        }
        break;
      default:
        break;
    }
  });

  return {
    appsToLoad,
    appsToMount,
    appsToUnmount,
  };
}
