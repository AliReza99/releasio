import { useEffect, useRef } from "react";
import * as THREE from "three";
import { textures } from "../../components/textures";
// import { OrbitControls } from "three/examples/jsm/Addons.js";

// @refresh reset

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const mousePosition = {
  x: 0,
  y: 0,
};

function initialize({ canvas }: { canvas: HTMLCanvasElement }) {
  const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height);
  camera.position.z = 10;
  camera.aspect = sizes.width / sizes.height;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const cameraGroup = new THREE.Group();
  cameraGroup.add(camera);
  scene.add(cameraGroup);

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    renderer.setSize(sizes.width, sizes.height);
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Objects
  // const distance = sizes.height;

  const texture = textures.gradients3;
  texture.magFilter = THREE.NearestFilter;

  // const material = ;

  // const geometry = ;

  const material = new THREE.MeshToonMaterial({
    gradientMap: texture,
    color: "#f00",
    // wireframe: true
  });

  const object1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 32, 60),
    material
  );
  const object2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
  const object3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.28, 140, 64),
    material
  );

  const distance = 5;

  object1.position.y = -distance * 0;
  object2.position.y = -distance;
  object3.position.y = -distance * 2;
  //

  object1.position.x = 1;
  object2.position.x = -1;
  object3.position.x = 1;

  const objects = [
    //
    object1,
    object2,
    object3,
  ];

  scene.add(...objects);
  // Particles
  const particleGeometry = new THREE.BufferGeometry();
  const count = 200;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3 + 0] = (Math.random() - 0.5) * 10;
    positions[i3 + 1] = distance * 0.5 - Math.random() * distance * 3;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const particlesMaterial = new THREE.PointsMaterial({
    color: "#000",
    size: 0.05,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeometry, particlesMaterial);

  scene.add(particles);

  // Lights
  const directionLight = new THREE.DirectionalLight("#fff", 1);
  directionLight.position.set(1, 2, 0);
  scene.add(directionLight);
  // Events
  window.addEventListener("mousemove", (e) => {
    // console.log(`[e] `, e);
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
  });
  //

  const clock = new THREE.Clock();
  let previousTime = 0;

  function tick() {
    renderer.render(scene, camera);
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    const yOffset = window.scrollY / window.innerHeight;

    camera.position.y = -yOffset * distance;

    const mouseOffsetX = (mousePosition.x * 0.5) / sizes.width - 0.5;
    const mouseOffsetY = (mousePosition.y * 0.5) / sizes.height - 0.5;
    cameraGroup.position.x +=
      (mouseOffsetX - cameraGroup.position.x) * deltaTime * 1.5;
    cameraGroup.position.y +=
      (-mouseOffsetY - cameraGroup.position.y) * deltaTime * 1.5;

    for (const obj of objects) {
      obj.rotation.x = elapsedTime * 0.1;
      obj.rotation.y = elapsedTime * 0.12;
    }

    //

    requestAnimationFrame(tick);
  }

  tick();
}

let isCalled = false;

export function ExamplePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || isCalled) return;

    isCalled = true;

    initialize({ canvas: canvasRef.current });
  }, []);

  return (
    <div className="flex flex-col bg-white">
      <canvas className="fixed" ref={canvasRef}></canvas>
      <Section>Profile</Section>
      <Section dir="rtl">Examples</Section>
      <Section>Contact Us</Section>
    </div>
  );
}

function Section({
  children,
  dir = "ltr",
}: {
  children: React.ReactNode;
  dir?: "rtl" | "ltr";
}) {
  return (
    <div
      dir={dir}
      className="flex h-[100vh] z-10 text-black text-7xl font-bold items-center p-20 select-none"
    >
      {children}
    </div>
  );
}
