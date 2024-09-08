import React from "react";
import { TreeProps } from "antd";
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
declare const _default: React.NamedExoticComponent<CustomTreeProps>;
export default _default;
