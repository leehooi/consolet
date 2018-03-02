import { ConsoleColor } from '../../Interfaces'
export default class ConsoleInputElementAdapter {
    constructor(public element: HTMLInputElement,
        readKey: { (value: string): void },
        composing: { (composingText: string): void }) {
        document.addEventListener('click', (evt) => {
            // focus when not selecting
            if (document.getSelection().isCollapsed) {
                element.focus()
            }
        });

        element.addEventListener('input', (evt: InputEvent) => {
            if (this.isComposing(evt)) {
                composing(element.value);
            }
            else {
                for (let i = 0; i < element.value.length; i++) {
                    readKey(element.value[i]);
                }
                element.value = ''
            }
        });
        
        element.addEventListener('keydown', (evt: KeyboardEvent) => {
            if (evt.key.length > 1) {
                readKey(evt.key);
                evt.returnValue = false;
            }
        });

        element.className = `${ConsoleColor[ConsoleColor.White]}Bg`
    }

    private composingText = '';
    private isComposing(evt: InputEvent): boolean {
        let isComposing = evt.isComposing;
        if (isComposing) {
            // Fix chrome composing is always true issue.
            if (this.composingText == evt.srcElement.value) {
                isComposing = false;
                this.composingText = '';
            } else {
                this.composingText = evt.srcElement.value;
            }
        }
        return isComposing;
    }
}

interface InputEvent extends Event {
    isComposing: boolean,
    srcElement: HTMLInputElement
}
