import React from "react";
import classNames from "classnames";

function RoundIcon({
  icon: Icon,
  iconColorClass = "text-purple-600 dark:text-purple-100",
  bgColorClass = "bg-purple-100 dark:bg-purple-600",
  className,
}) {
  const baseStyle =
    "flex w-8 h-8 justify-between align-middle p-2 rounded-full";

  const cls = classNames(baseStyle, iconColorClass, bgColorClass, className);
  return (
    <div className={cls}>
      <Icon className="" />
    </div>
  );
}

export default RoundIcon;
