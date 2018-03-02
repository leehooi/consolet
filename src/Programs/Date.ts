import { Program, System } from '../Interfaces'
export default class Blog implements Program {
    name: string = 'date';

    description: string = 'Displays the date.';

    main(system: System, args: string[]): Promise<any> {
        system.output.writeLine(`The current date is: ${(new Date()).format('MM/dd/yyyy')}`)
        return Promise.resolve();
    }
}