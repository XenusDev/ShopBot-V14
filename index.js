const express = require("express");
const app = express();

app.listen(() => console.log("Server started"));

app.get("/", (req, res) => {
  res.send("POWER")
})
//[0]
app.use('/ping', (req, res) => {
  res.send(new Date());
});
const Discord = require("discord.js")
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const db = require("pro.db");

// import setPrice from "./commands/setPrice"
let owners = '1090340216352555071'//ايدي الي هيتحول له الكريديت
let owner;
const
  updateAdmins = () => {
    owner = db.get("admins")
    owners = '1090340216352555071'//ايدي الي هيتحول له الكريديت
    owner.unshift('1090340216352555071')//اي دي حقك
  }
updateAdmins()
//let sv = '282859044593598464' // اذا تريد تحط ايدي سيرفر يخرج منه البوت
let prefix = db.get("prefix") || "*"; ///بيرفكس البوت
let embColor = "RED"
client.on('ready', () => {
    console.log(`🤠 : ${client.user.username}`);
    client.user.setStatus('idle');
    const status = [`XenusDev`,`${prefix}help`, `${client.guilds.cache.reduce((total, guild) => total + guild.memberCount, 0)} users`];
    setInterval(() => {
        client.user.setActivity(status[Math.floor(Math.random() * status.length)], { type: 'STREAMING', url: 'https://www.twitch.tv/arftnl' });
    }, 3000);
});


