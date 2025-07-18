// @/app/(auth)/reset-password/page.tsx

import ResetPassword from "@/components/ResetPassword";
import { Suspense } from "react";

export default function ResetPAasswordPage() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}
