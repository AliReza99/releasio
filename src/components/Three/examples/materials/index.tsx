import React, { useEffect, useRef } from "react";
import GUI from "lil-gui";
import gsap from "gsap";
import * as THREE from "three";
import { OrbitControls, RGBELoader } from "three/examples/jsm/Addons.js";
import { textures } from "@/components/Three/components/textures";

const gui = new GUI({
  title: "Debug UI",
  width: 300,
  // closeFolders: true,
});

const rgbeLoader = new RGBELoader();

console.log(`[textures] `, textures);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
});

function renderScene(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

  camera.position.z = 5;

  // material
  const texture1 = textures.doorColor;
  // const texture1 = textures.matcaps1;
  texture1.colorSpace = THREE.SRGBColorSpace;
  const matcapTexture = textures.matcaps8;
  matcapTexture.colorSpace = THREE.SRGBColorSpace;

  // const material = new THREE.MeshBasicMaterial({
  //   map: textures.doorAlpha,
  // });
  // const material = new THREE.MeshMatcapMaterial({
  //   matcap: matcapTexture,
  // });
  // const material = new THREE.MeshLambertMaterial({});
  // const material = new THREE.MeshPhongMaterial({
  //   shininess: 100,
  //   // wireframe: true
  //   // specular: "#0f0",
  // });

  // const gradientTexture = textures.gradients3;
  // gradientTexture.magFilter = THREE.NearestFilter;

  // const material = new THREE.MeshToonMaterial({
  //   gradientMap: gradientTexture,
  // });

  // const meshStandardOptions = {
  //   metalness: 0.5,
  //   roughness: 0.5,
  // };

  // const material = new THREE.MeshStandardMaterial();

  // material.side = THREE.DoubleSide;
  // material.metalness = 0.5;
  // // material.wireframe = true;
  // material.roughness = 0.5;
  // gui.add(material, "metalness").min(0).max(1).step(0.0001);
  // gui.add(material, "roughness").min(0).max(1).step(0.0001);

  // material.map = texture1;
  // material.aoMap = textures.doorAmbientOcclusion;
  // material.displacementMap = textures.doorHeight;
  // material.displacementScale = 0.2;
  // material.roughnessMap = textures.doorRoughness;
  // material.metalnessMap = textures.doorMetalness;
  // material.normalMap = textures.doorNormal;
  // material.alphaMap = textures.doorAlpha;
  // material.transparent = true;

  const material = new THREE.MeshPhysicalMaterial();

  material.side = THREE.DoubleSide;
  // material.metalness = 0.5;
  // material.roughness = 0.5;
  // gui.add(material, "metalness").min(0).max(1).step(0.0001);
  // gui.add(material, "roughness").min(0).max(1).step(0.0001);
  // gui.add(material, "clearcoat").min(0).max(1).step(0.0001);
  // gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.0001);
  // sheen
  // gui.add(material, "sheen").min(0).max(1).step(0.0001);
  // gui.add(material, "sheenRoughness").min(0).max(1).step(0.0001);
  // gui.addColor(material, "sheenColor");
  //
  // iridescence
  // material.iridescence = 1;
  // material.iridescenceIOR = 1;
  // material.iridescenceThicknessRange = [100, 800];

  // gui.add(material, "iridescence").min(0).max(1).step(0.0001);
  // gui.add(material, "iridescenceIOR").min(0).max(2.333).step(0.0001);
  // gui.add(material.iridescenceThicknessRange, "0").min(1).max(1000).step(0.0001);
  // gui.add(material.iridescenceThicknessRange, "1").min(1).max(1000).step(0.0001);
  //

  // material.map = new THREE.Color("#fff");
  // material.trans
  //

  // material.map = texture1;
  // material.aoMap = textures.doorAmbientOcclusion;
  // material.displacementMap = textures.doorHeight;
  // material.displacementScale = 0.2;
  // material.roughnessMap = textures.doorRoughness;
  // material.metalnessMap = textures.doorMetalness;
  // material.normalMap = textures.doorNormal;
  // material.alphaMap = textures.doorAlpha;
  // material.transparent = true;
  // material.clearcoat = 1;
  // material.clearcoatRoughness = 0;

  // transmission
  material.metalness = 0;
  material.roughness = 0;
  material.transmission = 1;
  material.ior = 1.5;
  material.thickness = 0.5;
  gui.add(material, "transmission").min(0).max(1).step(0.0001);
  gui.add(material, "ior").min(0).max(10).step(0.1);
  gui.add(material, "thickness").min(0).max(1).step(0.0001);
  gui.add(material, "metalness").min(0).max(1).step(0.0001);
  gui.add(material, "roughness").min(0).max(1).step(0.0001);

  // mesh
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 32), material);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 2.5, 30, 30),
    material
  );

  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 48, 64, Math.PI * 2),
    material
  );

  sphere.position.x = -4;
  torus.position.x = 4;
  // planeMesh.position.x = 0;

  // light
  // const ambientLight = new THREE.AmbientLight("#fff", 0.5);
  // const pointLight = new THREE.PointLight("#fff", 30);
  // pointLight.position.y = 3;

  rgbeLoader.load("/textures/environmentMap/2k.hdr", (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap;
    scene.environment = environmentMap;
  });

  //
  scene.add(
    camera,
    sphere,
    plane,
    torus
    // ambientLight,
    //  pointLight
  );

  const control = new OrbitControls(camera, canvas);
  control.enableDamping = true;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });

  renderer.setSize(sizes.width, sizes.height);

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    renderer.setSize(sizes.width, sizes.height);
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const clock = new THREE.Clock();

  function draw() {
    renderer.render(scene, camera);
    control.update();

    //

    //

    const elapsedTime = clock.getElapsedTime();

    torus.rotation.y =
      plane.rotation.y =
      sphere.rotation.y =
        elapsedTime * 0.05;
    torus.rotation.x =
      plane.rotation.x =
      sphere.rotation.x =
        elapsedTime * -0.05;
    //

    requestAnimationFrame(draw);
  }

  draw();
}

let isCalled = false;

export const Example5 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || isCalled) return;

    isCalled = true;

    const canvas = canvasRef.current;
    renderScene(canvas);
  }, []);
  //

  return (
    <div className="flex">
      <div className="flex">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};
