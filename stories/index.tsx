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
                  McIntosh
                </a>
              ),
              searchKeys: ["McIntosh"],
              children: []
            },
            {
              id: "Granny Smith",
              title: (
                <a href="https://en.wikipedia.org/wiki/Granny_Smith">
                  Granny Smith
                </a>
              ),
              searchKeys: ["Granny", "Smith"],
              children: []
            },
            {
              id: "Fuji",
              title: (
                <a href="https://en.wikipedia.org/wiki/Fuji_(apple)">Fuji</a>
              ),
              searchKeys: ["Fuji"],
              children: []
            }
          ]
        },
        {
          title: <a href="https://en.wikipedia.org/wiki/Banana">Bananas</a>,
          id: "bananas",
          searchKeys: ["bananas"],
          children: []
        }
      ]
    },
    {
      id: "vegetables",
      title: <h3>Vegetables</h3>,
      searchKeys: ["vegetables"],
      children: [
        {
          id: "Podded Vegetables",
          title: "Podded Vegetables",
          searchKeys: ["Podded Vegetables"],
          children: [
            {
              title: <a href="https://en.wikipedia.org/wiki/Lentil">Lentil</a>,
              id: "lentil",
              searchKeys: ["lentil"],
              children: []
            },
            {
              title: (
                <a href="https://en.wikipedia.org/wiki/Pea" role="link">
                  Pea
                </a>
              ),
              id: "pea",
              searchKeys: ["pea"],
              children: []
            },
            {
              title: <a href="https://en.wikipedia.org/wiki/Peanut">Peanut</a>,
              id: "peanut",
              searchKeys: ["peanut"],
              children: []
            }
          ]
        },
        {
          id: "Bulb and Stem Vegetables",
          title: "Bulb and Stem Vegetables",
          searchKeys: ["Bulb and Stem Vegetables"],
          children: [
            {
              title: (
                <a href="https://en.wikipedia.org/wiki/Asparagus">Asparagus</a>
              ),
              id: "Asparagus",
              searchKeys: ["Asparagus"],
              children: []
            },
            {
              title: <a href="https://en.wikipedia.org/wiki/Celery">Celery</a>,
              id: "Celeryea",
              searchKeys: ["Celery"],
              children: []
            },
            {
              title: <a href="https://en.wikipedia.org/wiki/Leek">Leek</a>,
              id: "leek",
              searchKeys: ["leek"],
              children: []
            },
            {
              title: <a href="https://en.wikipedia.org/wiki/Onion">Onion</a>,
              id: "Onion",
              searchKeys: ["Onion"],
              children: []
            }
          ]
        },
        {
          id: "Root and Tuberous Vegetables",
          title: "Root and Tuberous Vegetables",
          searchKeys: ["Root and Tuberous Vegetables"],
          children: [
            {
              title: <a href="https://en.wikipedia.org/wiki/Carrot">Carrot</a>,
              id: "Carrot",
              searchKeys: ["Carrot"],
              children: []
            },
            {
              title: <a href="https://en.wikipedia.org/wiki/Ginger">Ginger</a>,
              id: "Ginger",
              searchKeys: ["Ginger"],
              children: []
            },
            {
              title: (
                <a href="https://en.wikipedia.org/wiki/Parsnip">Parsnip</a>
              ),
              id: "Parsnip",
              searchKeys: ["Parsnip"],
              children: []
            },
            {
              title: <a href="https://en.wikipedia.org/wiki/Potato">Potato</a>,
              id: "Potato",
              searchKeys: ["Potato"],
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