const logToCh = (channel, message, payload, account, verb) => {
  if (db.has(channel)) {
    ch = db.get(channel)
    client.channels.cache
      .get(ch)

      .send({
        embeds: [new Discord.MessageEmbed()
          .setAuthor(
            message.author.username,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setTimestamp()
          .setDescription(`${message.author.tag} ${verb} ${account} :\n \`\`\`${payload.join("\n")}\`\`\``)

          .setColor(embColor)
        ]
      })
  }
}






client.on("message", async message => {
  let prefixx = "s";
  const args = message.content
    .slice(prefixx.length)
    .trim()
    .split(/ +/);
  const command = args.shift().toLowerCase();
  if (message.content.startsWith(prefix + "etprefix")) {
    if (!owner.includes(message.author.id)) return;
    if (!args[0])
      return message.channel.send(
        db.get("prefix") || `> **بادئة البوت هي : \`${prefix}\`**`
      );
    db.set("prefix", args[0]);
    message.channel.send(
      `> **تم تغيير البادئة الجديدة الى : \`${db.get("prefix")}\`**`
    );
  }
});

let cooldown = false;
client.on("message", async message => {
  try {
    if (db.get("blacklist").includes(message.author.id)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);

    const command = args.shift().toLowerCase();
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    if (command === "status") {
      if (!owner.includes(message.author.id)) return;
      if (!args[0]) return message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor(
              message.author.username,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .addField(
              `> Error :`,
              `Usage : ${prefix}status \`TYPE\`\n\n \`\`\`TYPE = [ open : to open the shop \n close : to close the shop ]\`\`\``
            )

            .setColor(embColor)
            .setTimestamp()
            .setTitle("Status Command")
            .setColor(embColor)]
      }
      );
      if (args[0] === "open") {
        message.channel.send("> ** تم افتتاح المتجر بنجاح ✅**");
        db.set("status", args[0]);
      }
      if (args[0] === "close") {
        db.delete("status");
        message.channel.send("> ** تم إغلاق المتجر بنجاح ✅**");
      }
    }


    if (command.startsWith("setprice-")) {

      const account = command.split("-")[1]

      if (!owner.includes(message.author.id)) return message.channel.send("**ليس لديك إذن ❌**");
      if (message.channel.type === "dm") return;
      let tax = Math.floor(args[0] * (20 / 19) + 1);
      if (!tax)
        return message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .addField(
                `> Error :`,
                `Usage : ${prefix}setprice-${account} \`PRICE\`\n\n \`\`\`PRICE = [ Enter account price ]\`\`\``
              )

              .setColor(embColor)
              .setTimestamp()
              .setTitle(`Setprice ${account} Command`)]
        }
        ).setColor(embColor);

      let data = db.get("accounts")
      let thisAcc = data.find(el => el.name === account)

      if (!thisAcc) return message.channel.send("**لا يوجد مثل هذا الحساب ❌**")
      data[data.indexOf(thisAcc)].price = Number(args[0])
      data[data.indexOf(thisAcc)].tax = tax

      db.set("accounts", data)





      return message.channel.send(`> ** تم تحديد سعر ${account} بنجاح ✅**`);
    }


    if (command.startsWith("add-")) {

      const account = command.split("-")[1]

      if (!owner.includes(message.author.id)) return;
      if (!args[0])
        return message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .addField(
                `> Error :`,
                `Usage : ${prefix}add-${account} \`ACCOUNT\`\n\n \`\`\`ACCOUNT = [ EMAIL:PASSWORD ]\`\`\``
              )

              .setColor(embColor)
              .setTimestamp()
              .setTitle(`Add ${account} Accounts Command`)]
        }
        );
      if (!message.content.includes(":"))
        return message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .addField(
                `> Error :`,
                `Usage : ${prefix}add-${account} \`ACCOUNT\`\n\n \`\`\`ACCOUNT = [ EMAIL:PASSWORD ]\`\`\``
              )

              .setColor(embColor)
              .setTimestamp()
              .setTitle(`Add ${account} Accounts Command`)]
        }
        );

      let Data = db.get("accounts")
      let thisAcc = Data.find(el => el.name === account)

      if (!thisAcc) {
        let m = message.content.split(" ").slice(1).join(" ").split("\n")
        Data.push({ name: account, price: 0, tax: 0, emails: m })
        db.set("accounts", Data)
        message.delete()
        return message.channel.send(`> ** لقد تمت اضافة حساب ${account} بنجاح ✅**`);
      }
      else {
        let m = message.content.split(" ").slice(1).join(" ").split("\n")

        currentData = Data[Data.indexOf(thisAcc)].emails
        Data[Data.indexOf(thisAcc)].emails = [...currentData, ...m]
        db.set("accounts", Data)
        logToCh("add", message, m, account, "added")
        message.delete()
        return message.channel.send(`>**  لقد تمت اضافة حساب ${account} بنجاح ✅**`);
      }

    }






    if (command.startsWith("delete-")) {
      const account = command.split("-")[1]
      if (!owner.includes(message.author.id)) return;
      let data = db.get("accounts")

      let newData = data.filter(el => el.name !== account)

      db.set("accounts", newData);
      message.channel.send(`> ** ${account} تم حذف الفئة بنجاح ✅**`);
    }






    if (command.startsWith("give-")) {
      if (!owner.includes(message.author.id)) return message.channel.send("**يمكن للمسؤولين فقط استخدام Give **")
      let user =
        message.mentions.users.first() ||
        message.guild.members.cache.find(u => u.id === args[0]);

      const numOfAcc = args[1] || 1
      const account = command.split("-")[1]
      const data = db.get("accounts")
      let accInDb = data.find(el => el.name === account)
      if (!accInDb) { return message.channel.send("**This item does not exist ❌**") }
      if (!user)
        return message.channel.send("> **Please select the user correctly **");
      if (accInDb.emails.length < numOfAcc) { return message.channel.send("**انتهت الكمية**") }

      const sentMail = accInDb.emails.splice(0, numOfAcc)
      logAcc = sentMail;
      data[data.indexOf(accInDb)].emails = accInDb.emails;
      db.set("accounts", data)
      user.send({
        embeds: [new Discord.MessageEmbed()
          .setAuthor(
            message.author.username,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setTimestamp()
          .setTitle(`**Hi ${user.username} , ${client.user.username} gave you ${numOfAcc} ${account} account${numOfAcc > 1 ? "s" : ""}:**`)
          .setDescription(
            `
          **Your account${numOfAcc > 1 ? "s" : ""}:**
\`\`\`${sentMail.join("\n")}\`\`\`
`)

          .setColor(embColor)
        ]
      })
      message.channel.send(`<@${user.id}> **تحقق من الخاص ✅**`)

      if (db.has("ch")) {
        ch = db.get("ch")
        client.channels.cache
          .get(ch)
          .send({
            embeds: [new Discord.MessageEmbed().setTitle(`${message.author.tag} GAave ${numOfAcc} ${account} Account For ${user.username}`)
              .setDescription(`\`\`\`${logAcc.join("\n")}\`\`\``)
              .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTimestamp()

              .setColor(embColor)

            ]
          });
      }

    }

    if (command === "buy") {
      const buyId = db.get("buy")
      if (![message.channel.id, "all"].includes(buyId)) {
        message.reply("**هذه ليست الغرفة المناسبة للشراء ❌**");
        return;
      }
      if (cooldown === true) return message.reply("**انتظر 1 دقيقة قبل الشراء مرة أخرى** " + "<@" + message.author.id + ">");
      const account = args[0], numOfAcc = args[1] || 1

      const data = db.get("accounts")
      let accInDb = data.find(el => el.name === account)
      if (!accInDb) { return message.channel.send("**هذا العنصر غير موجود ❌**") }
      let { price, tax, emails } = accInDb;
      let probotid = db.get("probot") || "282859044593598464";
      let role = db.get("role");
      if (message.channel.type === "dm") return;
      if (!db.has("status")) return message.channel.send("The store is closed.");

      if (emails.length < numOfAcc) { return message.channel.send("**انتهت الكمية**") }
      let logAcc;
      let buys = new Discord.MessageEmbed()
        .setAuthor(
          message.author.username,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .addField(`**شراء حساب ${account} :**`
          ,
          `
            
            > **-عدد الحسابات :** \`${numOfAcc}\`
            > **-المبلغ الكلي :** \`${tax * numOfAcc}\`  
            > **لديك فقط 50 ثانية للتحويل**
            > **الرجاء التأكد من انك فاتح الخاص** ⚠️

            **للشراء الرجاء نسخ ولصق الامر الموجود في الاسفل => :**
          \`\`\`
#credit <@${owners}> ${numOfAcc * tax}
           \`\`\`
            
     
            
`   )


        .setColor(embColor);
      message.channel.send({ embeds: [buys] }).then(msg => {


        const filter = ({ content, author: { id } }) => {

          return content.startsWith(
            `**:moneybag: | ${message.author.username}, has transferred `
          ) &&
            content.includes(`${owners}`) &&
            id === probotid &&
            (Number(content.slice(content.lastIndexOf("`") - String(tax * numOfAcc).length, content.lastIndexOf("`"))) >= price * numOfAcc)
        }


        message.channel.awaitMessages({
          filter,
          max: 1,
          time: 50_000,
          errors: ['time']
        }).then(msg => {
          const sentMail = emails.splice(0, numOfAcc)
          logAcc = sentMail;
          data[data.indexOf(accInDb)].emails = emails;
          db.set("accounts", data)

          message.author.send({
            embeds: [new Discord.MessageEmbed()
              .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .setTimestamp()
              .setDescription(`**أهلا ${message.author.tag} , لقد اشتريت حساب ${numOfAcc} ${account} ${numOfAcc > 1 ? "s" : ""}:**
> **السعر الإجمالي : \`${tax * numOfAcc}\`**
          **حسابك${numOfAcc > 1 ? "s" : ""}:**

         \`\`\` ${sentMail.join("\n")}\`\`\`
`)

              .setColor(embColor)
            ]
          })

          //message.reply("**Check your Dm's ✅**")
          message.reply

          let embed = new Discord.MessageEmbed()
            .setTitle("🟢 تم ارسال المنتج في الخاص")
            .setColor('RED')
          message.channel.send({ embeds: [embed] })

          msg.delete()

        })

          .then(() => {
            cooldown = false
            if (db.has("ch")) {
              ch = db.get("ch")
              if (ch) {
                client.channels.cache
                  .get(ch)

                //mm

                // .send(`${message.author.tag} bought a ${account} account \n Account Informations : \`\`\`${logAcc.join("\n")}\`\`\``);
              }
            }
          })

          .catch(err => {
            cooldown = false
            console.log(err)
            msg.delete()
            message.reply("**لقد تم إالغاء عملية الدفع , انتهى الوقت المحدد للدفع ❌ **")
          })

          /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          .then(() => {
            cooldown = false
            if (db.has("notif")) {
              notif = db.get("notif")
              if (notif) {
                client.channels.cache
                  .get(notif)

                //4
                //1     
                // .send(`${message.author.tag} bought a ${account} account \n Account Informations : \`\`\`${logAcc.join("\n")}\`\`\``);
              }
            }
          })

          .catch(err => {
            cooldown = false
            console.log(err)
            msg.delete()
            message.reply("**لقد تم إالغاء عملية الدفع , انتهى الوقت المحدد للدفع ❌ **")
          })



      })


      !cooldown && (cooldown = true)

      cooldown && setTimeout(() => {
        // Removes the user from the set after a minute
        cooldown = false


      }, 60000);
      return
    }
    if (command === "setlog") { //setlog
      if (message.channel.type === "dm") return;
      if (!owner.includes(message.author.id))
        return;
      let ch =
        message.guild.channels.cache.find(ch =>
          ch.name.toLocaleLowerCase().includes(args[0])
        ) || message.guild.channels.cache.find(ch => ch.id === args[0]);
      if (!ch) return message.channel.send("> **يرجى اختيار الغرفة بشكل صحيح **");
      db.set("ch", ch.id);
      message.channel.send("> ** تم اختيار غرفة السجل بنجاح ✅**");
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (command === "setnotif") {
      if (message.channel.type === "dm") return;
      if (!owner.includes(message.author.id))
        return;
      let notif =
        message.guild.channels.cache.find(notif =>
          notif.name.toLocaleLowerCase().includes(args[0])
        ) || message.guild.channels.cache.find(notif => notif.id === args[0]);
      if (!notif) return message.channel.send("> **يرجى اختيار الغرفة بشكل صحيح **");
      db.set("notif", notif.id);
      message.channel.send("> ** تم اختيار غرفة الإشعارات بنجاح ✅**");
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (command === "reslog") {
      if (message.channel.type === "dm") return;
      if (!owner.includes(message.author.id))
        return;
      let ch =
        message.guild.channels.cache.find(ch =>
          ch.name.toLocaleLowerCase().includes(args[0])
        ) || message.guild.channels.cache.find(ch => ch.id === args[0]);
      if (!ch) return message.channel.send("> **يرجى اختيار الغرفة بشكل صحيح **");
      db.set("add", ch.id);
      message.channel.send("> ** تم تحديد إضافة غرفة سجل بنجاح ✅**");
    }
    if (command === "user-add") {
      if (message.channel.type === "dm") return;
      if (owner[0] != message.author.id) return;
      let user =
        message.mentions.users.first() ||
        message.guild.members.cache.find(u => u.id === args[0]);

      if (!user)
        return message.channel.send("> **الرجاء تحديد المستخدم بشكل صحيح **");
      db.push("admins", user.id);
      updateAdmins()
      message.channel.send(`> **${user.tag} لقد تم إضافته كمسؤول ✅**`);
    }
    if (command === "ping") {
      message.channel.send(
        `🏓Latency is ${Date.now() -
        message.createdTimestamp}ms. API Latency is ${Math.round(
          client.ws.ping
        )}ms`
      );
    }
    if (command === "user-remove") {
      if (message.channel.type === "dm") return;
      if (owner[0] != message.author.id) return;
      let user =
        message.mentions.users.first() ||
        message.guild.members.cache.find(u => u.id === args[0]);

      if (!user)
        return message.channel.send("> **الرجاء تحديد المستخدم بشكل صحيح **");
      const filtered = db.get("admins").filter(ad => ad != user.id)
      db.set("admins", filtered);
      updateAdmins()
      message.channel.send(
        `> ** ${user.tag} تمت إزالته من قائمة المسؤولين ✅**`
      );
    }
    if (command === "setprobot") {
      if (!owner.includes(message.author.id)) return;
      if (message.channel.type === "dm") return;
      if (!args[0])
        return message.channel.send("> **يرجى تحديد معرف Probot بشكل صحيح **");
      db.set("probot", args[0]);
      message.channel.send("> **✅ تم التعرف على Probot بنجاح!**");
    }
    if (command === "setcustomerrole") {
      let custommer =
        message.guild.roles.cache.find(r =>
          r.name.toLocaleLowerCase().includes(args[0])
        ) || message.guild.roles.cache.find(r => r.id === args[0]);
      if (!custommer)
        return message.channel.send("> **الرجاء تحديد رتبة العميل بشكل صحيح **");
      db.set("role", custommer.id);
      message.channel.send("> ** تم اختيار رتبة العميل بنجاح ✅**");
    }
    if (command === "stock") {
      if (message.channel.type === "dm") return;

      const accounts = db.get("accounts")


      let embed = new Discord.MessageEmbed()

        .setAuthor(
          message.author.username,
          message.author.displayAvatarURL({ dynamic: true })
        )

        .setTimestamp()
        .setColor("RED");
      for (let { name, price, tax, emails } of accounts) {


        embed.addField(
          `${name || "N/A"}`,
          `
            > **Price :** ${price}
            > **Stock :** ${emails.length}
            > **To Buy Write:** \`${prefix}buy ${name}\` 
            `
        )
      }




      message.channel.send({ embeds: [embed] }
      );
    }


    if (command === "setbuy") {
      if (message.channel.type === "dm") return;
      if (!owner.includes(message.author.id))
        return;
      let ch =
        message.guild.channels.cache.find(ch =>
          ch.name.toLocaleLowerCase().includes(args[0])
        )?.id || message.guild.channels.cache.find(ch => ch.id === args[0])?.id;
      args[0] === "all" && (ch = "all")
      if (!ch) return message.channel.send("> **يرجى اختيار الغرفة بشكل صحيح **");
      db.set("buy", ch);
      message.channel.send("> ** تم اختيار غرفة الشراء بنجاح ✅**");

    }
    if (command.startsWith("remove-")) {
      const acc = command.split("-")[1]

      if (!owner.includes(message.author.id))
        return;
      if (message.channel.type === "dm") return;
      if (!args[0])
        return message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setAuthor(
                message.author.username,
                message.author.displayAvatarURL({ dynamic: true })
              )
              .addField(
                `> Error :`,
                `Usage : ${prefix}remove-${acc} \`ACCOUNT\`\n\n \`\`\`ACCOUNT = [ EMAIL:PASSWORD ]\`\`\``
              )

              .setColor(embColor)
              .setTimestamp()
              .setTitle(`Remove ${acc} Account Command`)]
        }
        );
      const data = db.get("accounts");
      const account = data.find(el => el.name === acc)
      if (!account)
        return message.channel.send(`> **:x: لا توجد حسابات في المخزون! **`);
      if (args[0] === "all") {
        data[data.indexOf(account)].emails.length = 0
        db.set("accounts", data)

        return message.channel.send(`> ** ${acc} تمت إزالة الحسابات بنجاح ✅**`);

      }
      else if (!message.content.includes(":"))
        return message.channel.send({
          embeds: [
            new Discord.MessageEmbed()
              .setColor(embColor)
              .setDescription(`> usage : ${prefix}remove${acc} [adress:email]`)]
        }
        );
      const filtered = account.emails.filter(accs => accs !== args[0]);
      data[data.indexOf(account)].emails = filtered
      db.set("accounts", data)
      message.channel.send(`> **الحساب \`${args[0]}\`  تمت إزالته بنجاح ✅**`);
    }

    if (command.startsWith("display-")) {
      const account = command.split("-")[1]

      if (message.channel.type === "dm") return;

      if (!owner.includes(message.author.id)) return;
      const accounts = db.get("accounts")?.find(el => el?.name === account)?.emails;
      const text =
        accounts && accounts[0]
          ? accounts.join("\n")
          : `  ${account} لا توجد حسابات في مخزونك ❌`;
      message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor(
              message.author.username,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setTitle(`All ${account} accounts :`)
            .setDescription(`\`\`\`${text}\`\`\``)
            .setTimestamp().setColor(embColor)
        ]
      }
      );
    }
    if (command.startsWith("setcolor")) {
      if (!owner.includes(message.author.id)) return message.channel.send("**you are not an admin**")
      embColor = args[0].toUpperCase();
      message.channel.send(`**تم ضبط لون كل الرسائل على ${args[0].toUpperCase()}**`)
    }

    if (command === "restart") {
      if (!owner.includes(message.author.id)) return;
      message.channel
        .send(`إعادة التشغيل قيد التقدم...`)
        .then(() => client.destroy())
        .then(() => {
          client.login("");
          message.channel.send("> ** تمت إعادة تشغيل الروبوت بنجاح ✅**");
        });
    }
    if (command === "help") {
      if (message.channel.type === "dm") return;
      const embed =
        new Discord.MessageEmbed()
          .setAuthor(
            message.author.username,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setTitle(`About ${client.user.username}`)
          .addField(`General`, `\`stock => to see availabe stuff\`\n\`buy [type] [number] => to buy anything\`\n\`ping => to see the latency\` `)
          .setDescription(
            `Developer : <@1090340216352555071>`
          )

          .setColor(embColor)
      if (owner.includes(message.author.id)) {
        embed.addField(
          `Administrator`,


          `\n\n**👤 User**\n\n\`user-add [user] => add an administrator\`\n\`user-remove [user] => remove an administrator\`\n\`blacklist [user] => add someone to blacklist\`\n\`unblacklist => remove someone from blacklist\`\n\`resetblacklist => clear blacklist\`\n
\**🛒 Shop\**\n
\`add-[type] [account] => add a new account\`\n\`remove-[type] [account] => remove a specific account\`\n\`remove-[type] => remove all accounts\`\n\`setprice-[type] => change price\`\n\`delete-[type] => delete a full type\`\n\`give-[type] [user] [number] => for replacement\`\n\`setbuy [all] or [channel_id] => select buy channel\`\n
**🛠️ Settings**\n
\`display-[type] => display all accounts\`\n\`setlog => set a log room\`\n\`status [open] or [close]\`\n\`setcolor [color] => to change embeds color\``
        )

      }
      message.channel.send({ embeds: [embed] });
    }
  }
  catch (err) {
    console.log(err.message)
  }
});






