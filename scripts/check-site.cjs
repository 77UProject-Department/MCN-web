const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../dist');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'content.js'),'utf8'),ctx);const S=ctx.window.SITE;
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk(root);let checked=0;
for(const f of files.filter(f=>/\.(html|js|css)$/.test(f))){const text=fs.readFileSync(f,'utf8');for(const match of text.matchAll(/(?:src=["']|href=["']|url\(["']|["'])(\/(?:assets\/[^'"\s)]+|styles\.css|content\.js|app\.js))/g)){assert.ok(fs.existsSync(path.join(root,match[1])),`Missing asset ${match[1]} in ${f}`);checked++;}}
for(const b of S.businesses)assert.ok(fs.existsSync(path.join(root,b.id,'index.html')),`Missing ${b.id}`);
for(const n of S.news)assert.ok(fs.existsSync(path.join(root,'news',n.id,'index.html')),`Missing news ${n.id}`);
for(const src of [S.hero.image,...S.businesses.map(b=>b.image)])assert.ok(fs.existsSync(path.join(root,src)),`Missing image ${src}`);
assert.equal(S.brand.name,'柒玖视界直播传媒公司');
// Execute every route renderer with minimal non-browser document bindings, then
// validate actual generated links and image references instead of source guesses.
const renderPaths=['/',...files.filter(f=>f.endsWith('index.html')&&f!==path.join(root,'index.html')).map(f=>'/'+path.relative(root,path.dirname(f)).split(path.sep).join('/'))];
for(const route of renderPaths){
 const elements=new Map();const element=()=>({innerHTML:'',textContent:'',hidden:false,addEventListener(){},setAttribute(){},classList:{add(){},remove(){},toggle(){}}});
 const document={body:element(),title:'',addEventListener(){},querySelector(selector){if(!elements.has(selector))elements.set(selector,element());return elements.get(selector)},querySelectorAll(){return[]}};
 const sandbox={window:{SITE:S,addEventListener(){},scrollY:0},document,location:{pathname:route},setTimeout,clearTimeout};
 vm.runInNewContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),sandbox,{timeout:1000});
 const html=['#header','#main','#footer'].map(id=>elements.get(id)?.innerHTML||'').join('');
 assert.ok(html.length>1000,`Empty rendered route: ${route}`);
 for(const [,href] of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
  if(!href.startsWith('/'))continue;
  const local=path.join(root,href.split('#')[0]);
  assert.ok(fs.existsSync(local),`Broken rendered link ${href} on ${route}`);
 }
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes(`id="${id}"`),`Broken anchor #${id} on ${route}`);
}
console.log(`OK: ${renderPaths.length} route renderers execute; rendered links, anchors and image references resolve.`);
assert.ok(!/无忧传媒|wuyou\.com|浙ICP备2024076499|18500870034/.test(fs.readFileSync(path.join(root,'app.js'),'utf8')+fs.readFileSync(path.join(root,'content.js'),'utf8')),'Reference company data found in site content');
console.log(`OK: ${files.filter(f=>f.endsWith('.html')).length} HTML entrypoints, ${checked} asset references, all business/news routes and configured images.`);
(async()=>{for(const f of files.filter(f=>f.endsWith('index.html'))){const rel=path.relative(root,path.dirname(f)).split(path.sep).join('/');const url='http://127.0.0.1:5179/'+(rel?rel+'/':'');const res=await fetch(url,{method:'HEAD'});assert.equal(res.status,200,url);}console.log('OK: all 17 page URLs return HTTP 200.');})().catch(e=>{console.error(e.message);process.exitCode=1});
