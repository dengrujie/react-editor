import { atom } from 'recoil';

interface IConfiger {
    animationModalState: boolean;
    actionModalState: boolean;
}

export const allConfiger = atom<IConfiger>({
    key: 'allConfiger',
    default: {
        animationModalState: false,
        actionModalState: false,
    }
});