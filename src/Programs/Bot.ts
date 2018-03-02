import { Program, System } from '../Interfaces';
import * as yql from '../Common/YQL'
import $ from '../JQueryLite'
export default class Bot implements Program {
    name: string = 'bot';

    description: string = 'A bot that you can talk with.';

    main(system: System, args: string[]): Promise<any> {
        return system.runCommand('title Bot')
            .then(() => {
                system.output.writeLine(`\nType 'bye' to exit chat.\n`);
                system.output.writeLine(`[BOT ${(new Date()).format('yyyy-MM-dd hh:mm:ss')}] :`);
                system.output.writeLine(`Hello`);
                return this.dialog(system)
            })
            .then(() => {
                return system.runCommand('title');
            });
    }

    dialog(system: System): Promise<any> {
        system.output.writeLine('[Me] :')
        return system.input.readLine()
            .then(text => {
                system.output.writeLine(text);
                if (text.toLowerCase() == 'bye') {
                    return Promise.reject<string>(null);
                }
                return text;
            }).then(question => {
                return this.ask(question)
                    .then(anwser => {
                        system.output.writeLine(`[BOT ${(new Date()).format('yyyy-MM-dd hh:mm:ss')}] :`);
                        system.output.writeLine(anwser.split('{br}').join('\n'));
                    });
            }).then(() => {
                return this.dialog(system);
            }, () => {
                //exit here
            });
    }

    private ask(question: string): Promise<string> {
        let query = {
            key: 'free',
            appid: 0,
            msg: question
        };
        return yql.query(`select * from json where url='http://api.qingyunke.com/api.php?${$.param(query)}'`).then(res => {
            return res.content;
        });
    }
}