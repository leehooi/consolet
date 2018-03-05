export interface ConsoletOptions{
    dom: Element,
    commands: Command[],
    prompt: string,
    greeting: string | Command
}

export interface InputStream {
    read(): Promise<string>;
    readLine(option?: ReadLineOption): Promise<string>;
}

export interface ReadLineOption {
    hint?: string[],
    history?: string[]
}

export interface OutputStream {
    write(text: string, foreColor?: ConsoleColor, bgColor?: ConsoleColor): void;
    writeLine(text?: string, foreColor?: ConsoleColor, bgColor?: ConsoleColor): void;
}

export interface Command {
    name:string;
    description: string;
    main(system: System, args: string[]): Promise<any>;
}

export interface System {
    input: InputStream;
    output: OutputStream;
}

export enum ConsoleColor {
    Black = 0,
    Blue,
    Green,
    Aqua,
    Red,
    Purple,
    Yellow,
    White,
    Gray,
    LightBlue,
    LightGreen,
    LightAqua,
    LightRed,
    LightPurple,
    LightYellow,
    BrightWhite
}