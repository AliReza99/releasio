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

export const Example4Lazy = dynamic(
  () => import("@/components/Three/examples/texture").then((m) => m.Example4),
  { ssr: false }
);

export const Example5Lazy = dynamic(
  () => import("@/components/Three/examples/materials").then((m) => m.Example5),
  { ssr: false }
);

export const Example6Lazy = dynamic(
  () => import("@/components/Three/examples/text").then((m) => m.ExamplePage),
  { ssr: false }
);

export const Example7Lazy = dynamic(
  () =>
    import("@/components/Three/examples/exercise1").then((m) => m.Exercise1),
  { ssr: false }
);

export const Example8Lazy = dynamic(
  () =>
    import("@/components/Three/examples/exercise2").then((m) => m.Exercise2),
  { ssr: false }
);
export const Example9Lazy = dynamic(
  () =>
    import("@/components/Three/examples/exercise3").then((m) => m.ExamplePage),
  { ssr: false }
);