client.on("message", async message => {
  try {
    if (db.get("blacklist").includes(message.author.id)) return;
    let prefix = await db.get("prefix");
    if (message.content.startsWith(prefix + "setname")) {
      let args = message.content.split(" ");
      let botnameee = args.slice(1).join(" ");
      if (!owner.includes(message.author.id))
        return message.channel.send(`** ❌ يمكن للمالكين فقط استخدام هذا الأمر **`);
      if (!botnameee)
        return message.channel.send(
          `** ❌ من فضلك زودني باسم للبوت !**`
        );
      client.user.setUsername(`${botnameee}`);
      message.channel.send(`جاري تغيير اسم الروبوت ...`).then(me => {
        me.edit(` تم !`);
      });
    }
    if (message.content.startsWith(prefix + "setavatar")) {
      let args = message.content.split(" ");
      let botnameee = args.slice(1).join(" ");
      if (!owner.includes(message.author.id))
        return message.channel.send(`** ❌ يمكن للمالكين فقط استخدام هذا الأمر **`);
      if (!botnameee)
        return message.channel.send(
          `** ❌ من فضلك زودني بالصورة الرمزية للبوت !**`
        );
      client.user.setAvatar(`${botnameee}`);
      message.channel.send(`جاري تغيير الصورة الرمزية للروبوت ...`).then(me => {
        me.edit(` Done !`);
      });
    }
  }
  catch (err) {
    console.log(err.message)

  }
});





