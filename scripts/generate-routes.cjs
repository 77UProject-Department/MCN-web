const fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm");
const root = path.resolve(__dirname, "../dist");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "content.js"), "utf8"), ctx);
const S = ctx.window.SITE;
const source = fs.readFileSync(path.join(root, "index.html"), "utf8");
const routes = {
  about: "关于柒玖",
  live: "柒玖直播",
  "short-video": "柒玖短视频",
  shop: "柒玖电商",
  "artist-center": "艺人中心",
  "cultural-tourism": "柒玖文旅",
  charm: "社会责任",
  institute: "柒玖研究院",
  careers: "加入我们",
  news: "柒玖新闻",
  contact: "联系我们",
  complain: "意见反馈",
};
S.news.forEach((n) => (routes["news/" + n.id] = n.title));
for (const [route, title] of Object.entries(routes)) {
  const dir = path.join(root, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "index.html"),
    source.replace(
      /<title>.*?<\/title>/,
      `<title>${title} - ${S.brand.name}</title>`,
    ),
  );
}
fs.writeFileSync(
  path.join(root, "404.html"),
  source.replace(
    /<title>.*?<\/title>/,
    `<title>页面未找到 - ${S.brand.name}</title>`,
  ),
);
console.log(
  `Generated ${Object.keys(routes).length} routes plus home and 404.`,
);
