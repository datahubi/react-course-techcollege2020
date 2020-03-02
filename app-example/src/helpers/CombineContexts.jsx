import React from "react";

export default function CombineContexts(...providers) {
  return ({ children }) =>
    providers.reduce(
      (prev, CurrentProvider) => <CurrentProvider>{prev}</CurrentProvider>,
      children
    );
}
