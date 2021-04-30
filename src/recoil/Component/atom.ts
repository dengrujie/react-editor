import { atom } from 'recoil';
import { Ilist } from '../../pages/Container/Body';

interface IComponentStore {
    list: Ilist[],
    selectedComponent?: string,
    snapshotData: Ilist[][],
    snapshotIndex: number,
    snapshotSave: boolean,
    isDragging: boolean,
}

export const componentStore = atom<IComponentStore>({
    key: 'componentList',
    default: {
        list: [],
        selectedComponent: '',
        snapshotData: [],
        snapshotIndex: -1,
        snapshotSave: true,
        isDragging: false
    },
});
