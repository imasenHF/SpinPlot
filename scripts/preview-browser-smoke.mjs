import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

const url = 'https://plastocyanin.org/previews/spinplot-modularization/';
fs.mkdirSync('browser-preview', {recursive: true});
const browser = await chromium.launch({headless:true});
const errors=[];
try {
  const page = await browser.newPage({viewport:{width:1440,height:900},acceptDownloads:true});
  page.on('pageerror', err => errors.push(err.message));
  const response = await page.goto(url,{waitUntil:'networkidle',timeout:45000});
  assert.equal(response.status(),200,'Preview HTML must be served');
  assert.match(await page.title(),/SpinPlot 0\.9\.2/);
  assert.equal(await page.locator('.tab-btn').count(),6,'Six tabs are required');
  await page.waitForFunction(() => document.querySelector('#statusMain')?.textContent?.includes('Waiting for data'),null,{timeout:15000});
  await page.locator('#dataFiles').setInputFiles({name:'synthetic-cw.csv',mimeType:'text/csv',
    buffer:Buffer.from('B,Trace A,Trace B\n3300,0,0\n3310,1,2\n3320,-1,-2\n3330,0,0\n3340,1,2\n3350,0,0\n')});
  await page.waitForFunction(() => document.querySelector('#dataCount')?.textContent?.trim()==='2',null,{timeout:20000});
  await page.screenshot({path:'browser-preview/spinplot-wide.png',fullPage:true});
  await page.locator('button.tab-btn[data-tab="scaling"]').click();
  assert.match(await page.locator('button.tab-btn[data-tab="scaling"]').getAttribute('class'),/active/);
  await page.locator('button.tab-btn[data-tab="export"]').click();
  const [download] = await Promise.all([page.waitForEvent('download',{timeout:15000}),page.locator('#exportCsvBtn').click()]);
  assert.match(download.suggestedFilename(),/\.csv$/i);
  await download.saveAs('browser-preview/synthetic-global.csv');
  // Project and config persistence: verify format numbers and legacy project reload.
  const [projectDownload] = await Promise.all([page.waitForEvent('download',{timeout:15000}),page.locator('#saveProjectBtn').click()]);
  const projectPath='browser-preview/synthetic-project.spinplot.json';
  await projectDownload.saveAs(projectPath);
  const project=JSON.parse(fs.readFileSync(projectPath,'utf8'));
  assert.equal(project.type,'SpinPlotProject');
  assert.equal(project.version,11);
  assert.equal(project.config.version,10);
  assert.equal(project.rawCurves.length,2);
  const [configDownload] = await Promise.all([page.waitForEvent('download',{timeout:15000}),page.locator('#saveConfigBtn').click()]);
  const configPath='browser-preview/synthetic-config.json';
  await configDownload.saveAs(configPath);
  const config=JSON.parse(fs.readFileSync(configPath,'utf8'));
  assert.equal(config.version,10);
  assert.ok(!Object.hasOwn(config,'rawCurves'));
  for (const version of [9,10,11]) {
    const fileName='synthetic-v'+version+'.spinplot.json';
    await page.locator('#projectFile').setInputFiles({name:fileName,mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...project,version}))});
    await page.waitForFunction((name)=>document.querySelector('#log')?.textContent?.includes('Project loaded: '+name),fileName,{timeout:15000});
    assert.equal((await page.locator('#dataCount').textContent()).trim(),'2');
  }
  assert.equal(errors.length,0,'Browser script error: '+errors.join(' | '));
  await page.close();
  const narrow = await browser.newPage({viewport:{width:650,height:850}});
  narrow.on('pageerror',err=>errors.push(err.message));
  const responseN = await narrow.goto(url,{waitUntil:'networkidle',timeout:45000});
  assert.equal(responseN.status(),200);
  assert.equal(await narrow.locator('.tab-btn').count(),6);
  await narrow.screenshot({path:'browser-preview/spinplot-narrow.png',fullPage:true});
  assert.equal(errors.length,0,'Browser script error: '+errors.join(' | '));
  console.log('BROWSER PASS: open, six tabs, CSV import/export, project v9/10/11 roundtrip, config v10, wide/narrow screenshots');
} finally {
  await browser.close();
}
