"use client";
import { redirect, RedirectType } from "next/navigation";
import React from "react";

export const Actions = () => {
  return (
    <button
      onClick={async () => {
        const res = await fetch("/api/generate-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        redirect(`/tokens/${data.token}`, RedirectType.push);
      }}
    >
      generate token
    </button>
  );
};
