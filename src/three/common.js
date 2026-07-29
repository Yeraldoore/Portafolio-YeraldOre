import * as THREE from 'three';

export function createRenderer(wrap, exposure = 1.05) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.innerWidth < 900 ? 1.6 : 2, window.devicePixelRatio || 1));
  renderer.setSize(wrap.clientWidth || 400, wrap.clientHeight || 400, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  wrap.appendChild(renderer.domElement);
  return renderer;
}

export function disposeRenderer(renderer) {
  if (!renderer) return;
  try {
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  } catch (e) {
    /* noop */
  }
}

export function cineCameraLights(scene, accent) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  const key = new THREE.DirectionalLight(0xfff4e6, 1.9);
  key.position.set(3.4, 4.2, 5);
  scene.add(key);
  const rim = new THREE.PointLight(new THREE.Color(accent), 16, 20, 2);
  rim.position.set(-3.6, 2.2, -2.6);
  scene.add(rim);
  const fill = new THREE.PointLight(0x88a8ff, 7.5, 18, 2);
  fill.position.set(3.6, -1.4, 2.4);
  scene.add(fill);
  const top = new THREE.SpotLight(0xffffff, 8, 24, 0.7, 0.6, 2);
  top.position.set(0, 6, 2.5);
  scene.add(top);
}

export function avatarLights(scene, accent) {
  scene.add(new THREE.HemisphereLight(0xcfd8e8, 0x0e0a08, 0.5));
  const key = new THREE.DirectionalLight(0xffeedd, 0.95);
  key.position.set(2.4, 2.6, 4.6);
  scene.add(key);
  const side = new THREE.DirectionalLight(0xffffff, 0.3);
  side.position.set(-3.2, 1.2, 2.2);
  scene.add(side);
  const rim = new THREE.PointLight(new THREE.Color(accent), 5.5, 15, 2);
  rim.position.set(-2.6, 1.9, -2.2);
  scene.add(rim);
  const rim2 = new THREE.PointLight(0x6f8cff, 2.6, 14, 2);
  rim2.position.set(2.9, 0.6, -2);
  scene.add(rim2);
}

export function fitRenderer(renderer, camera, wrap) {
  if (!renderer || !camera || !wrap) return;
  const w = wrap.clientWidth || 400;
  const h = wrap.clientHeight || 400;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
