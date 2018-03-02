import { Program } from '../Interfaces'
import Consolet from '../Consolet'

export default class Clear implements Program {
    name: string = 'cls';

    description: string = 'Clears the screen.';
    
    main(system: Consolet, args: string[]): Promise<any> {
        system.output.container.empty();
        return Promise.resolve();
    }
}