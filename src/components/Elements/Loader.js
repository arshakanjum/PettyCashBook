import classNames from "classnames";
import React from "react";

export default function Loader({ className }) {
  var baseStyle = "w-full justify-center items-center flex";
  const cls = classNames(baseStyle, className);

  return <div className={cls}>Loading...</div>;
}
