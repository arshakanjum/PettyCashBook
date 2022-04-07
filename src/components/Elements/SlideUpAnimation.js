import React from "react";
import { Transition } from "@windmill/react-ui";

export default function SlideUpAnimation({ on, children }) {
  return (
    <Transition
      show={on}
      enter="transition ease-in-out duration-600 transform"
      enterFrom="opacity-0  -translate-y-8"
      enterTo="opacity-100  translate-y-0"
      leave="transition ease-in duration-750 transform"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      {children}
    </Transition>
  );
}
