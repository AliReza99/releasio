"use client";

import dynamic from "next/dynamic";

const LazyPage = dynamic(() => import("./lazyPage"), { ssr: false });

export default function Page() {
  return <LazyPage />;
}