client.on("message", async message => {
  try {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/);
    const command = args.shift().toLowerCase();
    let user =
      message.mentions.members.first() ||
      client.users.cache.find(u => u.id === args[0]);
    let blacklist = db.get("blacklist")
    if (message.channel.type === "dm") return;
    if (!db.get("admins").includes(message.author.id)) return;
    if (command === "blacklist") {

      if (!user)
        return message.channel.send("> **الرجاء تحديد المستخدم بشكل صحيح**");
      if (blacklist.includes(user.id))
        return message.channel.send("> **:x: المستخدم موجود بالفعل في القائمة!**");
      db.push("blacklist", user.id)
      message.channel.send("> **تمت إضافة المستخدم إلى القائمة السوداء ✅**");
    }
    if (command === "unblacklist") {

      if (!user)
        return message.channel.send("> **الرجاء تحديد المستخدم بشكل صحيح**");
      if (!blacklist.includes(user.id))
        return message.channel.send("> **:x: العضو غير موجود في القائمة!**");
      const filtered = db.get("blacklist").filter(u => u != user.id)
      db.set("blacklist", filtered);
      message.channel.send("> **تمت إزالة المستخدم من القائمة السوداء ✅**");
    }
    if (command === "resetblacklist") {

      db.set("blacklist", []);
      message.channel.send(
        "> ** تمت إزالة جميع الأعضاء من القائمة السوداء ✅**"
      );
    }
  }
  catch (err) {
    console.log(err)
  }
});







client.login(The Bot Token here);





//dm XenusDev on Discord if any problem
