import { Program } from '../../Interfaces'
import ConsoleSystem from '../ConsoleSystem'

export default class Help implements Program {
    name: string = 'help';
    description: string = 'Provides Help information for all commands.';

    main(system: ConsoleSystem, args: string[]): Promise<any> {
        let command = args[0];
        if (args.length > 0) {
            system.findCommand(command).then(
                program => {
                    system.output.writeLine(program.description);
                },
                error => {
                    system.output.writeLine(error);
                }
            )
        } else {
            let lines = [];
            for (let name in system.programs) {
                lines.push(`${name}\t${system.programs[name].description}`);
            }
            system.output.writeLine(`${lines.sort().join('\n')}\n\nFor more information on a specific command, type HELP command-name.\n`);
        }
        return Promise.resolve();
    }
}