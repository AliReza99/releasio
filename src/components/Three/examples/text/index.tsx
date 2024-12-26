import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  OrbitControls,
  FontLoader,
  TextGeometry,
} from "three/examples/jsm/Addons.js";

// @refresh reset

const fontLoader = new FontLoader();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/9.png");

matcapTexture.colorSpace = THREE.SRGBColorSpace;

function initialize({ canvas }: { canvas: HTMLCanvasElement }) {
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.z = 3;
  camera.aspect = sizes.width / sizes.height;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#fff");
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
  controls.dampingFactor = 0.25;

  fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
    const textGeometry = new TextGeometry("THreeJS", {
      font: font,
      size: 0.5,
      depth: 0.2,
      curveSegments: 50,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 30,
    });

    // const axesHelper = new THREE.AxesHelper(2);
    // textGeometry.

    textGeometry.center();

    const textMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });

    const text = new THREE.Mesh(textGeometry, textMaterial);

    // text.position.x -= 2;

    scene.add(text);
    // camera.lookAt(text.position);
  });

  function tick() {
    renderer.render(scene, camera);

    controls.update();

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

  return <canvas ref={canvasRef}></canvas>;
}
