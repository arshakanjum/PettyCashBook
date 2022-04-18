import React from "react";
import MyComponent from "react-fullpage-custom-loader";
function ThemedSuspense() {
  console.log(
    getComputedStyle(document.querySelector(":root")).getPropertyValue(
      "primary"
    )
  );
  return (
    <MyComponent
      wrapperBackgroundColor={getComputedStyle(
        document.querySelector(":root")
      ).getPropertyValue("background-color")}
      color={getComputedStyle(document.querySelector(":root")).getPropertyValue(
        "color"
      )}
      loaderType={"ball-scale-multiple"}
      sentences={[]}
    />
  );
}

export default ThemedSuspense;
