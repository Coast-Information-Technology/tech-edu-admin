// @/app/(auth)/forgot-password/page.tsx

import ForgotPasswordPage from "@/components/ForgotPassword";
import { Suspense } from "react";

export default function ForgotPassword() {
  return (
    <Suspense>
      <ForgotPasswordPage />
    </Suspense>
  );
}
