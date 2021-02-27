import fs from "fs";

export class Json {
    constructor(path) {
        this.path = path;
    }
    read = () => {
        return JSON.parse(fs.readFileSync(this.path, "utf8"));
    };
    write = (data) => {
        fs.writeFileSync(this.path, JSON.stringify(data));
    };
    init = (initJson) => {
        this.write(initJson);
    };
}
