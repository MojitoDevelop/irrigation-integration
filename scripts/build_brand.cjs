// Rasterize the project's own vector artwork into Home Assistant brand assets.
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.IRRIGATION_PLAYWRIGHT || 'playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try {
  const svg=fs.readFileSync(path.join(root,'docs/assets/icon.svg'),'utf8');
  const output=path.join(root,'custom_components/irrigation_schedule/brand');fs.mkdirSync(output,{recursive:true});
  for(const dark of [false,true])for(const size of [256,512]){
   const page=await browser.newPage({viewport:{width:size,height:size},deviceScaleFactor:1});
   const art=dark?svg.replaceAll('#287e53','#6adca2').replaceAll('#3897b6','#81cde7'):svg;
   await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:100vw;height:100vh}</style>${art}`);
   const filename=`${dark?'dark_':''}icon${size===512?'@2x':''}.png`;
   await page.screenshot({path:path.join(output,filename),omitBackground:true});await page.close();
   console.log('Built '+filename);
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
