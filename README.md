# 柒玖视界直播传媒公司官网模板

根据 https://www.wuyou.com/ 的真实页面结构和视觉观察实现。采用 HTML、CSS 和原生 JavaScript，无运行时框架依赖。网站源码与成品都在 `dist/`，可继续改造，也可放到静态网站服务器。

## 本地打开

安装 Node.js 后，在本项目目录运行 `npm run dev`，访问 http://127.0.0.1:5179/ 。不要直接双击 HTML，因为资源使用从网站根目录开始的路径。

`npm run build` 更新所有页面入口并执行静态检查；`npm run check` 检查页面生成、文件、图片与链接，不需要启动服务器。`npm run check:http` 额外检查本地 HTTP 状态，使用前先启动本地预览。

## 部署到 Vercel

本项目已配置为 Vercel 的静态网站项目，仓库根目录的 `vercel.json` 会设置构建命令、输出目录和 URL 格式，不需要改造成 Next.js，也不需要配置环境变量。

1. 在 Vercel 中新建项目，导入 GitHub 仓库 `77UProject-Department/MCN-web`。
2. 生产分支选择 `main`，Root Directory 保持仓库根目录 `./`，不要选择 `dist`。
3. Framework Preset 为 **Other**；Build Command 为 `npm run build`；Output Directory 为 `dist`。配置文件已声明这些值，通常无需手动覆盖。
4. 本项目没有第三方依赖，配置已跳过安装步骤。点击 **Deploy** 完成部署；后续推送 `main` 可触发自动更新。

构建时会生成首页、16 个栏目/详情页和 `404.html`，随后检查页面、图片与内部链接。Vercel 直接托管 `dist` 中的静态文件，本站的 `scripts/serve.cjs` 仅用于本地预览，不是生产服务器。

路由采用目录形式，如 `/about/`、`/live/`、`/news/content-value/`，可直接访问和刷新；`trailingSlash` 会将无末尾斜杠的页面地址归一化。没有将全部请求重写到首页，因此不存在的地址可正常返回 404。

使用 Vercel CLI 时，在项目根目录执行 `npx vercel`；正式发布可使用 `npx vercel --prod`，需要先登录并关联自己的 Vercel 项目。`.vercelignore` 会排除本地研究文件与 Sites 平台配置。已有 `.openai/hosting.json` 保留给原有 Sites 预览使用，不参与 Vercel 部署。

配置依据：[Vercel 官方配置文档](https://vercel.com/docs/project-configuration/vercel-json)。

## 部署到宝塔面板

宝塔部署请查看 [宝塔部署说明](deployment/baota/宝塔部署说明.md)。使用宝塔静态部署包时，将包内文件直接解压到网站根目录即可；无需运行 Node.js。可选的 Nginx 配置位于 `deployment/baota/nginx-location.conf`。

## 最常修改的位置

| 要修改的内容 | 文件与位置 |
| --- | --- |
| 公司全称、简称、品牌介绍 | `dist/content.js` → `brand` |
| 首页海报、标语 | `dist/content.js` → `hero` |
| 公司介绍 | `dist/content.js` → `intro` |
| 地址、电话、微信、邮箱、备案号 | `dist/content.js` → `contact` |
| 三项业务的说明与图片 | `dist/content.js` → `businesses`；图片赋值也在文件末尾 |
| 艺人展示、分类与图片定位 | `dist/content.js` → `creators` |
| 新闻标题、分类和正文 | `dist/content.js` → `news`；增删后执行 `npm run build` |
| 招募方向与岗位职责 | `dist/content.js` → `jobs` |
| 常见问题 | `dist/content.js` → `faq` |
| 颜色、内容宽度、导航高度 | `dist/styles.css` 开头的 `:root` |
| 页面板块、顺序、导航与交互 | `dist/app.js` 对应页面函数 |
| 图片文件 | `dist/assets/` |

示例：将 `contact.phone` 填为实际电话，网站自动显示拨号按钮；填入 `contact.email` 启用邮件链接，填入 `contact.wechat` 启用复制按钮。请保留字符串两侧的引号。二维码可放入 `dist/assets/` 并把 `contact.wechatQr` 设为 `/assets/你的图片.png`。外部官方账号链接只填写可信的 HTTPS 地址。

## 页面范围

首页；直播；短视频；直播电商；艺人中心；文旅；关于柒玖；社会责任；研究院；加入我们；新闻列表；4 个新闻详情页；联系我们；意见反馈；404 页面。

已实现：桌面下拉菜单、手机导航、公司简介展开/收起、业务图片切换、创作者分类、新闻分类、招聘筛选与详情展开、常见问题展开、返回顶部、填写真实联系方式后的拨号/邮件/复制入口。

## 内容边界

这是可调整的前端模板，未接入内容管理后台、表单数据库或在线工单系统。招聘与新闻中已标注示例；电话号码、微信、地址、邮箱、备案信息保持空白，页面会显示待公布状态。未填造员工数量、签约艺人、合作品牌、营收、荣誉或城市分支机构。

首页与业务图片为原创 AI 生成的虚构人物和场景，不代表真实签约艺人、员工或公司场地。正式对外使用前，替换为贵公司确认的真实资料。原站的明星肖像、新闻事件、公司数据、商标和联系方式没有作为柒玖视界内容使用。

## 与参考站的对应关系

详见 `REFERENCE_ANALYSIS.md`。本版本复刻参考站的主要布局和视觉体系，并重写为便于调整的代码；公司内容与示例素材已替换，因此不声称所有像素及所有页面内容完全一致。中文版本保留了语言展示位置，未制作英文站。原站跳往第三方招聘平台的入口改为本站招聘模板。

## 交付素材

`ASSETS.md` 记录图片来源与生成提示词。`research/` 保存本次 Playwright 参考站浏览的截图与结构记录，作为本地研究资料，不包含在网站发布内容中。
