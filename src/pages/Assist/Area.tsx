import React, { FC } from 'react';
import './Group.less'

interface IAreaProps {
    width: number,
    height: number,
    top: number,
    left: number,
}

const Area: FC<IAreaProps> = ({width, height, top, left}) => {
    return (
        <div className='area' style={{ width, height, top, left }}></div>
    )
}

export default Area;