import { InputStream, ReadLineOption } from '../../Interfaces'
import StateMachine from './ConsoleInputState'
import ConsoleInputBuffer from './ConsoleInputBuffer'
import ConsoleInputElementAdapter from './ConsoleInputElementAdapter'
export default class ConsoleInputStream extends StateMachine implements InputStream {
    private buffer: ConsoleInputBuffer;

    constructor(inputContainer: Element) {
        super();
        this.buffer = new ConsoleInputBuffer(document.createElement('pre'));
        inputContainer.appendChild(this.buffer.element);

        let inputAdapter = new ConsoleInputElementAdapter(
            document.createElement('input'),
            (inputKey) => {
                this.handleKeyEvent(inputKey);
            },
            (composingText) => {
                this.buffer.composing(composingText);
            }
        );
        inputContainer.appendChild(inputAdapter.element);

        this.defineState('idle', {});
        this.defineState('reading', {
            'All': (state, key) => {
                this.buffer.push(key);
                return state.transfer('idle');
            }
        });
        this.defineState('readingLine', {
            'Enter': (state, key) => {
                return state.transfer('idle');
            },
            'Backspace': (state, key) => {
                this.buffer.pop();
                state.historyCommands[state.historyIndex] = this.buffer.toString();
                return state;
            },
            'Tab': (state, key) => {
                return state;
            },
            'ArrowUp': (state, key) => {
                state.historyIndex++;
                if (state.historyIndex < state.historyCommands.length) {
                    var item = state.historyCommands[state.historyIndex];
                    this.buffer.clear();
                    for (const key of item) {
                        this.buffer.push(key);
                    }
                }
                else {
                    state.historyIndex = state.historyCommands.length - 1;
                }
                return state;
            },
            'ArrowDown': (state, key) => {
                state.historyIndex--;
                if (state.historyIndex < 0) {
                    state.historyIndex = 0;
                }
                else {
                    var item = state.historyCommands[state.historyIndex];
                    this.buffer.clear();
                    for (const key of item) {
                        this.buffer.push(key);
                    }
                }
                return state;
            },
            'All': (state, key) => {
                if (key.length > 1) {
                    return state;
                }
                this.buffer.push(key);
                state.historyCommands[state.historyIndex] = this.buffer.toString();
                return state;
            }
        });
    }

    read() {
        return this.transfer('reading').then((state) => {
            this.buffer.clear();
            return state.whenTransferTo('idle').then(() => {
                return this.buffer.flush();
            });
        });
    }

    readLine(option?: ReadLineOption) {
        return this.transfer('readingLine').then(state => {
            if (option) {
                state.historyCommands = (option.history || []).concat(['']);
                state.historyCommands.reverse();
            }
            else {
                state.historyCommands = [''];
            }
            state.historyIndex = 0;

            this.buffer.clear();
            return state.whenTransferTo('idle').then(() => {
                return this.buffer.flush();
            })
        });
    }
}