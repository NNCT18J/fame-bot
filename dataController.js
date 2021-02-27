import { count } from "console";
import { Json } from "./basicTools.js";

const dataJson = new Json("./data.json");

export const updateGuilds = (client) => {
    const loginGuilds = [];
    const data = dataJson.read();
    Array.from(client.guilds.cache.keys()).forEach((el) => {
        const guild = {
            id: el,
            is_first: false,
        };
        if (!data.fames.some((el) => guild.id === el.id)) {
            console.log("is_first");
            guild.is_first = true;
            data.fames.push({
                id: guild.id,
                list: [],
            });
        }
        loginGuilds.push(guild);
    });
    dataJson.write(data);
    return loginGuilds;
};

export const initFames = (msg) => {
    // Jumpei#9630
    const permitAuthorIds = ["553952884191133697"];
    if (!permitAuthorIds.some((id) => msg.author.id === id)) {
        return;
    }
    const guildId = msg.guild.id;
    const guildName = msg.guild.name;
    const data = dataJson.read();
    data.fames.find((el) => guildId === el.id).list = [];
    dataJson.write(data);

    console.log(`[名言初期化]\n- サーバー: ${guildName} (${guildId})\n`);
};

export const addFames = (msg, content) => {
    if (!content.match(/^..*「.*」$/u)) {
        return false;
    }

    const guildId = msg.guild.id;
    const guildName = msg.guild.name;

    const data = dataJson.read();

    // 名言を追加
    content.split("」").forEach((el) => {
        if (el === "") {
            return;
        }
        const fame = el.split("「").reduce((result, current, index) => {
            result[["person", "speech"][index]] = current;
            return result;
        }, {});
        if (data.fames.find((el) => guildId === el.id).list.push(fame)) {
            console.log(
                `[名言追加(${countFames(msg) + 1}番目)]\n- 人　　　: ${
                    fame.person
                }\n- 名言　　: ${
                    fame.speech
                }\n- サーバー: ${guildName}(${guildId})\n`
            );
        }
    });
    dataJson.write(data);
    return true;
};

export const listFames = (msg, args = null) => {
    const num = countFames(msg);
    const guildId = msg.guild.id;
    const showRange = {
        min: num >= 20 ? num - 19 : 1,
        max: num,
    };

    if (args) {
        if (args[0] === "all") {
            showRange.min = 1;
        } else {
            const ProcessList = [
                {
                    argNum: 1,
                    callback: () => {
                        showRange.min =
                            num - args[0] <= num ? num - args[0] + 1 : 1;
                    },
                },
                {
                    argNum: 2,
                    callback: () => {
                        showRange.min = args[0] >= 1 ? args[0] : 1;
                        showRange.max = args[1] <= num ? args[1] : num;
                    },
                },
            ];
            const process = ProcessList.find((el) => args.length === el.argNum);
            if (process) {
                process.callback();
            }
        }
    }

    const fames = [];
    dataJson
        .read()
        .fames.find((el) => guildId === el.id)
        .list.forEach((fame, index) => {
            if (index + 1 < showRange.min || index + 1 > showRange.max) {
                return;
            }
            fames.push(`[${index + 1}] ${fame.person}「${fame.speech}」`);
        });
    if (num === 0) {
        msg.reply("\nこのサーバーに名言はまだありません");
    } else {
        msg.reply(
            `\nこのサーバーの名言一覧(${num})${
                showRange.min === 1 && showRange.max === num
                    ? ""
                    : `　※[${showRange.min}] ～ [${showRange.max}]`
            }\n${fames.join("\n")}`
        );
    }
};

export const countFames = (msg) => {
    const guildId = msg.guild.id;
    return dataJson.read().fames.find((el) => guildId === el.id).list.length;
};
