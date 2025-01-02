import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as CANNON from "cannon-es";
import GUI from "lil-gui";

// @refresh reset

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const gui = new GUI();
const debugObject: Record<string, () => void> = {};

function initialize({ canvas }: { canvas: HTMLCanvasElement }) {
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  // camera.position.z = 3;
  camera.position.set(-3, 3, 3);

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

  //
  debugObject.createSphere = () => {
    createSphere(
      Math.random() * 0.5,
      new CANNON.Vec3((Math.random() - 0.5) * 3, 3, (Math.random() - 0.5) * 3)
    );
  };

  gui.add(debugObject, "createSphere");

  debugObject.createBox = () => {
    createBox(
      Math.random(),
      Math.random(),
      Math.random(),
      new CANNON.Vec3((Math.random() - 0.5) * 3, 3, (Math.random() - 0.5) * 3)
    );
  };
  gui.add(debugObject, "createBox");

  // Reset
  debugObject.reset = () => {
    for (const object of objectsToUpdate) {
      // Remove body
      object.body.removeEventListener("collide", playHitSound);
      world.removeBody(object.body);

      // Remove mesh
      scene.remove(object.mesh);
    }

    objectsToUpdate.splice(0, objectsToUpdate.length);
  };
  gui.add(debugObject, "reset");

  const hitSound = new Audio("/sounds/hit.mp3");

  const playHitSound = (collision: any) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal();

    if (impactStrength > 1.5) {
      hitSound.volume = Math.random();
      hitSound.currentTime = 0;
      hitSound.play();
    }
  };
  const cubeTextureLoader = new THREE.CubeTextureLoader();

  const environmentMapTexture = cubeTextureLoader.load([
    "/textures/environmentMaps/0/px.png",
    "/textures/environmentMaps/0/nx.png",
    "/textures/environmentMaps/0/py.png",
    "/textures/environmentMaps/0/ny.png",
    "/textures/environmentMaps/0/pz.png",
    "/textures/environmentMaps/0/nz.png",
  ]);
  /**
   * Physics
   */
  const world = new CANNON.World();
  world.broadphase = new CANNON.SAPBroadphase(world);
  world.allowSleep = true;
  world.gravity.set(0, -9.82, 0);
  // Default material
  const defaultMaterial = new CANNON.Material("default");
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1,
      restitution: 0.7,
    }
  );
  world.defaultContactMaterial = defaultContactMaterial;

  // Floor
  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body();
  floorBody.mass = 0;
  floorBody.addShape(floorShape);
  floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0),
    Math.PI * 0.5
  );
  world.addBody(floorBody);

  /**
   * Utils
   */
  const objectsToUpdate: {
    mesh: THREE.Mesh<any>;
    body: CANNON.Body;
  }[] = [];

  // Create sphere
  const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  });

  const createSphere = (radius: number, position: CANNON.Vec3) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    mesh.castShadow = true;
    mesh.scale.set(radius, radius, radius);
    mesh.position.copy(position);
    scene.add(mesh);

    // Cannon.js body
    const shape = new CANNON.Sphere(radius);

    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape: shape,
      material: defaultMaterial,
    });
    body.position.copy(position);
    body.addEventListener("collide", playHitSound);
    world.addBody(body);

    // Save in objects
    objectsToUpdate.push({ mesh, body });
  };

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  });
  const createBox = (
    width: number,
    height: number,
    depth: number,
    position: CANNON.Vec3
  ) => {
    // Three.js mesh
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    // Cannon.js body
    const shape = new CANNON.Box(
      new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
    );

    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape: shape,
      material: defaultMaterial,
    });
    body.position.copy(position);
    body.addEventListener("collide", playHitSound);
    world.addBody(body);

    // Save in objects
    objectsToUpdate.push({ mesh, body });
  };

  createBox(1, 1.5, 2, new CANNON.Vec3(0, 3, 0));

  /**
   * Floor
   */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
      color: "#777777",
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
      envMapIntensity: 0.5,
    })
  );
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI * 0.5;
  scene.add(floor);

  /**
   * Lights
   */
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.camera.far = 15;
  directionalLight.shadow.camera.left = -7;
  directionalLight.shadow.camera.top = 7;
  directionalLight.shadow.camera.right = 7;
  directionalLight.shadow.camera.bottom = -7;
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  //
  const clock = new THREE.Clock();
  let oldElapsedTime = 0;

  function tick() {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    // Update physics
    world.step(1 / 60, deltaTime, 3);

    for (const object of objectsToUpdate) {
      object.mesh.position.copy(object.body.position);
      object.mesh.quaternion.copy(object.body.quaternion);
    }

    renderer.render(scene, camera);

    controls.update();

    requestAnimationFrame(tick);
  }

  tick();
}

let isCalled = false;

export function Example10Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || isCalled) return;

    isCalled = true;

    initialize({ canvas: canvasRef.current });
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
