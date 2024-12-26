## Important notes:

- always call `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));`
  and also in the window resize

- always set `new THREE.WebGLRenderer({ antialias: true })`

- remember to call `renderer.setSize(sizes.width, sizes.height); camera.updateProjectionMatrix(); camera.aspect = ratio` in resize of window


- textures used as map and matcap are supposed to be encoded in sRGB. we need to set their colorSpace to `THREE.SRGBColorSpace`

```
doorTexture.colorSpace = THREE.SRGBColorSpace
```

- if you're setting opacity on material you should also set  `material.transparent=true`

- setting `material.alphaMap = texture` will cause white parts to be visible and black parts will be transparent

- using plane geometry if you don't specify material of it: `material.size=THREE.DoubleSide` the behind of it will be invisible

- you can add `// @refresh reset` to any nextjs page to force full reload on every change