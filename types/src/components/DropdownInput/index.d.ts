import React from "react";
import type { InputProps } from "antd";
interface DropdownInputType extends InputProps {
    errorInfo?: string;
    initValue?: string;
}
declare const DropdownInput: React.ForwardRefExoticComponent<DropdownInputType & React.RefAttributes<unknown>>;
export default DropdownInput;
