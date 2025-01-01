import * as THREE from "three";
import _ from "lodash";

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
  //
  "/textures/bricks/color.jpg",
  "/textures/bricks/ambientOcclusion.jpg",
  "/textures/bricks/normal.jpg",
  "/textures/bricks/roughness.jpg",
  //
  "/textures/grass/color.jpg",
  "/textures/grass/ambientOcclusion.jpg",
  "/textures/grass/normal.jpg",
  "/textures/grass/roughness.jpg",
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

// export const environementMap = {
//   "2k": rgbeLoader.load("/textures/environmentMap/2k.hdr", (environmentMap) => {
//     environmentMap.mapping = THREE.EquirectangularReflectionMapping;
//   }),
// };
