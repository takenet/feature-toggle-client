import fs from "fs";

export class Logger {
    private filePath = "./src/output/logs.txt";
    private file: number;

    constructor () {
        this.file = fs.openSync(this.filePath, "a", );
    }

    async logInfoAsync(message: string) {
        await this.logAsync("info", message);
    }

    async logWarningAsync(message: string) {
        await this.logAsync("warning", message);
    }

    async logErrorAsync(message: string) {
        await this.logAsync("error", message);
    }

    private async logAsync(logLevel: string, message: string) {
        fs.appendFile(
            this.file,
            `(${new Date().toUTCString()}) ${logLevel.toUpperCase()} - ${message}\n`,
            () => {});
    }
}