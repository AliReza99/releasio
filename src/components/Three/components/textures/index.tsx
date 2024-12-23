import * as THREE from "three";
import _ from "lodash";
import { RGBELoader } from "three/examples/jsm/Addons.js";

const loader = new THREE.TextureLoader();

const locations = [
  "/textures/door/alpha.jpg",
  "/textures/door/ambientOcclusion.jpg",
  // "/textures/environmentMap/2k.hdr",
  "/textures/matcaps/1.png",
  "/textures/matcaps/2.png",
  "/textures/matcaps/3.png",
  "/textures/matcaps/4.png",
  "/textures/matcaps/5.png",
  "/textures/matcaps/6.png",
  "/textures/matcaps/7.png",
  "/textures/matcaps/8.png",
  "/textures/matcaps/9.png",
  "/textures/matcaps/18.png",
  "/textures/matcaps/19.png",
  "/textures/gradients/3.jpg",
  "/textures/gradients/5.jpg",
  "/textures/door/color.jpg",
  "/textures/door/height.jpg",
  "/textures/door/metalness.jpg",
  "/textures/door/normal.jpg",
  "/textures/door/roughness.jpg",
];

export const textures = locations.reduce((pre, current) => {
  const splittedName = current
    .replace(".jpg", "")
    .replace(".png", "")
    .split("/");

  // splittedName.pop();

  const name = _.camelCase(
    [splittedName.at(-2), splittedName.at(-1)].join(" ")
  );

  pre[name] = loader.load(current);

  return pre;
}, {} as Record<string, THREE.Texture>);

const rgbeLoader = new RGBELoader();

// export const environementMap = {
//   "2k": rgbeLoader.load("/textures/environmentMap/2k.hdr", (environmentMap) => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   }),
// };
