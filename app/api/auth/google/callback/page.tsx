// app/auth/google/callback/page.tsx (for Next.js App Router)

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      const url = new URL(window.location.href);
      const token = url.searchParams.get("token");

      if (token) {
        localStorage.setItem("token", token);
        router.push("/dashboard"); // or wherever you want
      } else {
        router.push("/login?error=invalid_token");
      }
    };

    handleRedirect();
  }, []);

  return <p>Signing you in...</p>;
}
