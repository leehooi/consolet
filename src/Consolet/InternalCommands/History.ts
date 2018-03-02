import { Program } from '../Interfaces'
import Consolet from '../Consolet'

export default class Help implements Program {
    name: string = 'history';
    description: string = 'Displays the command history.';

    main(system: Consolet, args: string[]): Promise<any> {
        let display = system.historyCommands
            .filter(h => h.toLowerCase() != this.name.toLowerCase())
            .join('\n');
        system.output.writeLine(display);
        return Promise.resolve();
    }
}