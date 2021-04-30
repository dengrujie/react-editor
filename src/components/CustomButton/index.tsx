import React, { FC, memo } from 'react';
import { Button, ButtonProps } from "antd";

interface ICustomButton extends ButtonProps {
    text?: string
}

const CustomButton: FC<ICustomButton> = memo((props) => {
    return <Button {...props}>{props.text}</Button>
});

export default CustomButton;
