import React, { FC } from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import Components, { CONFIG } from '../../components';
import { IConfig } from '../Container/Body';
import { uniqueId } from 'lodash-es';

interface IDragerBox {
    config: IConfig;
}

const DragerBox: FC<IDragerBox> = (props) => {
    const CurrentComponent = Components[props.config.value];
    const CurrentProps = CONFIG[props.config.value];
    const [, drager, dragerPreview ] = useDrag(() => ({
        type: 'test',
        item: { id: 'btn', ...props.config, uuid: uniqueId('component_'), ...CurrentProps.props },
        collect: (monitor: DragSourceMonitor) => ({
            opacity: monitor.isDragging() ? 0.4 : 1,
            isDragging: monitor.isDragging()
        }),
        end: (item) => {
            item.uuid = uniqueId('component_');
        },
    }))
    return (
        <>
            <div ref={drager}>
                {props.children}
            </div>
            <div style={{ position: 'fixed', zIndex: -1 }}>
                <div ref={dragerPreview} style={{ display: 'flex', position: 'relative' }}>
                    <CurrentComponent {...CurrentProps.props} />
                </div>
            </div>
        </>

    )
}

export default DragerBox;
