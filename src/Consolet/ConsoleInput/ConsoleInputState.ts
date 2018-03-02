
 export default class StateMachine {
    private state: State;
    private keyEventHandlers: { [key: string]: { [key: string]: (state: State, key: string) => State } } = {};

    constructor(){
        this.state = State.Init();
    }

    protected defineState<K extends keyof StateMap>(id: K, handlers: { [key: string]: (state: StateMap[K], key: string) => State }) {
        this.keyEventHandlers[id] = handlers;
    }

    protected handleKeyEvent(key: string){
        let entry = this.keyEventHandlers[this.state.id];
        if (!entry) {
            return;
        }
        let handler = entry[key];
        if (!handler) {
            handler = entry['All'];
        }
        if (!handler) {
            return;
        }
        this.state = handler(this.state, key);
    }

    protected transfer<K extends keyof StateMap>(id: K): Promise< StateMap[K]> {
        return new Promise<StateMap[K]>((resolve, reject) => {
            this.state = this.state.transfer(id);
            resolve(this.state);
        });
    }
}
class State {
    private transferPromiseReolvers: {[key:string]:{() : void}} = {};
    constructor(public id: string) {
    }
    whenTransferTo<K extends keyof StateMap>(id: K): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.transferPromiseReolvers[id] = resolve;
        });
    }
    transfer<K extends keyof StateMap>(id: K): StateMap[K] {
        let resolve = this.transferPromiseReolvers[id];
        if (resolve) {
            resolve();
        }
        return State.Create(id);
    }
    private static Create<K extends keyof StateMap>(id: K): StateMap[K] {
        return new State(id);
    }

    static Init(){
        return State.Create('idle');
    }
}

class ReadingLineState extends State {
    historyCommands: string[];
    historyIndex: number;
}
interface StateMap {
    "idle": State;
    "reading": State;
    "readingLine": ReadingLineState;
}
