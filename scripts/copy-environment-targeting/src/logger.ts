import fs from "fs";

export class Logger {
    private filePath = "./src/output/logs.txt";
    private file: number;

    constructor () {
        this.file = fs.openSync(this.filePath, "a", );
    }

    async logAsync(logLevel: string, message: string) {
        fs.appendFile(
            this.file,
            `(${new Date().toUTCString()}) ${logLevel.toUpperCase()} - ${message}\n`,
            () => {});
    }
}