import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import GUI from "lil-gui";

import { textures } from "../../components/textures";

// @refresh reset

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const debugObject = { depthColor: "#186691", surfaceColor: "#9bd8ff" };

// Colors

const texture = textures.flagsFr;
texture.colorSpace = THREE.SRGBColorSpace;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

function initialize({ canvas }: { canvas: HTMLCanvasElement }) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 512, 512),
    // new THREE.MeshBasicMaterial({ color: "#f00" })
    new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {
          value: 0.0,
        },
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
      },
    })
  );

  const waterMaterial = mesh.material;

  gui.addColor(debugObject, "depthColor").onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor);
  });
  gui.addColor(debugObject, "surfaceColor").onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
  });

  gui
    .add(waterMaterial.uniforms.uBigWavesElevation, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("uBigWavesElevation");
  gui
    .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
    .min(0)
    .max(10)
    .step(0.001)
    .name("uBigWavesFrequencyX");
  gui
    .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
    .min(0)
    .max(10)
    .step(0.001)
    .name("uBigWavesFrequencyY");
  gui
    .add(waterMaterial.uniforms.uBigWavesSpeed, "value")
    .min(0)
    .max(4)
    .step(0.001)
    .name("uBigWavesSpeed");

  gui
    .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("uSmallWavesElevation");
  gui
    .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
    .min(0)
    .max(30)
    .step(0.001)
    .name("uSmallWavesFrequency");
  gui
    .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
    .min(0)
    .max(4)
    .step(0.001)
    .name("uSmallWavesSpeed");
  gui
    .add(waterMaterial.uniforms.uSmallIterations, "value")
    .min(0)
    .max(5)
    .step(1)
    .name("uSmallIterations");

  gui
    .add(waterMaterial.uniforms.uColorOffset, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("uColorOffset");
  gui
    .add(waterMaterial.uniforms.uColorMultiplier, "value")
    .min(0)
    .max(10)
    .step(0.001)
    .name("uColorMultiplier");

  mesh.rotateX(-Math.PI * 0.5);

  const randoms = new Float32Array(mesh.geometry.attributes.position.count);

  for (const r in randoms) {
    randoms[r] = Math.random();
  }

  mesh.geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

  //
  const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height);
  camera.position.z = 3;
  camera.position.y = 2;
  camera.position.x = 2;
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

// let isCalled = false;

export function ShadersExample1() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    initialize({ canvas: canvasRef.current });
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
