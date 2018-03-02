import { InputStream, OutputStream, Program, System, ConsoleColor } from './Interfaces'
import ConsoleOutputStream from './ConsoleOutputStream'
import ConsoleInputStream from './ConsoleInput/ConsoleInputStream'
import internalCommands from './InternalCommands'
import $ from './JQueryLite'
export default class Consolet implements System {
    programs: { [key: string]: Program } = {};
    input: ConsoleInputStream;
    output: ConsoleOutputStream;
    prompt: string = '$ ';
    historyCommands: string[] = [];
    constructor(domSelector: string) {
        let consoleContainer = $(domSelector);
        consoleContainer.addClass('wconsole');
        consoleContainer.addClass(ConsoleColor[ConsoleColor.White]);
        consoleContainer.addClass(ConsoleColor[ConsoleColor.Black]+'Bg');
        // setup output
        let outputContainer = $('<div>');
        consoleContainer.append(outputContainer);
        this.output = new ConsoleOutputStream(outputContainer);

        // setup input
        let inputContainer = $('<div>');
        consoleContainer.append(inputContainer);
        this.input = new ConsoleInputStream(inputContainer.element);
    }
    boot(programs: Program[]) {

        programs.forEach(p => this.install(p));
        
        internalCommands.forEach(p => this.install(p));

        this.output.writeLine('Type \'help\' to see all commands.');
        this.output.writeLine('Or visit blog http://blog.lihui.io.');

        this.waitCommand();
    }
    private install(program: Program) {
        this.programs[program.name.toUpperCase()] = program;
    }
    private waitCommand(): Promise<any> {
        this.output.write(this.prompt, ConsoleColor.Gray);
        return this.input.readLine({
            history: this.historyCommands
        }).then(text => {
            this.output.writeLine(text);
            return text.trim();
        }).then(command => {
            if (command != '') {
                this.historyCommands.push(command);
                return this.runCommand(command);
            }
        }).then(() => {
            return this.waitCommand();
        }, error => {
            if (error) {
                this.output.writeLine(error);
            }
            return this.waitCommand();
        });
    }
    runCommand(command: string): Promise<any> {
        var segments = command.split(' ');
        var name = segments[0];
        return this.findCommand(name).then(
            program => {
                return program.main(this, segments.slice(1));
            }
        );
    }
    findCommand(name: string): Promise<Program>{
        return new Promise((resolve, reject) =>{
            var program = this.programs[name.toUpperCase()];
            if (program) {
                resolve(program);
            }
            else {
                reject(`'${name}' is not recognized as a command.`);
            }
        });
    }
}