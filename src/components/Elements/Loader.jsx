import classNames from "classnames";
import React from "react";
import { BarLoader } from "react-spinners";

export default function Loader({ className, width }) {
  var baseStyle = " animate-pulse flex justify-center items-center h-fit w-fit";
  const cls = classNames(baseStyle, className);

  return (
    <div className={cls}>
      <BarLoader width={width} color="#570df8" />
    </div>
  );
}

Loader.defaultProps = {
  width: 100,
};
