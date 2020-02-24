import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ITreeNode, ReactAccessibleTree } from "../src";

storiesOf("ReactAccessibleTree", module).add("Default", () => {
  const [treeData, setTreeData] = React.useState<ITreeNode[]>([
    {
      title: <h3>Fruits</h3>,
      id: "fruits",
      searchKeys: ["fruits"],
      children: [
        {
          title: <div>Oranges</div>,
          id: "oranges",
          searchKeys: ["oranges"],
          children: []
        },
        {
          title: (
            <a href="https://en.wikipedia.org/wiki/Pineapple">Pineapples</a>
          ),
          id: "pineapple",
          searchKeys: ["pineapple"],
          children: []
        },
        {
          title: <div>Apples</div>,
          id: "apple",
          searchKeys: ["apple"],
          children: [
            {
              id: "McIntosh",
              title: (
                <a href="https://en.wikipedia.org/wiki/McIntosh_%28apple%29">
                  McIntosh{" "}
                </a>
              ),
              searchKeys: ["McIntosh"],
              children: []
            }
          ]
        }
      ]
    }
  ]);

  const onChange = (nextData: ITreeNode[]): void => {
    setTreeData(nextData);
  };

  return <ReactAccessibleTree treeData={treeData} onChange={onChange} />;
});
