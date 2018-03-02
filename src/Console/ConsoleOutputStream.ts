import { OutputStream, ConsoleColor } from '../Interfaces'
import $ from '../JQueryLite'
export default class ConsoleOutputStream implements OutputStream {
    constructor(public container: Element) {
    }

    writeKey(key: string):void {
        if (key == 'Backspace') {
            if (this.container.childElementCount > 0) {
                this.container.removeChild(this.container.lastChild);
            }
        }
        else {
            let outputDom = document.createElement('pre');
            outputDom.textContent = key;
            this.container.appendChild(outputDom);
            this.container.scrollTo(0, this.container.scrollHeight);
        }
    }

    private linkReg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
    write(text: string, foreColor?: ConsoleColor, bgColor?: ConsoleColor): void {
        if (text.length == 0) {
            this.scrollToEnd();
            return;
        }

        let match = text.match(this.linkReg);
        if (!match || match.index < 0) {
            this.outputPlain(text, foreColor, bgColor);
            this.scrollToEnd();
            return;
        }

        this.outputPlain(text.substring(0, match.index), foreColor, bgColor);
        this.outputLink(match[0], match[0], foreColor, bgColor);

        this.write(text.substr(match.index + match[0].length), foreColor, bgColor);
    }

    private outputPlain(text: string, foreColor?: ConsoleColor, bgColor?: ConsoleColor) {
        if (!text || text.length == 0) {
            return;
        }
        if(foreColor != null){

            console.log(foreColor);
            console.log(ConsoleColor[foreColor]);
        }
        let outputDom = $('<pre>');
        outputDom.text(text);
        if(foreColor != null){
            outputDom.addClass(ConsoleColor[foreColor]);
        }
        if(bgColor != null){
            outputDom.addClass(ConsoleColor[bgColor] +'Bg');
        }
        this.container.appendChild(outputDom);
    }

    private outputLink(text: string, href: string, foreColor?: ConsoleColor, bgColor?: ConsoleColor) {
        let outputDom = document.createElement('a');
        outputDom.textContent = text;
        outputDom.href = href;
        this.setColor(outputDom, foreColor, bgColor);
        this.container.appendChild(outputDom);
    }

    writeLine(text?: string, foreColor?: ConsoleColor, bgColor?: ConsoleColor) {
        if (text) {
            this.write(text, foreColor, bgColor);
        }
        this.container.appendChild(document.createElement('br'));
        this.scrollToEnd();
    }

    private scrollToEnd(){
        this.container.parentElement.scrollTo(0, this.container.parentElement.scrollHeight);
    }

    private setColor(element: Element, foreColor?: ConsoleColor, bgColor?: ConsoleColor) {
        let classes = element.className.split(' ').filter(c => c != '');
        if(foreColor != null){
            classes.push(`${ConsoleColor[foreColor]}`)
        }
        if(bgColor != null){
            classes.push(`${ConsoleColor[bgColor]}Bg`)
        }
        element.className = classes.join(' ');
    }
}