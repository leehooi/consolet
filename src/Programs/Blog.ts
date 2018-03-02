import { Program, System } from '../Interfaces'
export default class Blog implements Program {
    name: string = 'blog';

    description: string = 'Opens blog website.';

    main(system: System, args: string[]): Promise<any> {
        window.open('http://blog.lihui.io/', '_blank');
        system.output.writeLine('Blog website opened.')
        return Promise.resolve();
    }
}