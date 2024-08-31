import React from "react";
import { render } from "react-dom";
import { WjTree } from "../src/index"; //引入组件

const App = () => {
  const treeData = [
    {
      title: "parent 1",
      key: "0-0",
      children: [
        {
          title: "parent 1-0",
          key: "0-0-0",
          disabled: true,
          children: [
            {
              title: "leaf",
              key: "0-0-0-0",
              disableCheckbox: true,
            },
            {
              title: "leaf",
              key: "0-0-0-1",
            },
          ],
        },
        {
          title: "parent 1-1",
          key: "0-0-1",
          children: [
            {
              title: "888",
              key: "0-0-1-0",
            },
          ],
        },
      ],
    },
  ];
  return <WjTree treeSourceData={treeData} />;
};
render(<App />, document.getElementById("root")); //获取虚拟dom的挂载节点
