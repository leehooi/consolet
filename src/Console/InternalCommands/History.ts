import { Program } from '../../Interfaces'
import ConsoleSystem from '../ConsoleSystem'

export default class Help implements Program {
    name: string = 'history';
    description: string = 'Displays the command history.';

    main(system: ConsoleSystem, args: string[]): Promise<any> {
        let display = system.historyCommands
            .filter(h => h.toLowerCase() != this.name.toLowerCase())
            .join('\n');
        system.output.writeLine(display);
        return Promise.resolve();
    }
}