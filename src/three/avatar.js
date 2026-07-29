import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { avatarLights } from './common';

// Loads the sculpted GLB avatar, frames it to fill the visible hero stage
// (accounting for its depth when rotated), and exposes a mutable `state`
// object the caller's render loop reads each frame (model, size, mixer).
export function createAvatarScene(accentColor) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  camera.position.set(0, 0.15, 6);
  camera.lookAt(0, 0, 0);
  avatarLights(scene, accentColor);

  const group = new THREE.Group();
  scene.add(group);

  const state = { model: null, size: null, mixer: null };

  function frame() {
    if (!state.model || !state.size) return;
    const d = camera.position.z;
    const visH = 2 * d * Math.tan((camera.fov * Math.PI) / 180 / 2);
    const visW = visH * camera.aspect;
    const reach = Math.max(state.size.x, state.size.z * 0.7);
    const k = Math.min((visH * 0.99) / Math.max(state.size.y, 0.001), (visW * 0.96) / Math.max(reach, 0.001));
    state.model.scale.setScalar(k);
    state.model.position.set(0, 0, 0);
    const c = new THREE.Box3().setFromObject(state.model).getCenter(new THREE.Vector3());
    state.model.position.sub(c);
  }

  const conn = navigator.connection || {};
  if (!(conn.saveData || /2g/.test(conn.effectiveType || ''))) {
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath('/draco/gltf/');
    loader.setDRACOLoader(draco);
    loader.load(
      '/models/yeraldo-lite.glb',
      (gltf) => {
        const model = gltf.scene;
        model.traverse((o) => {
          if (!o.isMesh) return;
          o.frustumCulled = false;
          const m = o.material;
          if (m) {
            m.side = THREE.FrontSide;
            if (m.map) m.map.colorSpace = THREE.SRGBColorSpace;
            if ('roughness' in m) m.roughness = Math.min(0.85, (m.roughness == null ? 0.7 : m.roughness) + 0.1);
            if ('metalness' in m) m.metalness = Math.min(0.2, m.metalness || 0);
            m.needsUpdate = true;
          }
        });
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const ctr = box.getCenter(new THREE.Vector3());
        model.position.set(-ctr.x, -ctr.y, -ctr.z);
        group.add(model);
        state.model = model;
        state.size = size;
        if (gltf.animations && gltf.animations.length) {
          state.mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => state.mixer.clipAction(clip).play());
        }
        try {
          draco.dispose();
        } catch (e) {
          /* noop */
        }
        frame();
      },
      undefined,
      () => {}
    );
  }

  return { scene, camera, group, state, frame };
}
