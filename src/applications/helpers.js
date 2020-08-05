// Application is registered
export const NOT_LOADED = "NOT_LOADED";
// Application is loading resources
export const LOADING_SOURCE_CODE = "LOADING_SOURCE_CODE";
// Application is not start yet
export const NOT_BOOTSRAPPED = "NOT_BOOSTRAPPED";
// Application is starting
export const BOOTSTRAPPING = "BOOTSTRAPPING";
// Application is not mounted
export const NOT_MOUNTED = "NOT_MOUNTED";
// Application is mounting
export const MOUNTING = "MOUNTING";
// Application is mounted
export const MOUNTED = "MOUNTED";
// Application is updating
export const UPDATING = "UPDATING";
// Application is unmounting
export const UNMOUNTING = "UNMOUNTING";
// Application is destroying
export const UNLOADING = "UNLOADING";
// Errors occurred when loading application
export const LOAD_ERROR = "LOAD_ERROR";
// Skip application
export const SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN";

// Check whether the application is active
export function isActive(app) {
  return app.status === MOUNTED;
}
// Check whether the application should be active
export function shouldBeActive(app) {
  return app.activeWhen(window.location);
}
