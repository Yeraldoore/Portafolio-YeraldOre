import * as THREE from 'three';

// Builds the three centerpiece objects for "Detrás de cámara": a mirrorless
// camera, a 3-axis gimbal with payload, and a softbox light rig on a stand.
// Each gets `userData.spin` (idle rotation speed) so the caller's render
// loop can spin them independently.
export function createGearScene(accentColor) {
  const A = new THREE.Color(accentColor);
  const body = new THREE.MeshStandardMaterial({ color: 0x1b1b1f, metalness: 0.86, roughness: 0.34 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x0c0c0e, metalness: 0.5, roughness: 0.6 });
  const gold = new THREE.MeshStandardMaterial({ color: A, metalness: 1, roughness: 0.2 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x0a1216, metalness: 1, roughness: 0.05, emissive: A, emissiveIntensity: 0.2 });
  const soft = new THREE.MeshStandardMaterial({ color: 0xf6f1e6, emissive: 0xfff6e4, emissiveIntensity: 0.85, roughness: 0.9 });

  // ---- mirrorless camera ----
  const cam3 = new THREE.Group();
  const cbody = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.0, 0.62), body);
  cam3.add(cbody);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.34, 1.0, 0.68), dark);
  grip.position.set(-0.66, -0.02, 0.04);
  cam3.add(grip);
  const hump = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), body);
  hump.position.set(0.06, 0.58, -0.02);
  cam3.add(hump);
  const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.06, 0.3), dark);
  shoe.position.set(0.06, 0.76, -0.02);
  cam3.add(shoe);
  const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.1, 40), gold);
  mount.rotation.x = Math.PI / 2;
  mount.position.set(0.16, 0, 0.34);
  cam3.add(mount);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.34, 0.78, 40), dark);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0.16, 0, 0.74);
  cam3.add(barrel);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.045, 14, 44), gold);
  ring.position.set(0.16, 0, 1.06);
  cam3.add(ring);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.31, 40), glass);
  lens.position.set(0.16, 0, 1.1);
  cam3.add(lens);
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 26), dark);
  dial.position.set(0.52, 0.52, 0.12);
  cam3.add(dial);
  const shutter = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.07, 20), gold);
  shutter.position.set(-0.6, 0.53, 0.1);
  cam3.add(shutter);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.66), glass);
  screen.position.set(0.05, -0.02, -0.32);
  screen.rotation.y = Math.PI;
  cam3.add(screen);
  cam3.userData.spin = 0.38;

  // ---- gimbal ----
  const gim = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 1.1, 28), dark);
  handle.position.set(0, -1.0, 0);
  gim.add(handle);
  const grip2 = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 10, 30), gold);
  grip2.rotation.x = Math.PI / 2;
  grip2.position.set(0, -0.5, 0);
  gim.add(grip2);
  const stem = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.8, 0.16), body);
  stem.position.set(0, -0.05, 0);
  gim.add(stem);
  const yaw = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.18, 28), body);
  yaw.position.set(0, 0.42, 0);
  gim.add(yaw);
  const armH = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.14, 0.14), body);
  armH.position.set(0.3, 0.58, 0);
  gim.add(armH);
  const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2, 26), body);
  roll.rotation.z = Math.PI / 2;
  roll.position.set(0.86, 0.58, 0);
  gim.add(roll);
  const armV = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.82, 0.13), body);
  armV.position.set(0.86, 0.2, 0);
  gim.add(armV);
  const pitch = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.2, 26), gold);
  pitch.rotation.x = Math.PI / 2;
  pitch.position.set(0.86, -0.16, 0.1);
  gim.add(pitch);
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 0.5), dark);
  plate.position.set(0.42, -0.3, 0.1);
  gim.add(plate);
  const payload = new THREE.Group();
  const pb = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.55, 0.42), body);
  payload.add(pb);
  const pl = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.18, 0.42, 26), dark);
  pl.rotation.x = Math.PI / 2;
  pl.position.set(0.04, 0, 0.4);
  payload.add(pl);
  const pr = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.03, 12, 30), gold);
  pr.position.set(0.04, 0, 0.6);
  payload.add(pr);
  payload.position.set(0.4, -0.02, 0.1);
  gim.add(payload);
  gim.userData.payload = payload;
  gim.userData.spin = -0.3;

  // ---- softbox light ----
  const rig = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.5, 20), dark);
  base.position.set(0, -0.95, 0);
  rig.add(base);
  [0, 1, 2].forEach((i) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.95, 14), dark);
    leg.position.set(Math.cos(i * 2.1) * 0.28, -1.6, Math.sin(i * 2.1) * 0.28);
    leg.rotation.set(Math.cos(i * 2.1) * 0.42, 0, -Math.sin(i * 2.1) * 0.42);
    rig.add(leg);
  });
  const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 18), gold);
  knuckle.position.set(0, -0.2, 0);
  rig.add(knuckle);
  const boxG = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 1.0, 0.8, 4, 1, true), dark);
  shell.rotation.x = -Math.PI / 2;
  shell.rotation.z = Math.PI / 4;
  boxG.add(shell);
  const diff = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 1.42), soft);
  diff.position.set(0, 0, 0.42);
  boxG.add(diff);
  const glow = new THREE.PointLight(0xfff3e0, 9, 9, 2);
  glow.position.set(0, 0, 0.8);
  boxG.add(glow);
  boxG.rotation.set(-0.12, 0.2, 0.78);
  boxG.position.set(0, 0.5, 0);
  rig.add(boxG);
  rig.userData.spin = 0.26;

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xcfd8e8, 0x0b0a09, 0.5));
  const key = new THREE.DirectionalLight(0xfff4e6, 1.5);
  key.position.set(2.6, 3.4, 5);
  scene.add(key);
  const rimL = new THREE.PointLight(A, 12, 20, 2);
  rimL.position.set(-4.2, 1.8, -2.4);
  scene.add(rimL);
  const rimR = new THREE.PointLight(0x6f8cff, 7, 20, 2);
  rimR.position.set(4.4, -1, 2.6);
  scene.add(rimR);

  const items = [cam3, gim, rig];
  items.forEach((o) => {
    const b = new THREE.Box3().setFromObject(o);
    o.userData.baseSize = b.getSize(new THREE.Vector3());
    o.userData.pivot = b.getCenter(new THREE.Vector3());
    o.children.forEach((ch) => ch.position.sub(o.userData.pivot));
    scene.add(o);
  });

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 11.6);
  camera.lookAt(0, 0, 0);

  return { scene, camera, items };
}

