import {
    initFames,
    addFames,
    listFames,
    countFames,
} from "./dataController.js";

export const fameCommand = (msg) => {
    const processList = [
        {
            firstArg: "add",
            callback: (args) => {
                const content = `${args[0]}「${args[1]}」`;
                if (addFames(msg, content)) {
                    msg.reply("名言に追加しました");
                }
            },
        },
        {
            firstArg: "list",
            callback: (args) => {
                listFames(msg, args);
            },
        },
        {
            firstArg: "num",
            callback: (args) => {
                msg.reply(`このサーバの名言は${countFames(msg)}個です`);
            },
        },
        {
            firstArg: "init",
            callback: (args) => {
                initFames(msg);
            },
        },
        {
            firstArg: "help",
            callback: (args) => {
                msg.reply(
                    "\nコマンド一覧\n〇通常のメッセージ\n- [人名]「[名言]」 :  [人名]「[名言]」のように名言を追加する\n〇fame コマンド (\\fame ...)\n- add [人名] [名言] : [人名]「[名言]」のように名言を追加する\n- help: コマンド一覧を見る\n- list : 名言を表示する(最大表示数は20)\n- list [表示数] : 最新から[表示数]の名言を表示する\n- list [下限] [上限] : [下限]から[上限]までの名言を表示する\n- list all : 全ての名言を表示する\n- num : 名言の個数を表示する\n"
                );
            },
        },
    ];
    const args = msg.content.substring(6).split(" ");
    const firstArg = args.shift();
    const process = processList.find((el) => firstArg === el.firstArg);
    if (process) {
        process.callback(args);
    }
};
