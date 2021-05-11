import { Animation } from '../pages/Assist/AnimationList';

export const runAnimation = async (element: HTMLElement, animations: Animation[] = []) => {
    const play = (animation: Animation) => new Promise<void>((resolve) => {
        element.classList.add(animation.value, 'animate__animated');
        const removeAnimation = () => {
            element.removeEventListener('animationend', removeAnimation);
            element.removeEventListener('animationcancel', removeAnimation);
            element.classList.remove(animation.value, 'animate__animated');
            resolve();
        }
        element.addEventListener('animationend', removeAnimation);
        element.addEventListener('animationcancel', removeAnimation);
    });

    for(let i = 0, len = animations.length; i < len; i++) {
        await play(animations[i])
    };
};