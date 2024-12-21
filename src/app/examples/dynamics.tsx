"use client";

import dynamic from "next/dynamic";

export const Scene1Lazy = dynamic(
  () => import("@/components/Three/examples/Scene1").then((m) => m.Scene1),
  { ssr: false }
);

export const Scene2Lazy = dynamic(
  () =>
    import("@/components/Three/examples/starter").then((m) => m.ThreeStarter),
  { ssr: false }
);

export const Example3Lazy = dynamic(
  () => import("@/components/Three/examples/camera").then((m) => m.Example3),
  { ssr: false }
);
