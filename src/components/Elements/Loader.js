import classNames from "classnames";
import React from "react";
import { BounceLoader } from "react-spinners";

export default function Loader({ className }) {
  var baseStyle = "justify-center items-center flex";
  const cls = classNames(baseStyle, className);

  return (
    <div className={cls}>
      <BounceLoader color="#570df8" />
    </div>
  );
}
