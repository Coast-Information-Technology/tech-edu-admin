import Resume1 from "@/components/CVLayouts/CV_1";
import Resume2 from "@/components/CVLayouts/CV_2";
import Resume3 from "@/components/CVLayouts/CV_3";
import Resume5 from "@/components/CVLayouts/CV_5";
import Resume6 from "@/components/CVLayouts/CV_6";
import React from "react";

const page = () => {
  return (
    <div className="py-24 space-y-8">
      <Resume1 />
      <Resume2 />
      <Resume3 />
      <Resume5 />
      <Resume6 />
    </div>
  );
};

export default page;
