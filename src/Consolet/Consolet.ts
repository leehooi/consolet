import { ConsoletOptions, InputStream, OutputStream, Command, System, ConsoleColor } from './Interfaces'
import ConsoleOutputStream from './ConsoleOutputStream'
import ConsoleInputStream from './ConsoleInput/ConsoleInputStream'
import $ from './JQueryLite'
export default class Consolet implements System {
    private commands: { [key: string]: Command } = {};
    private prompt: string;
    input: ConsoleInputStream;
    output: ConsoleOutputStream;
    historyCommands: string[] = [];
    constructor(options: ConsoletOptions) {
        let consoleContainer = $(options.dom);
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

        // install programs
        if(options.commands){
            options.commands.forEach(p => this.install(p));
        }

        // set prompt
        this.prompt = options.prompt || '$ ';

        // show greeting
        if(options.greeting){
            if(typeof(options.greeting) === 'string'){
                this.output.writeLine(options.greeting);
            }
            else{
                options.greeting.main(this, []);
            }
        }

        this.waitCommand();
    }
    private install(command: Command) {
        this.commands[command.name.toUpperCase()] = command;
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
    private runCommand(command: string): Promise<any> {
        var segments = command.split(' ');
        var name = segments[0];
        return this.findCommand(name).then(
            program => {
                return program.main(this, segments.slice(1));
            }
        );
    }
    private findCommand(name: string): Promise<Command>{
        return new Promise((resolve, reject) =>{
            var program = this.commands[name.toUpperCase()];
            if (program) {
                resolve(program);
            }
            else {
                reject(`'${name}' is not recognized as a command.`);
            }
        });
    }
}