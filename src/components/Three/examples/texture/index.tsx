import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import gsap from "gsap";

const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load("/textures/entity/block.webp");

// texture.minFilter = THREE.NearestFilter;
texture.magFilter = THREE.NearestFilter;

const gui = new GUI({
  title: "Debug UI",
  width: 300,
  // closeFolders: true,
});
// gui.hide();

// stop propagating dblclick on debug ui
gui.domElement.addEventListener("dblclick", (e) => {
  e.stopPropagation();
});
//

window.addEventListener("keydown", (e) => {
  if (e.key === "h") {
    gui.show(gui._hidden);
  }
});

const cubeTweaks = gui.addFolder("Cube");
// cubeTweaks.close();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const cursor = {
  x: 0,
  y: 0,
};

const debugObject = {
  segments: 5,
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

// enable double click toggle fullscreen
window.addEventListener("dblclick", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.body.requestFullscreen();
  }
});

function renderScene(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();

  texture.colorSpace = THREE.SRGBColorSpace;
  
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.segments,
      debugObject.segments,
      debugObject.segments
    ),

    new THREE.MeshBasicMaterial({
      // color: "#0288D1",
      map: texture,
      // wireframe: true,
    })
  );

  const actions = {
    spin() {
      gsap.to(mesh.rotation, {
        y: mesh.rotation.y + Math.PI * 2,
        duration: 1,
      });
    },
  };

  scene.add(mesh);

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  // camera.position.x = 2;
  // camera.position.y = 2;
  // camera.aspect = sizes.width / sizes.height;
  camera.position.z = 3;

  cubeTweaks
    .add(camera.position, "z")
    .min(-3)
    .max(10)
    .step(0.01)
    .name("Camera Z");
  cubeTweaks.add(mesh.material, "wireframe").name("Wireframe");
  cubeTweaks.addColor(mesh.material, "color").name("Color");
  cubeTweaks.add(actions, "spin").name("Spin");
  cubeTweaks
    .add(debugObject, "segments")
    .min(1)
    .max(50)
    .step(1)
    .onFinishChange(() => {
      mesh.geometry.dispose();
      mesh.geometry = new THREE.BoxGeometry(
        1,
        1,
        1,
        debugObject.segments,
        debugObject.segments,
        debugObject.segments
      );
    });

  camera.lookAt(mesh.position);
  scene.add(camera);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.setSize(sizes.width, sizes.height);

  // using orbit controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const animation = () => {
    renderer.render(scene, camera);
    // update camera manually
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = -cursor.y * 3;
    // camera.lookAt(mesh.position);

    // update camera by controls
    controls.update();

    window.requestAnimationFrame(animation);
  };

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    // handle 2 monitor with different pixel ratios
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  animation();
}

export const Example4 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

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
