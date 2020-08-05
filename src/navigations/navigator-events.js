import { reroute } from "./reroute";

export const routingEventsListeningTo = ["hashchange", "popstate"];

// Intercept another hashchange events and popstate events in vue-router or react-router etc.
// It will trigger all the events after application mounted
const capturedEventListener = {
  hashchange: [],
  popstate: [],
};

// When we use hash router, change application when hash changed
function urlReroute() {
  // Reload application based on url
  reroute([], arguments);
}
window.addEventListener("hashchange", urlReroute);
window.addEventListener("popstate", urlReroute);

const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

window.addEventListener = function (eventName, fn) {
  const matchEventName = routingEventsListeningTo.indexOf(eventName) >= 0;
  const noListenerStored = !capturedEventListener[eventName].some((listener) => listener == fn);

  if (matchEventName && noListenerStored) {
    capturedEventListener[eventName].push(fn);
    return;
  }
  return originalAddEventListener.apply(this, arguments);
};

window.removeEventListener = function (eventName, fn) {
  const matchEventName = routingEventsListeningTo.indexOf(eventName) >= 0;

  if (matchEventName) {
    capturedEventListener[eventName] = capturedEventListener[eventName].filter((listener) => listener !== fn);
    return;
  }
  return originalRemoveEventListener.apply(this, arguments);
};

// When we use browser router, use HTML5 api, but it will not trigger popstate event when changed application
function patchedUpdateState(updateState, methodName) {
  return function () {
    const urlBefore = window.location.href;
    // Call original pushState
    updateState.apply(this, arguments);

    const urlAfter = window.location.href;

    if (urlBefore !== urlAfter) {
      // Reload application and pass event source
      urlReroute(new PopStateEvent("popstate"));
    }
  };
}
window.history.pushState = patchedUpdateState(window.history.pushState, "pushState");
window.history.replaceState = patchedUpdateState(window.history.replaceState, "replaceState");
