// @/app/(auth)/verify-email/page.tsx

import VerifyEmailPage from "@/components/VerifyEmail";
import { Suspense } from "react";

export default function VerifyEmail() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  );
}