// Positions/scales the three items into a row (desktop) or column (narrow
// aspect), and returns each item's projected screen position so the caller
// can place the "Cámara / Gimbal / Iluminación" labels beneath them.
export function frameGear(camera, items) {
  const d = camera.position.z;
  const visH = 2 * d * Math.tan((camera.fov * Math.PI) / 180 / 2);
  const visW = visH * camera.aspect;
  const vertical = camera.aspect < 1.35;
  const slots = vertical
    ? [
        [0, visH * 0.32],
        [0, 0],
        [0, -visH * 0.32]
      ]
    : [
        [-visW * 0.3, visH * 0.04],
        [0, visH * 0.04],
        [visW * 0.3, visH * 0.04]
      ];
  const slotW = vertical ? visW * 0.82 : visW * 0.32;
  const targetH = visH * (vertical ? 0.26 : 0.86);

  items.forEach((o, i) => {
    const size = o.userData.baseSize;
    const reach = Math.hypot(size.x, size.z);
    let k = Math.min(targetH / Math.max(size.y, 0.001), slotW / Math.max(reach, 0.001));
    const room = (visW / 2) * 0.97 - Math.abs(slots[i][0]);
    if ((reach * k) / 2 > room) k = (room * 2) / reach;
    o.scale.setScalar(k);
    o.userData.baseY = slots[i][1];
    o.position.set(slots[i][0], o.userData.baseY, 0);
    o.userData.halfH = (size.y * k) / 2;
  });

  return items.map((o) => {
    if (vertical) {
      const p = new THREE.Vector3(0, o.userData.baseY - o.userData.halfH - visH * 0.028, 0).project(camera);
      return { vertical: true, top: -p.y * 0.5 + 0.5 };
    }
    const p = new THREE.Vector3(o.position.x, 0, 0).project(camera);
    return { vertical: false, left: p.x * 0.5 + 0.5 };
  });
}
