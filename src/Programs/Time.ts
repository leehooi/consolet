import { Program, System } from '../Interfaces'
export default class Blog implements Program {
    name: string = 'time';

    description: string = 'Displays the system time.';

    main(system: System, args: string[]): Promise<any> {
        system.output.writeLine(`The current time is: ${(new Date()).format('hh:mm:ss')}`)
        return Promise.resolve();
    }
}