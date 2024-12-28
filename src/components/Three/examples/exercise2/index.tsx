import GUI from "lil-gui";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const gui = new GUI({
  title: "Debug UI",
  width: 300,
  // closeFolders: true,
});

// @refresh reset

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const parameters = {
  count: 100000,
  size: 0.002,
  radius: 3,
  branches: 5,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 2.4,
  innerColor: "#ff824d",
  outerColor: "#8a92ff",
};

function initialize({ canvas }: { canvas: HTMLCanvasElement }) {
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 3;
  camera.position.y = 0.7;
  // camera.rotation.x = Math.PI * 0.5;
  // camera.lookAt(new THREE.Vector3());
  camera.aspect = sizes.width / sizes.height;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  // scene.background = new THREE.Color("#fff");
  scene.add(camera);

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    renderer.setSize(sizes.width, sizes.height);
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  let geometry: THREE.BufferGeometry | null = null;
  let material: THREE.PointsMaterial | null = null;
  let points: THREE.Points | null = null;

  const colors = new Float32Array(parameters.count * 3);

  function generateGalaxy() {
    geometry?.dispose();
    material?.dispose();
    if (points) {
      scene.remove(points);
    }

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const innerColor = new THREE.Color(parameters.innerColor);
    const outerColor = new THREE.Color(parameters.outerColor);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;

      const radius = Math.random() * parameters.radius;

      const spinAngle = radius * parameters.spin;
      const branchAngle =
        ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;
      const randomY =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;
      const randomZ =
        Math.pow(Math.random(), parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        parameters.randomness *
        radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // color
      const mixedColor = innerColor.clone();
      mixedColor.lerp(outerColor, radius / parameters.radius);

      colors[i3 + 0] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    points = new THREE.Points(geometry, material);

    scene.add(points);
  }

  gui
    .add(parameters, "count")
    .min(1000)
    .max(500000)
    .step(1)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "size")
    .min(0.001)
    .max(0.05)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "radius")
    .min(1)
    .max(3)
    .step(1)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "branches")
    .min(3)
    .max(10)
    .step(1)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "spin")
    .min(-15)
    .max(15)
    .step(0.1)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "randomness")
    .min(0.0)
    .max(1)
    .step(0.01)
    .onFinishChange(generateGalaxy);
  gui.addColor(parameters, "innerColor").onFinishChange(generateGalaxy);
  gui.addColor(parameters, "outerColor").onFinishChange(generateGalaxy);

  generateGalaxy();

  const clock = new THREE.Clock();

  function tick() {
    renderer.render(scene, camera);

    points?.rotation.set(0, clock.getElapsedTime() * 0.01, 0);

    controls.update();

    requestAnimationFrame(tick);
  }

  tick();
}

let isCalled = false;

export function Exercise2() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || isCalled) return;

    isCalled = true;

    initialize({ canvas: canvasRef.current });
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
