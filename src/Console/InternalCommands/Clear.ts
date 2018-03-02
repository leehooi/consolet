import { Program } from '../../Interfaces'
import ConsoleSystem from '../ConsoleSystem'

export default class Clear implements Program {
    name: string = 'cls';

    description: string = 'Clears the screen.';
    
    main(system: ConsoleSystem, args: string[]): Promise<any> {
        system.output.container.innerHTML = '';
        return Promise.resolve();
    }
}