import * as initSqlJs from "sql.js";
import fs from "fs";

export default {
    async sqliteDemo() {
        const filebuffer = fs.readFileSync("D:/workspace/github/demo/db/client3.sqlite");
        await initSqlJs().then(SQL => {
            this.db = new SQL.Database(filebuffer);
        });
        const arr = [];
        if (this.db) {
            const stmt = this.db.prepare("select * from TD_S_CONFIG;");
            while (stmt.step()) arr.push(stmt.getAsObject());
            stmt.free();
        }
        console.log(arr)
        return arr;
    }
}
