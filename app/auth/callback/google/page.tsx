// app/auth/callback/google/page.tsx
"use client";

import GoogleCallbackHandler from "@/components/GoogleCallbackHandler";
import { Suspense } from "react";

export default function GoogleCallbackPage() {
  return (
    <Suspense>
      <GoogleCallbackHandler />
    </Suspense>
  );
}
