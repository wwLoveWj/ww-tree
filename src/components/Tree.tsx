import React, { memo, useState, useEffect, useRef } from "react";
import {
  Tree as AntdTree,
  TreeProps,
  Spin,
  Empty,
  Col,
  Input,
  Space,
  Dropdown,
  TreeDataNode,
  Tooltip,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import classNames from "classnames";
// import styles from "./style.less";
import "./style.less";

interface CustomTreeProps extends TreeProps {
  placeholder?: string;
  showIcon?: boolean;
  showLine?: boolean;
  isShowSearch?: boolean;
  loadingTree?: boolean;
  isAutoExpandParent?: boolean;
  treeSourceData: any;
  fieldNames?: {
    key: string;
    title: string;
    children: string;
  };
  updateTreeSelectVal?: (param: string) => void;
  treeKey?: string;
  expandedKeysFromOutSide?: string[];
  heightFromOutSide?: number;
  selectedKeys?: any;
  actions?: {
    add: string;
  };
  operationItems?: (node: any) => React.ReactNode;
  className?: string;
  titleRender: (node: any) => React.ReactNode;
}

const { Search } = Input;
const WwTree: React.FC<CustomTreeProps> = ({
  placeholder = "请输入组织名称进行搜索",
  showLine = true,
  showIcon = true,
  isShowSearch = true,
  loadingTree = false,
  treeSourceData,
  fieldNames = {
    key: "key",
    title: "title",
    children: "children",
  },
  // fieldNames,
  updateTreeSelectVal,
  treeKey = "orgId",
  isAutoExpandParent,
  expandedKeysFromOutSide,
  heightFromOutSide,
  selectedKeys,
  actions = { add: "子组织" },
  operationItems,
  className,
  titleRender,
  ...props
}) => {
  const [treeData, setTreeData] = useState<any[]>([]); //copy一份树形数据TODO:
  const [filteredData, setFilteredData] = useState<any>([]); //最终传入树形组件的树形数据集合
  const [expandedKeys, setExpandedKeys] = useState<any>([]); //需要展开的树形数据集合
  const [autoExpandParent, setAutoExpandParent] = useState(true); //是否需要自动展开父级树形数据
  const [treeHeight, setTreeHeight] = useState(420); //树形组件的高度设置

  const treeBoxDom = useRef<HTMLDivElement | null>(null);

  // 筛选的当前搜索数据
  const filterTreeData = (data: any = [], value: string): any[] => {
    if (!value) {
      return data;
    }
    const result = data?.map((node: any) => {
      const departmentLabel = fieldNames?.children;
      let currentName = (node as any)?.[fieldNames?.title] || "";
      const children = (node as any)?.[departmentLabel] || [];
      const lowerCaseTitle = currentName?.toLowerCase();
      if (lowerCaseTitle?.includes(value?.toLowerCase())) {
        // 如果节点标题包含搜索值，保留该节点及其子节点
        if (children.length > 0) {
          return {
            ...node,
            [departmentLabel]: filterTreeData(children, value),
          };
        }
        return node;
      }

      // 如果节点标题不包含搜索值，检查其子节点是否包含搜索值
      if (children.length > 0) {
        const filteredChildren = filterTreeData(children, value);
        if (filteredChildren.length > 0) {
          return {
            ...node,
            [departmentLabel]: filteredChildren,
          };
        }
      }
      return null; // 如果节点及其子节点都不包含搜索值，返回null
    });
    // 使用递归过滤数据
    return result.filter((node: null) => node !== null); // 过滤掉为null的节点
  };

  // 筛选时展开哪些数据
  const determineExpandedKeys = (data: any[], value: string): any[] => {
    if (!value) {
      return [];
    }
    // 最终要展开的keys集合
    const keysToExpand: string[] = [];
    // 所有的筛选keys在这里处理的
    const traverseTree = (node: any, parentKeys: string[]) => {
      let currentName = (node as any)?.[fieldNames?.title] || ""; //获取筛选数据中对应的label值
      const children = (node as any)?.[fieldNames?.children] || []; //获取筛选数据中对应的children集合
      const key = (node as any)?.[fieldNames?.key]; //获取筛选数据中对应的key值
      // children有值并且和搜索框输入的值匹配上了
      if (children && currentName.includes(value)) {
        keysToExpand.push(...parentKeys, key);
      }
      if (children) {
        children.forEach((child: any) => {
          traverseTree(child, [...parentKeys, key]);
        });
      }
    };
    data.forEach((node: any) => {
      traverseTree(node, []);
    });
    return keysToExpand;
  };

  // 树形组件上面的搜索框
  const onChange = (e: { target: { value: string } }) => {
    const { value } = e.target;
    // 递归筛选出树形数据进行展示
    const data = filterTreeData(treeData, value);
    // 筛选出的树形数据进行展开处理
    const keysToExpand = determineExpandedKeys(treeData, value);
    setFilteredData(data);
    setAutoExpandParent(true);
    setExpandedKeys(keysToExpand);
  };

  //  点击树选中数据后的操作  将选中值抛出去
  const handelSelect: TreeProps["onSelect"] = (selectedArr, { selected }) => {
    updateTreeSelectVal &&
      updateTreeSelectVal(selected ? selectedArr[0] + "" : "");
    setSelectId(selectedArr[0] + "");
  };

  // 树的展开收起
  const onExpand = (keys: any) => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
  };

  //   外层直接传入treeData数据
  useEffect(() => {
    if (treeSourceData) {
      setTreeData([...treeSourceData]);
      setFilteredData([...treeSourceData]);
      //   是否需要设置自动展开
      if (isAutoExpandParent)
        //  treeKey不能是一个固定值
        setExpandedKeys(treeSourceData.map((item: any) => item[treeKey]));
    }
  }, [treeSourceData]);

  // 设置树形组件的默认高度和打开控制台后的自动高度
  const calcHeight = () => {
    const height = treeBoxDom?.current?.clientHeight || 420;
    setTreeHeight(height);
  };
  useEffect(() => {
    calcHeight();
    window.addEventListener("resize", calcHeight);
    return () => {
      window.removeEventListener("resize", calcHeight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeBoxDom.current]);

  /**
   * 修改赋值时默认展开的keys集合
   */
  useEffect(() => {
    setExpandedKeys([expandedKeysFromOutSide]);
  }, [expandedKeysFromOutSide]);

  // ==================================================自定义树节点==============================================================
  const [treeEditStatusKey, setTreeEditStatusKey] = useState<string | null>();
  const [selectId, setSelectId] = useState<string | null>();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (flag: boolean) => {
    setOpen(flag);
  };
  // 一些操作项
  // const operationItems = (nodeVal: {
  //   orgId: string;
  //   orgName: string;
  // }): React.ReactNode => (
  //   <div>
  //     <p
  //     // 这里需要自己定义点击事件，打开弹窗进行编辑等等
  //     // onClick={() =>
  //     //   // openModal({
  //     //   //   title: '新增子组织',
  //     //   //   action: 'A',
  //     //   //   userType,
  //     //   //   record: {
  //     //   //     tenantId: formRef?.current?.getFieldValue('tenantId'),
  //     //   //     orgId: nodeVal?.orgId,
  //     //   //   },
  //     //   // })
  //     // }
  //     >
  //       新增{actions["add"]}
  //     </p>
  //   </div>
  // );
  // 树形控件的自定义render
  const renderTitle = (
    node: TreeDataNode & {
      orgName: string;
      orgId: string;
    }
    // isShowOperation: boolean //也可以放在外部props控制，是否展示最右边...操作的判断
  ): React.ReactNode => {
    // 是否展示最右边...操作的判断
    // const isHovered = node.orgId === treeEditStatusKey;
    // 文字超出一定宽度展示...
    // const regionWidth = getTextWidth(node.orgName, '14px');
    return (
      <div
        // className={styles.treeSpan}
        style={
          selectId && selectId === (node as any)[fieldNames.key]
            ? {
                color: "#1890ff",
                display: "flex",
                justifyContent: "space-between",
                // background: "yellow",
                // borderRadius: "5px",
                // padding: "0 6px",
              }
            : {}
        }
        onMouseEnter={() => {
          setTreeEditStatusKey((node as any)[fieldNames.key]);
        }}
        onClick={(e) => {
          setTreeEditStatusKey((node as any)[fieldNames.key]);
        }}
        onMouseLeave={() => {
          setTreeEditStatusKey(null);
        }}
      >
        <Tooltip title={(node as any)[fieldNames.title]}>
          <div
          // className={styles.treeSpan}
          // className="treeSpan"
          >
            {(node as any)[fieldNames.title]}
          </div>
        </Tooltip>
        {selectId === (node as any)[fieldNames.key] && (
          <>
            <div>
              <Space>
                <Dropdown
                  dropdownRender={operationItems}
                  trigger={["hover", "click"]}
                  autoFocus={true}
                  open={open}
                  onOpenChange={handleOpenChange}
                >
                  <a onClick={(e) => e.stopPropagation()}>
                    <Space style={{ marginLeft: "30px" }}>
                      <EllipsisOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </Space>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      ref={treeBoxDom}
      // className={styles.treeBox}
      className={classNames("treeBox", className)}
      style={{ height: heightFromOutSide }}
    >
      666
      <Spin spinning={loadingTree}>
        {isShowSearch && (
          <Search
            style={{ marginBottom: 8 }}
            placeholder={placeholder}
            onChange={onChange}
            allowClear
          />
        )}
        {filteredData.length ? (
          <AntdTree
            {...props}
            showLine={showLine}
            showIcon={showIcon}
            blockNode
            titleRender={(
              nodeData: TreeDataNode & {
                orgName: string;
                orgId: string;
              }
            ) => {
              return (
                titleRender(nodeData) ||
                renderTitle(
                  nodeData
                  // treeEditStatusKey === nodeData.orgId
                )
              );
            }}
            filterTreeNode={(
              node: TreeDataNode & {
                orgName: string;
                orgId: string;
              }
            ) => node?.orgId === treeEditStatusKey}
            treeData={filteredData}
            // height={treeHeight - treeHeightProp}
            onExpand={onExpand}
            onSelect={handelSelect}
            expandedKeys={expandedKeys}
            // 当前选中的值
            selectedKeys={selectedKeys}
            // 自动展开的keys值集合
            autoExpandParent={autoExpandParent}
            // 列表要翻译的字段集合
            fieldNames={fieldNames}
          />
        ) : (
          <Col span={24} style={{ width: "100%" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无数据"
            />
          </Col>
        )}
      </Spin>
    </div>
  );
};
export default memo(WwTree);
