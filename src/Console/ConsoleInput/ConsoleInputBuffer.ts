export default class ConsoleInputBuffer {
    private buffer: string[] = [];

    constructor(public element: Element){

    }

    composing(composingText: string) {
        this.element.textContent = this.toString() + composingText;
    }

    push(key: string) {
        this.buffer.push(key);
        this.element.textContent = this.toString();
    }

    pop() {
        this.buffer.splice(this.buffer.length - 1, 1);
        this.element.textContent = this.toString();
    }

    clear() {
        this.buffer = [];
        this.element.textContent = this.toString();
    }

    flush(): string{
        let str = this.toString();
        this.clear();
        return str;
    }

    toString(): string {
        return this.buffer.join('');
    }
}