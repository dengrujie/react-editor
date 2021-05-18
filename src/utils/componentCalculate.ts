import { WRAPPERLEFT, WRAPPERTOP, Ilist } from '../pages/Container/Body';

// 获取左侧空白，根据模式切换
export const calcLeftdistance = (width: number) => {
    if(!width) return 0;
    const halfWidth = document.body.scrollWidth / 2;
    return halfWidth - WRAPPERLEFT - (width / 2);
};

// 组件初始化时中心坐标
export const getInitializeComponentCenter = (component: Ilist, width: number) => {
    const leftDis = calcLeftdistance(width);
    const centerX = WRAPPERLEFT + Number(component?.config.style.left) + (Number(component?.config.style.width) / 2) + leftDis;
    const centerY = WRAPPERTOP + Number(component?.config.style.top) + (Number(component?.config.style.height) / 2);
    return {
        x: centerX,
        y: centerY,
    };
};

type Point = {
    x: number,
    y: number,
}

// 根据中心坐标和现坐标获取对称坐标
export const getSymmetry = (centerPoint: Point, currentPoint: Point) => {
    const x = centerPoint.x === currentPoint.x ? centerPoint.x : (centerPoint.x - (currentPoint.x - centerPoint.x));
    const y = centerPoint.y === currentPoint.y ? centerPoint.y : (centerPoint.y - (currentPoint.y - centerPoint.y));
    return {
        x,
        y,
    };
};

// 两点之间的中点坐标
export const getCenterPonit = (point1: Point, point2: Point) => {
    const x = point1.x === point2.x ? point1.x : (point1.x + ((point2.x - point1.x) / 2));
    const y = point1.y === point2.y ? point1.y : (point1.y + ((point2.y - point1.y) / 2));
    return {
        x,
        y,
    };
};

// 角度转弧度
// Math.PI = 180 度
export const angleToRadian = (angle: number) => {
    return angle * Math.PI / 180;
};

export const sin = (rotate: number) => {
    return Math.abs(Math.sin(angleToRadian(rotate)));
};
  
export const cos = (rotate: number) => {
    return Math.abs(Math.cos(angleToRadian(rotate)));
};

export const mod360 = (deg: number) => {
    return (deg + 360) % 360;
};

/**
 * 计算根据圆心旋转后的点的坐标
 * @param   {Object}  point  旋转前的点坐标
 * @param   {Object}  center 旋转中心
 * @param   {Number}  rotate 旋转的角度
 * @return  {Object}         旋转后的坐标
 * https://www.zhihu.com/question/67425734/answer/252724399 旋转矩阵公式
 */
 export const calculateRotatedPointCoordinate = (point: Point, center: Point, rotate: number) => {
    /**
     * 旋转公式：
     *  点a(x, y)
     *  旋转中心c(x, y)
     *  旋转后点n(x, y)
     *  旋转角度θ                tan ??
     * nx = cosθ * (ax - cx) - sinθ * (ay - cy) + cx
     * ny = sinθ * (ax - cx) + cosθ * (ay - cy) + cy
     */
    return {
        x: (point.x - center.x) * Math.cos(angleToRadian(rotate)) - (point.y - center.y) * Math.sin(angleToRadian(rotate)) + center.x,
        y: (point.x - center.x) * Math.sin(angleToRadian(rotate)) + (point.y - center.y) * Math.cos(angleToRadian(rotate)) + center.y,
    }
}

// 根据旋转角度，鼠标坐标，鼠标坐标对称点计算旋转角度为0时的拉伸值，然后返回对应style
export const calcScaleAndRotateComponentStyle = (currentComponent: Ilist, currentPoint: Point, symmetricPoint: Point, pointType: string) => {
    const newCenterPoint = getCenterPonit(currentPoint, symmetricPoint);
    const hasTop = /top/.test(pointType),
          hasBottom = /bottom/.test(pointType),
          hasLeft = /left/.test(pointType),
          hasRight = /right/.test(pointType);
    const newTopLeftPoint = calculateRotatedPointCoordinate(currentPoint, newCenterPoint, -currentComponent.rotate);
    const newBottomRightPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -currentComponent.rotate);
    let newWidth = Number(currentComponent.config.style.width), 
        newHeight = Number(currentComponent.config.style.height), 
        newLeft = Number(currentComponent.config.style.left), 
        newTop = Number(currentComponent.config.style.top);
    const xDis = Math.abs(newBottomRightPoint.x - newTopLeftPoint.x);
    const yDis = Math.abs(newBottomRightPoint.y - newTopLeftPoint.y);
    if (!(hasTop || hasBottom) && (hasLeft || hasRight)) { // 左，右两点拖拽计算
        newWidth = Math.round(xDis);
        newLeft = Math.min(newTopLeftPoint.x, newBottomRightPoint.x) - WRAPPERLEFT;
        newTop = Math.min(newTopLeftPoint.y, newBottomRightPoint.y) - WRAPPERTOP - (newHeight / 2);
    }
    if ((hasTop || hasBottom) && !(hasLeft || hasRight)) { // 上，下两点拖拽计算
        newHeight = Math.round(yDis);
        newLeft = Math.min(newTopLeftPoint.x, newBottomRightPoint.x) - WRAPPERLEFT - (newWidth / 2);
        newTop = Math.min(newTopLeftPoint.y, newBottomRightPoint.y) - WRAPPERTOP;
    }
    if ((hasTop || hasBottom) && (hasLeft || hasRight)) { // 左上，左下，右上，右下四点拖拽计算
        newWidth = Math.round(xDis);
        newLeft = Math.min(newTopLeftPoint.x, newBottomRightPoint.x) - WRAPPERLEFT;
        newHeight = Math.round(yDis);
        newTop = Math.min(newTopLeftPoint.y, newBottomRightPoint.y) - WRAPPERTOP;
    }
    if (newWidth > 0 && newHeight > 0) {
        return {
            width: newWidth,
            height: newHeight,
            left: newLeft,
            top: newTop,
        }
    }
    return currentComponent.config.style;
}

// 计算旋转后X长度
export const getWidthOfRotate = (width: number, height: number, rotate: number,) => {
    return (width * cos(rotate)) + (height * sin(rotate));
}

// 计算旋转后Y长度
export const getHeightOfRotate = (width: number, height: number, rotate: number,) => {
    return height * cos(rotate) + width * sin(rotate);
}

// 获取旋转后样式
export const getStyleOfRotate = (currentComponent: Ilist) => {
    const { style } = currentComponent.config;
    let newStyle = { ...style };
    if (currentComponent.rotate !== 0) {
        const newWidth = getWidthOfRotate(Number(style.width), Number(style.height), currentComponent.rotate);
        const diffX = (Number(style.width) - newWidth) / 2;
        newStyle.left = Number(newStyle.left) + diffX;
        newStyle.width = newWidth;
        const newHeight= getHeightOfRotate(Number(style.width), Number(style.height), currentComponent.rotate);
        const diffY = (Number(style.height) - newHeight) / 2;
        newStyle.top = Number(newStyle.top) + diffY;
        newStyle.height = newHeight;
    }
    return newStyle
}

