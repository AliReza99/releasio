import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader, DRACOLoader } from "three/examples/jsm/Addons.js";

// @refresh reset

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

function initialize({ canvas }: { canvas: HTMLCanvasElement }) {
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.set(2, 2, 2);
  camera.aspect = sizes.width / sizes.height;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
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
  controls.target.set(0, 0.75, 0);
  controls.enableDamping = true;

  //
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  let mixer: THREE.AnimationMixer | null = null;

  // gltfLoader.load("/models/Duck/glTF-Draco/Duck.gltf", (gltf) => {
  //   const children = [...gltf.scene.children];
  //   for (const child of children) {
  //     scene.add(child);
  //   }
  // });

  gltfLoader.load("/models/Fox/glTF/Fox.gltf", (gltf) => {
    gltf.scene.scale.set(0.025, 0.025, 0.025);
    scene.add(gltf.scene);

    // Animation
    mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[2]);
    action.play();
  });
  /**
   * Floor
   */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: "#444444",
      metalness: 0,
      roughness: 0.5,
    })
  );
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI * 0.5;
  scene.add(floor);

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.camera.far = 15;
  directionalLight.shadow.camera.left = -7;
  directionalLight.shadow.camera.top = 7;
  directionalLight.shadow.camera.right = 7;
  directionalLight.shadow.camera.bottom = -7;
  directionalLight.position.set(-5, 5, 0);
  scene.add(directionalLight);

  //
  const clock = new THREE.Clock();
  let previousTime = 0;

  function tick() {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Model animation
    if (mixer) {
      mixer.update(deltaTime);
    }

    renderer.render(scene, camera);

    controls.update();

    requestAnimationFrame(tick);
  }

  tick();
}

let isCalled = false;

export function Example11Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || isCalled) return;

    isCalled = true;

    initialize({ canvas: canvasRef.current });
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
