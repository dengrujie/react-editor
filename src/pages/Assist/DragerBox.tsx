import React, { FC } from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import Components, { CONFIG } from '../../components';
import { ComponentConfig } from '../Container/ComponentList';
import { uniqueId } from 'lodash-es';

interface IDragerBox {
    config: ComponentConfig
}

const DragerBox: FC<IDragerBox> = ({ children, config }) => {
    const CurrentComponent = Components[config.value];
    const CurrentProps = CONFIG[config.value];
    const [, drager, dragerPreview ] = useDrag(() => ({
        type: 'test',
        item: { id: 'btn', ...config , uuid: uniqueId('component_'), ...CurrentProps.props },
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
                {children}
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
