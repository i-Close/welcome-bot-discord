// 📜 Discord Welcome Bot - All rights reserved
// --------------------------------------------------
// 👨‍💻 Developed by Nawaf
// --------------------------------------------------
console.log(`
    ███╗   ██╗ █████╗ ██╗    ██╗ █████╗ ███████╗
    ████╗  ██║██╔══██╗██║    ██║██╔══██╗██╔════╝
    ██╔██╗ ██║███████║██║ █╗ ██║███████║███████
    ██║╚██╗██║██╔══██║██║███╗██║██╔══██║║██║
    ██║ ╚████║██║  ██║╚███╔███╔╝██║  ██║║██║
    ╚═╝  ╚═══╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚══╝
                   ＢＹ  ＮＡＷＡＦ
    `);
    
    const { Client, GatewayIntentBits, Partials } = require('discord.js');
    require('dotenv').config();
    
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites
      ],
      partials: [Partials.GuildMember]
    });
    
    const invites = new Map();
    
    client.on('ready', async () => {
      console.log(`✅ Logged in as ${client.user.tag}`);
    
      client.guilds.cache.forEach(async guild => {
        const guildInvites = await guild.invites.fetch().catch(() => {});
        invites.set(guild.id, guildInvites);
      });
    });
    
    client.on('guildMemberAdd', async (member) => {
      const welcomeChannelId = '123456789012345678'; // 👈 غيّر هذا لمعرّف قناة الترحيب
      const channel = member.guild.channels.cache.get(welcomeChannelId);
      if (!channel) return;
    
      const serverName = member.guild.name;
      const memberMention = `<@${member.id}>`;
      const memberCount = member.guild.memberCount;
      const owner = await member.guild.fetchOwner();
    
      let inviterTag = "غير معروف | Unknown";
    
      try {
        const newInvites = await member.guild.invites.fetch();
        const oldInvites = invites.get(member.guild.id);
    
        const usedInvite = newInvites.find(inv => {
          const old = oldInvites?.get(inv.code);
          return old && inv.uses > old.uses;
        });
    
        if (usedInvite && usedInvite.inviter) {
          inviterTag = `${usedInvite.inviter.tag}`;
        }
    
        invites.set(member.guild.id, newInvites);
      } catch (err) {
        console.log("❌ خطأ في جلب الدعوات:", err);
      }
    
      const welcomeMsg = `
    や╿Welcome To ${serverName} ${memberMention}
    や╿مرحبًا بك في ${serverName} ${memberMention}
    
    や╿Member Count | عدد الأعضاء: ${memberCount}
    や╿By | تمت دعوتك بواسطة: ${inviterTag}
    や╿Owner | مالك السيرفر: <@${owner.id}>
      `;
    
      channel.send(welcomeMsg);
    });
    
    client.login(process.env.TOKEN);
    
