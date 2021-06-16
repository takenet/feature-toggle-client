import fs from "fs";

export class Logger {
    private filePath = "./src/output/logs.txt";
    private file: number;

    constructor () {
        this.file = fs.openSync(this.filePath, "a", );
    }

    async logAsync(logLevel: string, message: string) {
        if (logLevel === "info") {
            console.info(message);
        }

        if (logLevel === "warn") {
            console.warn(message)
        }

        if (logLevel === "error") {
            console.error(message);
        }

        fs.appendFile(
            this.file,
            `(${new Date().toUTCString()}) ${logLevel.toUpperCase()} - ${message}\n`,
            () => {});
    }
}