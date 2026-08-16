// A tiny shared-ref registry. This site is a single, one-off mount, so a
// module-level bag of DOM nodes lets the scroll-driven scene engine (world
// background crossfade, hero parallax, ring carousel, preview manager) read
// and mutate style on the elements it cares about without prop-drilling refs
// through every section component.
const registry = {};

export function setEngineRef(name, el) {
  if (el) registry[name] = el;
  else delete registry[name];
}

export function getEngineRef(name) {
  return registry[name];
}

export function bindEngineRef(name) {
  return (el) => setEngineRef(name, el);
}

// Shared mutable state for the social-ads 3D ring (auto-rotation, drag
// inertia). Lives at module scope — SceneEngine mounts once for the app's
// lifetime — so VideoCard's click guard can read `dragMoved` without a
// context provider.
export const engineState = {
  ringRot: 0,
  ringHover: false,
  socialP: 0,
  ringDrift: 0.5,
  musP: 1,
  dragging: false,
  dragMoved: 0,
  dragX: 0,
  ringVel: 0,
  ringR: typeof window !== 'undefined' && window.innerWidth < 900 ? 280 : 520,
  ringCards: null
};
