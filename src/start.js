import { reroute } from "./navigations/reroute";

export let started = false;

export function start() {
  started = true;
  // Load and mount application
  reroute();
}
