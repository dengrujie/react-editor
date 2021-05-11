import { atom } from 'recoil';

type ModeOption = {
    name: string,
    style: {
        [key: string]: string | number,
    }
}
interface IConfiger {
    animationModalState: boolean;
    actionModalState: boolean;
    modeOption: ModeOption,
}

export const allConfiger = atom<IConfiger>({
    key: 'allConfiger',
    default: {
        animationModalState: false,
        actionModalState: false,
        modeOption: {
            name: 'pc',
            style: {
                width: '100%',
                minHeight: '100vh',
            }
        }
    }
});