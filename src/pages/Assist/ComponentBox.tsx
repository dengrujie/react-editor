import React, { FC, memo } from 'react';
import Components from '../../components';
import { useRecoilValue } from 'recoil';
import { componentStore } from '../../recoil/Component/atom';
import { Ilist } from '../Container/Body';

interface IComponentBox {
    uuid: string;
}

const componentStyleFilter = (item: Ilist) => {
    const props = JSON.parse(JSON.stringify(item.config));
    props.style.position = 'initial';
    return props;
}

const ComponentBox: FC<IComponentBox> = memo(({ uuid }) => {
    const componentStates = useRecoilValue(componentStore);
    const { list } = componentStates;
    const current = list.find((item) => item.config.uuid === uuid);
    const CurrentComponent = Components[current!.config.value];
    const CurrentProps = componentStyleFilter(current!);
    return (
        <CurrentComponent {...CurrentProps} />
    )
});

export default ComponentBox;
