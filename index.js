require("dotenv").config();
const Discord = require("discord.js");
const Watcher = require("feed-watcher");
const striptags = require("striptags");

const client = new Discord.Client();
const interval = 300; // seconds
const test = "http://lorem-rss.herokuapp.com/feed?unit=second&interval=30";
const feed = "https://www.pathofexile.com/news/rss";
const secret = process.env.API_KEY;

const watcher = new Watcher(feed, interval);
client.login(secret);

client.on("ready", () => {
  const poewnewsChannel = client.channels.find(
    channel => channel.name === "poewnews"
  ).id;

  console.log(`Logged in as ${client.user.tag}!`);

  watcher.on("new entries", function(entries) {
    entries.forEach(function(entry) {
      client.channels.get(poewnewsChannel).send({
        embed: {
          title: striptags(entry.title),
          description: striptags(entry.summary),
          url: entry.link,
          image: {
            url: entry.meta.image.url
          },
          timestamp: entry.date
        }
      });
    });
  });
});

watcher.start().catch(error => {
  console.error("err " + error);
  watcher.stop();
});
