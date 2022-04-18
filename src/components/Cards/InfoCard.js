import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@windmill/react-ui";
import classNames from "classnames";

function InfoCard({
  className,
  title,
  value,
  children: icon,
  titleColor,
  valueColor,
}) {
  const titleStr = titleColor
    ? classNames("mb-2 text-sm font-medium ", titleColor)
    : "mb-2 text-sm font-medium text-gray-600 dark:text-gray-400 ";
  const valueStr = valueColor
    ? classNames("text-lg font-semibold ", valueColor)
    : "text-lg font-semibold text-gray-700 dark:text-gray-200 ";

  return (
    <Card className={"shadow-lg " + className}>
      <CardBody className="flex items-center">
        {icon}
        <div>
          <p className={titleStr}>{title}</p>
          <p className={valueStr}>{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}

export default InfoCard;
