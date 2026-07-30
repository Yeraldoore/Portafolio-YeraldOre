import * as THREE from 'three';
import { cineCameraLights } from './common';

// Builds the rotating low-poly cine camera shown on the loading screen:
// body, lens barrel + ring + glass, viewfinder, two spinning film reels,
// and a crank handle. Returns the group plus per-frame spin data for the
// caller's render loop.
export function buildIntroCamera(scene, accentColor) {
  cineCameraLights(scene, accentColor);
  const acc = new THREE.Color(accentColor);
  const metal = new THREE.MeshStandardMaterial({ color: 0x45454c, metalness: 0.4, roughness: 0.42 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2a2a2e, metalness: 0.28, roughness: 0.55 });
  const gold = new THREE.MeshStandardMaterial({ color: acc, metalness: 0.8, roughness: 0.28 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x0a1216, metalness: 1, roughness: 0.06, emissive: acc, emissiveIntensity: 0.22 });

  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.85, 1.12, 1.05), metal);
  g.add(body);
  const plate = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.07, 1.1), gold);
  plate.position.y = -0.6;
  g.add(plate);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.3, 0.8, 36), dark);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0.2, -0.03, 0.78);
  g.add(barrel);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.355, 0.04, 16, 48), gold);
  ring.position.set(0.2, -0.03, 1.16);
  g.add(ring);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.31, 36), glass);
  lens.position.set(0.2, -0.03, 1.15);
  g.add(lens);
  const vf = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.3, 0.62), metal);
  vf.position.set(-0.62, 0.42, 0.5);
  g.add(vf);
  const eye = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.04, 12, 24), dark);
  eye.position.set(-0.62, 0.42, 0.85);
  g.add(eye);

  [-0.3, 0.34].forEach((pz, k) => {
    const reel = new THREE.Group();
    reel.add(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.085, 40), metal));
    reel.add(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.14, 18), gold));
    for (let i = 0; i < 3; i++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.095, 0.7), dark);
      spoke.rotation.y = (i * Math.PI) / 3;
      reel.add(spoke);
    }
    reel.rotation.z = Math.PI / 2;
    reel.position.set(0, 0.82 + k * 0.1, pz);
    g.add(reel);
    reel.userData.spin = true;
  });

  const crank = new THREE.Group();
  crank.add(new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.035, 10, 26), gold));
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 12), gold);
  rod.rotation.z = Math.PI / 2;
  rod.position.set(0.1, 0, 0);
  crank.add(rod);
  crank.position.set(1.02, -0.12, 0);
  crank.rotation.y = Math.PI / 2;
  g.add(crank);

  scene.add(g);
  return g;
}

export function animateIntroCamera(g, elapsed, dt) {
  g.rotation.y = elapsed * 0.55;
  g.rotation.x = Math.sin(elapsed * 0.7) * 0.09;
  g.children.forEach((c) => {
    if (c.userData && c.userData.spin) c.rotation.x += dt * 2.4;
  });
}
