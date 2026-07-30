import { useEffect, useRef } from 'react';
import { createAvatarScene } from '../three/avatar';
import { createRenderer, disposeRenderer, fitRenderer } from '../three/common';
import { useMouseRef } from '../context/MouseContext';
import { ACCENT } from '../data/content';

function onScreen(el, pad = 150) {
  if (!el) return false;
  const b = el.getBoundingClientRect();
  return b.bottom > -pad && b.top < window.innerHeight + pad;
}

// The hero's 3D avatar: loads the GLB once, then every frame eases its
// rotation toward the mouse position (yaw from x, pitch from y), adds a
// gentle idle float, and plays any baked-in GLB animation clips.
export default function Avatar3D({ outerRef }) {
  const mountRef = useRef(null);
  const mouse = useMouseRef();

  useEffect(() => {
    const wrap = mountRef.current;
    if (!wrap) return undefined;

    const { scene, camera, group, state, frame } = createAvatarScene(ACCENT);
    const renderer = createRenderer(wrap, 1.35);
    fitRenderer(renderer, camera, wrap);
    frame();

    const resizeObs = new ResizeObserver(() => {
      fitRenderer(renderer, camera, wrap);
      frame();
    });
    resizeObs.observe(wrap);

    let raf;
    let t0 = performance.now();
    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (t - t0) / 1000);
      t0 = t;
      const elapsed = t / 1000;
      const outer = (outerRef && outerRef.current) || wrap;
      if (!onScreen(outer, 150)) return;
      if (state.mixer) state.mixer.update(dt);
      const m = mouse.current;
      const ty = m.x * 0.42;
      const tx = -m.y * 0.18;
      group.rotation.y += (ty - group.rotation.y) * 0.055;
      group.rotation.x += (tx - group.rotation.x) * 0.055;
      group.position.y = Math.sin(elapsed * 1.05) * 0.07;
      group.position.x = m.x * 0.07;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      resizeObs.disconnect();
      disposeRenderer(renderer);
    };
  }, [mouse, outerRef]);

  return <div ref={mountRef} className="avatar-stage" />;
}
