import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";

import { textures } from "../../components/textures";

// @refresh reset

const texture = textures.flagsFr;
texture.colorSpace = THREE.SRGBColorSpace;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

function initialize({ canvas }: { canvas: HTMLCanvasElement }) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 32, 32),
    // new THREE.MeshBasicMaterial({ color: "#f00" })
    new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uFrequency: {
          value: new THREE.Vector2(10, 5),
        },
        uTime: {
          value: 0.0,
        },
        uColor: {
          value: new THREE.Color("orange"),
        },
        uTexture: {
          value: texture,
        },
      },
    })
  );

  const randoms = new Float32Array(mesh.geometry.attributes.position.count);

  for (const r in randoms) {
    randoms[r] = Math.random();
  }

  mesh.geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

  //
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
  // scene.background = new THREE.Color("#fff");
  scene.add(camera, mesh);

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

  const clock = new THREE.Clock();
  // let elapsedTime = 0;
  function tick() {
    renderer.render(scene, camera);

    const elapsedTime = clock.getElapsedTime();

    // console.log(`[elapsedTime] `, elapsedTime);
    //
    mesh.material.uniforms.uTime.value = elapsedTime;

    controls.update();

    requestAnimationFrame(tick);
  }

  tick();
}

let isCalled = false;

export function BasicShaders() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || isCalled) return;

    isCalled = true;

    initialize({ canvas: canvasRef.current });
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
