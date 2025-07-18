// @/app/(auth)/login/page.tsx

import LoginPage from "@/components/LoginPage";
import { Suspense } from "react";

export default function VerifyEmail() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
