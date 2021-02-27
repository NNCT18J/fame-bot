import Discord from "discord.js";

import { token } from "./env.js";
import { updateGuilds, addFames } from "./dataController.js";
import { fameCommand } from "./command.js";

const client = new Discord.Client();

client.on("ready", () => {
    console.log(`${client.user.username}としてログインしています\n`);

    const loginGuilds = updateGuilds(client);

    console.log("[サーバー一覧]");
    loginGuilds.map((guild) =>
        console.log(`- ${guild.id}${guild.is_first ? "<初>" : ""}`)
    );
    console.log();
});

client.on("message", (msg) => {
    if (msg.author.id === client.user.id) {
        return;
    }

    if (msg.content.substring(0, 5) === "\\fame") {
        fameCommand(msg);
    } else {
        if (addFames(msg, msg.content)) {
            msg.reply("名言に追加しました");
        }
    }
});

client.login(token);
