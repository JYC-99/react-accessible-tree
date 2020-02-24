import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Food } from "./Food";

storiesOf("ReactAccessibleTree", module).add("Default", () => {
  return <Food />;
});
