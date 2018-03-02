import { Program, System } from '../Interfaces'
export default class Title implements Program {
    name: string = 'title';

    description: string = 'Sets the window title.';

    private default: string = 'Console';
    constructor() {
        window.document.title = this.default;
    }

    main(system: System, args: string[]): Promise<any> {
        window.document.title = args[0] || this.default;
        return Promise.resolve();
    }
}