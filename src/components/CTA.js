import React from "react";

function CTA() {
  return (
    <a
      className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600   shadow-md focus:outline-none focus:shadow-outline-purple"
      href="https://github.com/estevanmaito/windmill-dashboard-react"
    >
      <span>
        View more{" "}
        <span dangerouslySetInnerHTML={{ __html: "&RightArrow;" }}></span>
      </span>
    </a>
  );
}

export default CTA;
