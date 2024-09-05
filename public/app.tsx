import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { WjTree } from "../src/index"; //引入组件
import DropdownInput from "../src/components/DropdownInput";
import { Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import _ from "lodash-es";

const App = () => {
  const refInput = useRef<any>(null);
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [add, setIsAdd] = useState(false);
  const [treeData, setTreeData] = useState([
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
  ]);
  // 添加节点
  const addItem = (node: any) => {
    const len = _.isEmpty(node?.children) ? 0 : node?.children?.length;
    // 插入节点isInput为true，渲染节点的判断条件
    const newChild = _.isEmpty(node.children)
      ? [{ isInput: true, key: `${node?.key}-${len}` }]
      : [
          {
            isInput: true,
            key: `${node?.key}-${len}`,
          },
          ...node.children,
        ];
    const data = updateTreeData(treeData, node, newChild);
    setTreeData(data);
    const expands = expandedKeys?.includes(node?.key)
      ? expandedKeys
      : [node?.key, ...expandedKeys];
    setExpandedKeys(expands);
    setIsAdd(true);
  };

  const updateTreeData = (tree: any, target: any, children: any) => {
    return tree.map((node: any) => {
      if (node.key === target.key) {
        return { ...node, children };
      } else if (node?.children) {
        return {
          ...node,
          children: updateTreeData(node?.children, target, children),
        };
      }
      return node;
    });
  };
  // 监听添加节点的输入
  const onEnter = (e: any, node: any) => {
    const value = e?.target?.value;

    setIsAdd(false);
    if (!value) {
      // 输入内容为空就回车，直接删除编辑框的节点
      const dele = deleteNodeByKey(treeData, node?.key);
      setTreeData(dele);
      return;
    }
    // 有输入内容就跟新
    const data = updateItem(treeData, node?.key, value);
    setTreeData(data);
  };

  // updateItem
  // 根据key 找到正在输入的节点，将输入内容跟新到title（显示节点的名字），并删除之前的isInput属性
  const updateItem: any = (tree: any, key: string, data: any) => {
    return _.map(tree, (item: any) => {
      if (item?.key === key) {
        item.title = data;
        return _.omit(item, "isInput");
      } else if (item?.children) {
        return { ...item, children: updateItem(item?.children, key, data) };
      }
      return item;
    });
  };

  // =================================编辑节点========================================================
  const editItem = (node: any) => {
    const data = editTreeItem(treeData, node?.key);
    setTreeData(data);
    setIsAdd(true);
  };

  // 节点呈编辑状态
  const editTreeItem: any = (tree: any, key: string) => {
    return _.map(tree, (item: any) => {
      if (item?.key === key) {
        item.isInput = true;
        console.log("进来啦", item);

        return item;
      } else if (item?.children) {
        return { ...item, children: editTreeItem(item?.children, key) };
      }
      return item;
    });
  };
  // ========================================删除节点======================================
  // deleteNodeByKey
  // 根据key 找到要删除的节点
  const deleteNodeByKey: any = (treeData: any, keyToDelete: string) => {
    return _.map(treeData, (node: any) => {
      if (node.key === keyToDelete) {
        // 如果节点的key匹配要删除的key，则返回undefined，表示不包括该节点
        return undefined;
      } else if (node.children) {
        // 如果节点有子节点，则递归处理子节点
        return {
          ...node,
          children: deleteNodeByKey(node.children, keyToDelete),
        };
      }
      return node; // 其他情况下返回原始节点
    }).filter(Boolean); // 过滤掉undefined的节点
  };

  // 删除节点，子节点合并到上级
  const mergeChildrenToParent: any = (treeData: any, keyToDelete: string) => {
    return _.flatMap(treeData, (node: any) => {
      if (node.key === keyToDelete) {
        // 如果节点的key匹配要删除的key
        if (node.children) {
          // 如果有子节点，将子节点合并到当前节点的父节点中
          const parent = _.find(treeData, (parentNode: any) => {
            return _.some(parentNode.children, { key: keyToDelete });
          });

          if (parent) {
            parent.children = [
              ...(parent.children || []),
              ...(node.children || []),
            ];
          }
          return undefined; // 返回undefined，表示删除当前节点
        } else {
          return undefined; // 如果没有子节点，直接删除当前节点
        }
      } else if (node.children) {
        // 如果节点有子节点，则递归处理子节点
        return {
          ...node,
          children: mergeChildrenToParent(node.children, keyToDelete),
        };
      }
      return node; // 其他情况下返回原始节点
    }).filter(Boolean); // 过滤掉undefined的节点
  };
  // =====================================================================================================
  // 自定义节点
  const titleRender = (node: any) => {
    const { title, icon, key, isInput } = node;
    const paddingLeft = 16 * (node.level - 1);
    if (isInput)
      return (
        <DropdownInput
          ref={refInput}
          initValue={title}
          onPressEnter={(e) => onEnter(e, node)}
          onBlur={(e) => onEnter(e, node)}
        />
      );
    return (
      <Dropdown
        overlay={() => (
          <Menu
            onClick={(e) => {
              if (e?.key === "add") addItem(node);
              if (e?.key === "edit") editItem(node);
              if (e?.key === "del") {
                const data = mergeChildrenToParent(treeData, node?.key);
                setTreeData(data); // 更新树 数据
              }
            }}
          >
            <Menu.Item key="del">刪除</Menu.Item>
            <Menu.Item key="add">新增</Menu.Item>
            <Menu.Item key="edit">编辑</Menu.Item>
          </Menu>
        )}
        trigger={["click"]}
      >
        <div
          key={key}
          style={{ paddingLeft, display: "flex" }}
          className="titleRoot"
        >
          {icon}&nbsp;&nbsp;
          <div>{title}</div>
        </div>
      </Dropdown>
    );
  };

  return <WjTree treeSourceData={treeData} titleRender={titleRender} />;
};
render(<App />, document.getElementById("root")); //获取虚拟dom的挂载节点
