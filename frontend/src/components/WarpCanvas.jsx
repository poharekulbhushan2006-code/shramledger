import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WarpCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const container = canvas.parentElement;
    let width = container ? container.clientWidth : window.innerWidth;
    let height = container ? container.clientHeight : 600;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) {
      console.warn('WebGL initialization skipped:', e);
      return;
    }
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 1.4, 3.2);
    camera.rotation.x = -0.35;

    // Perspective grid field
    const gridGroup = new THREE.Group();
    const gridColor = 0x10B981; // Emerald accent from Aether system
    const size = 40;
    const divisions = 40;

    const grid = new THREE.GridHelper(size, divisions, gridColor, gridColor);
    grid.material.opacity = 0.18;
    grid.material.transparent = true;
    grid.position.z = -5;
    gridGroup.add(grid);

    const grid2 = grid.clone();
    grid2.material = grid.material.clone();
    grid2.material.opacity = 0.18;
    grid2.position.z = -5 - size;
    gridGroup.add(grid2);

    scene.add(gridGroup);

    // Depth fade via fog
    scene.fog = new THREE.Fog(0x020617, 2, 22);

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e) => {
      const rect = container ? container.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
      pointer.x = ((e.clientX - rect.left) / rect.width - 0.5);
      pointer.y = ((e.clientY - rect.top) / rect.height - 0.5);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const startTime = performance.now();
    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const t = (performance.now() - startTime) * 0.001;

      // slow breathing pulse
      const breathe = 1 + Math.sin(t * 0.4) * 0.02;
      gridGroup.scale.set(breathe, 1, breathe);

      // grid drift toward camera
      const speed = 1.6;
      grid.position.z = ((t * speed) % size) - size;
      grid2.position.z = grid.position.z - size;

      // subtle pointer drift
      camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.02;
      camera.position.y += (1.4 - pointer.y * 0.3 - camera.position.y) * 0.02;
      camera.lookAt(0, 0.4, -5);

      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      try {
        renderer.dispose();
        grid.geometry.dispose();
        grid.material.dispose();
        grid2.geometry.dispose();
        grid2.material.dispose();
      } catch (err) {
        // cleanup ignore
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="warp-canvas"
      className="aether-warp-canvas"
    />
  );
}
