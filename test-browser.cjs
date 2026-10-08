const assert=require('node:assert/strict');const fs=require('node:fs');const http=require('node:http');const path=require('node:path');
const {chromium}=require(process.env.IRRIGATION_PLAYWRIGHT || 'playwright');
const root=__dirname;
const server=http.createServer((req,res)=>{const name=new URL(req.url,'http://localhost').pathname.slice(1)||'preview.html';if(!['preview.html','schedule-model.js','irrigation-schedule-integration-card.js'].includes(name)){res.writeHead(404).end();return;}res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':'text/html');res.end(fs.readFileSync(name==='schedule-model.js'?path.join(root,'card-source',name):name==='irrigation-schedule-integration-card.js'?path.join(root,'custom_components/irrigation_schedule/frontend/irrigation-schedule-card.js'):path.join(root,name)));});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try {
  const page=await browser.newPage({viewport:{width:540,height:1700},locale:'pl-PL'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(7000);
  await page.goto(`http://127.0.0.1:${server.address().port}/`);const card=page.locator('irrigation-schedule-integration-card');
  const header=card.locator('.heading');assert.equal(await header.evaluate(el=>el.tagName),'DIV');assert.equal(await card.locator('[data-action=expand]').count(),0);assert.equal(await card.evaluate(el=>getComputedStyle(el.shadowRoot.querySelector('ha-card')).backgroundColor),'rgba(0, 0, 0, 0)');await page.waitForFunction(()=>window.demoCard._ready);
  assert.equal(await page.evaluate(()=>customElements.get('irrigation-schedule-integration-card').version),'0.2.0');
  assert.equal(await card.locator('.schedule-form').isVisible(),false);
  assert.equal(await card.locator('.manual-section').isVisible(),false);
  assert.equal(await card.getByRole('button',{name:'Steruj zaworem Trawnik',exact:true}).count(),0);
  assert.equal(await page.evaluate(()=>demoSchedules.filter(s=>s.name==='Nawodnienie Konfiguracja zaworów').length),0);
  assert.equal(await card.locator('[data-edit]').count(),2);
  const gap=await card.evaluate(el=>{const a=el.shadowRoot.querySelector('.schedule-toolbar').getBoundingClientRect(),b=el.shadowRoot.querySelector('.entries').getBoundingClientRect();return b.top-a.bottom;});assert.ok(gap>=12);
  await page.locator('.pane').screenshot({path:path.join(root,'preview-light.png')});await page.evaluate(()=>setDark(true));await page.locator('.pane').screenshot({path:path.join(root,'preview-dark.png')});await page.evaluate(()=>setDark(false));
  const writesBeforeOpen=await page.evaluate(()=>wsCalls.filter(c=>['schedule/create','schedule/update','schedule/delete'].includes(c.type)).length);
  await card.getByRole('button',{name:'Dodaj harmonogram',exact:true}).click();assert.equal(await card.locator('.schedule-form').isVisible(),true);
  assert.equal(await page.evaluate(()=>wsCalls.filter(c=>['schedule/create','schedule/update','schedule/delete'].includes(c.type)).length),writesBeforeOpen);
  assert.equal(await card.getByRole('spinbutton',{name:'Początek podlewania — godziny',exact:true}).inputValue(),'12');assert.equal(await card.getByRole('spinbutton',{name:'Koniec podlewania — godziny',exact:true}).inputValue(),'13');
  await page.locator('.pane').screenshot({path:path.join(root,'preview-form.png')});console.log('PASS form starts hidden and Add opens all fields without creating a helper');
  const draftTitle=card.getByLabel('Nazwa harmonogramu',{exact:true});await draftTitle.fill('Niezapisany szkic');await draftTitle.focus();
  const stableRefresh=await page.evaluate(async()=>{
    const root=demoCard.shadowRoot, title=root.querySelector('[data-title]'), row=root.querySelector('[data-edit]'), picker=root.querySelector('irrigation-integration-time-picker');
    const records=[];const observer=new MutationObserver(batch=>records.push(...batch));observer.observe(root,{subtree:true,childList:true,attributes:true});
    for(let i=0;i<6;i++)publish();
    await demoCard.refresh(false);await Promise.resolve();observer.disconnect();
    return {mutations:records.map(r=>({type:r.type,name:r.attributeName})),sameTitle:title===root.querySelector('[data-title]'),sameRow:row===root.querySelector('[data-edit]'),samePicker:picker===root.querySelector('irrigation-integration-time-picker'),focused:root.activeElement===title,title:title.value,disabled:title.disabled};
  });
  assert.deepEqual(stableRefresh,{mutations:[],sameTitle:true,sameRow:true,samePicker:true,focused:true,title:'Niezapisany szkic',disabled:false});
  console.log('PASS unchanged HA states and background refresh cause zero DOM mutations and preserve focused draft/time picker');
  const stateRefresh=await page.evaluate(()=>{
    const root=demoCard.shadowRoot,body=root.querySelector('.body'),row=root.querySelector('[data-edit]'),title=root.querySelector('[data-title]');
    demoStates['switch.garden_1'].state='off';demoStates['sensor.nawodnienie_integracja_status'].state='Nowy stan testowy';publish();
    const same=body===root.querySelector('.body')&&row===root.querySelector('[data-edit]')&&title===root.activeElement;
    const text=root.querySelector('[data-sensor]').textContent;
    demoStates['switch.garden_1'].state='on';demoStates['sensor.nawodnienie_integracja_status'].state='Podlewanie: Trawnik rano, Rabaty · zawory: 1, 2, 4';publish();
    return {same,text};
  });assert.deepEqual(stateRefresh,{same:true,text:'Nowy stan testowy'});console.log('PASS actual state changes update status in place without replacing the card or schedule rows');
  await page.waitForFunction(()=>!demoCard._loading && !demoCard._changeTimer);
  const unchangedConfig=await page.evaluate(()=>{
    const root=demoCard.shadowRoot,body=root.querySelector('.body'),title=root.querySelector('[data-title]');
    demoCard.setConfig({title:'Nawodnienie',status_entity:'sensor.nawodnienie_integracja_status'});
    return {same:body===root.querySelector('.body'),focused:title===root.activeElement,value:title.value};
  });assert.deepEqual(unchangedConfig,{same:true,focused:true,value:'Niezapisany szkic'});
  await page.evaluate(()=>{
    const item={...structuredClone(demoSchedules[1]),id:'external-storage',name:'Nawodnienie Zewnętrzny'};
    demoSchedules.push(item);demoRegistry.push({platform:'schedule',unique_id:item.id,entity_id:'schedule.nawodnienie_external',disabled_by:null});
    emitScheduleChanges([{change_type:'added',schedule_id:item.id,item}]);
  });await page.waitForFunction(()=>demoCard._entries.some(e=>e.schedule.id==='external-storage') && !demoCard._loading);
  assert.equal(await draftTitle.inputValue(),'Niezapisany szkic');
  await page.evaluate(()=>{const item=demoSchedules.find(s=>s.id==='external-storage');item.name='Nawodnienie Zmieniony poza kartą';emitScheduleChanges([{change_type:'updated',schedule_id:item.id,item}]);});
  await page.waitForFunction(()=>demoCard._entries.some(e=>e.schedule.name==='Nawodnienie Zmieniony poza kartą') && !demoCard._loading);
  await page.evaluate(()=>{demoSchedules=demoSchedules.filter(s=>s.id!=='external-storage');demoRegistry=demoRegistry.filter(r=>r.unique_id!=='external-storage');emitScheduleChanges([{change_type:'removed',schedule_id:'external-storage'}]);});
  await page.waitForFunction(()=>!demoCard._entries.some(e=>e.schedule.id==='external-storage') && !demoCard._loading);
  assert.equal(await draftTitle.inputValue(),'Niezapisany szkic');assert.equal(await page.evaluate(()=>demoCard.shadowRoot.activeElement===demoCard.shadowRoot.querySelector('[data-title]')),true);
  const ignoredBefore=await page.evaluate(()=>wsCalls.length);
  await page.evaluate(()=>emitScheduleChanges([{change_type:'updated',schedule_id:'ev-only',item:{name:'Ładowarka EV'}}]));await page.waitForTimeout(150);
  assert.equal(await page.evaluate(()=>wsCalls.length),ignoredBefore);
  assert.equal(await page.evaluate(()=>scheduleListeners.size),1);
  await page.evaluate(()=>{const parent=demoCard.parentElement;demoCard.remove();parent.append(demoCard);});
  await page.waitForFunction(()=>subscribeCalls===2 && unsubscribeCalls===1 && scheduleListeners.size===1 && !demoCard._loading && !demoCard._changeTimer);
  assert.equal(await draftTitle.inputValue(),'Niezapisany szkic');
  console.log('PASS collection push adds/updates/removes external helpers, ignores unrelated schedules, keeps drafts, and reconnects without duplicate subscriptions');
  await draftTitle.fill('');
  const hour=card.getByRole('spinbutton',{name:'Początek podlewania — godziny',exact:true});await hour.hover();await page.waitForTimeout(100);await page.mouse.wheel(0,36);await page.waitForTimeout(350);assert.equal(await hour.inputValue(),'13');await hour.press('ArrowDown');assert.equal(await hour.inputValue(),'12');
  await card.getByRole('button',{name:'Edytuj harmonogram Trawnik rano',exact:true}).click();
  const setTime=async(label,value)=>{const[h,m]=value.split(':');const hh=card.getByRole('spinbutton',{name:label+' — godziny',exact:true}),mm=card.getByRole('spinbutton',{name:label+' — minuty',exact:true});await hh.press('ControlOrMeta+A');await hh.pressSequentially(h);await mm.press('ControlOrMeta+A');await mm.pressSequentially(m);await mm.press('Tab');};
  await setTime('Początek podlewania','10:30');await setTime('Koniec podlewania','12:30');const title=card.getByLabel('Nazwa harmonogramu',{exact:true});await title.press('ControlOrMeta+A');await title.pressSequentially('Trawnik po zmianie');
  await card.getByRole('button',{name:'Zawór Trawnik',exact:true}).click();await card.getByRole('button',{name:'Zawór Strefa 7',exact:true}).click();
  await page.evaluate(()=>{
    const original=demoCard._hass.callWS;
    const gate=new Promise(resolve=>window.finishBackgroundRead=resolve);
    demoCard._hass={...demoCard._hass,callWS:async req=>{if(req.type==='schedule/list')await gate;return original(req);}};
    window.backgroundRead=demoCard.refresh(false);
  });
  await page.waitForFunction(()=>demoCard._loading);
  await card.getByRole('button',{name:'Zapisz cały harmonogram',exact:true}).click();
  assert.equal(await page.evaluate(()=>demoCard._busy),true);await page.evaluate(()=>finishBackgroundRead());
  await card.getByText('Zmieniono cały harmonogram we wszystkich wybranych dniach.',{exact:true}).waitFor();
  console.log('PASS save clicked during background read waits for the read and completes instead of being ignored');
  let snapshots=await page.evaluate(()=>demoSchedules);const edited=snapshots.find(s=>s.id==='fixture-storage-a');
  assert.equal(edited.name,'Irrigation Trawnik po zmianie');for(const d of ['monday','wednesday','friday']){assert.equal(edited[d][0].from,'10:30:00');assert.equal(edited[d][0].to,'12:30:00');assert.equal(edited[d][0].data.irrigation_valves,JSON.stringify(['switch.garden_2','switch.garden_7']));}assert.equal(edited.tuesday.length,0);
  assert.equal(await page.evaluate(()=>wsCalls.filter(c=>c.type==='schedule/update').length),1);console.log('PASS whole schedule editing, all weekdays, valves and friendly name in one update');
  await card.getByRole('button',{name:'Edytuj harmonogram Trawnik po zmianie',exact:true}).click();await card.getByRole('button',{name:'Pn',exact:true}).click();await card.getByRole('button',{name:'Wt',exact:true}).click();await card.getByRole('button',{name:'Zapisz cały harmonogram',exact:true}).click();await card.getByText('Zmieniono cały harmonogram we wszystkich wybranych dniach.',{exact:true}).waitFor();
  snapshots=await page.evaluate(()=>demoSchedules);assert.equal(snapshots[0].monday.length,0);assert.equal(snapshots[0].tuesday.length,1);console.log('PASS removed and added weekdays are replaced together');
  assert.equal(await card.locator('.schedule-form').isVisible(),false);await card.getByRole('button',{name:'Dodaj harmonogram',exact:true}).click();await setTime('Początek podlewania','10:30');await setTime('Koniec podlewania','12:30');await card.getByRole('button',{name:'Dodaj harmonogram',exact:true}).click();await card.getByText('Dodano harmonogram i utworzono encję Schedule.',{exact:true}).waitFor();
  assert.equal((await page.evaluate(()=>demoSchedules)).length,3);assert.equal(await page.evaluate(()=>wsCalls.filter(c=>c.type==='schedule/create').length),1);console.log('PASS new helper created in card with overlapping hours and shared valve');
  await card.getByRole('button',{name:'Edytuj harmonogram Trawnik po zmianie',exact:true}).click();await title.press('ControlOrMeta+A');await title.pressSequentially('Nie zapisuj');await page.evaluate(()=>window.failWrites=true);await card.getByRole('button',{name:'Zapisz cały harmonogram',exact:true}).click();await card.getByText('Odmowa zapisu',{exact:true}).waitFor();assert.equal(await card.locator('.schedule-form').isVisible(),true);assert.equal((await page.evaluate(()=>demoSchedules))[0].name,'Irrigation Trawnik po zmianie');await page.evaluate(()=>window.failWrites=false);console.log('PASS denied writes preserve saved helper and draft');
  await card.getByRole('button',{name:'Anuluj',exact:true}).click();await card.getByRole('button',{name:'Edytuj harmonogram Rabaty',exact:true}).click();page.once('dialog',d=>d.accept());await card.getByRole('button',{name:'Usuń cały harmonogram',exact:true}).click();await card.getByText('Usunięto cały harmonogram i jego encję.',{exact:true}).waitFor();assert.equal((await page.evaluate(()=>demoSchedules)).length,2);assert.equal(await page.evaluate(()=>wsCalls.filter(c=>c.type==='schedule/delete')[0].schedule_id),'fixture-storage-b');console.log('PASS removal deletes helper using actual storage ID');
  assert.equal(await card.locator('.manual-section').isVisible(),false);await card.getByRole('button',{name:'Automatyka nawodnienia',exact:true}).click();await card.getByRole('button',{name:'Steruj zaworem Trawnik',exact:true}).waitFor();
  assert.deepEqual(await page.evaluate(()=>serviceCalls.at(-1)),['switch','turn_off',{entity_id:'switch.nawodnienie_automatyka'}]);
  assert.equal(await card.locator('.manual-section').isVisible(),true);assert.ok(await card.getByRole('button',{name:'Steruj zaworem Trawnik',exact:true}).evaluate(el=>el.getBoundingClientRect().height)<=38);
  await card.getByRole('button',{name:'Steruj zaworem Trawnik',exact:true}).click();await page.waitForFunction(()=>demoStates['switch.garden_1'].state==='on');assert.equal(await page.evaluate(()=>demoStates['switch.garden_1'].state),'on');assert.equal(await card.getByRole('button',{name:'Steruj zaworem Trawnik',exact:true}).getAttribute('aria-pressed'),'true');
  await card.getByRole('button',{name:'Zamknij wszystkie',exact:true}).click();assert.equal(await page.evaluate(()=>wsCalls.filter(c=>c.type==='irrigation_schedule/manual').at(-1).entity ? 1 : demoCatalog.valves.length),12);console.log('PASS real automation entity targeted, hidden manual section while automatic, compact buttons, valve and all-valve commands');
  await page.locator('.pane').screenshot({path:path.join(root,'preview-manual.png')});
  await card.getByRole('button',{name:'Automatyka nawodnienia',exact:true}).click();await page.waitForFunction(()=>demoStates['switch.nawodnienie_automatyka'].state==='on');assert.equal(await card.locator('.manual-section').isVisible(),false);
  await card.getByRole('button',{name:'Automatyka nawodnienia',exact:true}).click();await card.getByRole('button',{name:'Steruj zaworem Trawnik',exact:true}).waitFor();console.log('PASS live automation changes hide and restore manual section without reloading');
  await page.setViewportSize({width:360,height:1200});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await card.getByRole('button',{name:'Edytuj harmonogram Trawnik po zmianie',exact:true}).click();await setTime('Początek podlewania','23:30');await setTime('Koniec podlewania','01:15');await card.getByRole('button',{name:'Zapisz cały harmonogram',exact:true}).click();await card.getByText('Zmieniono cały harmonogram we wszystkich wybranych dniach.',{exact:true}).waitFor();
  const original=await page.evaluate(()=>demoSchedules[0]);assert.equal(original.tuesday[0].to,'24:00:00');assert.equal(original.wednesday[0].from,'00:00:00');await card.getByRole('button',{name:'Edytuj harmonogram Trawnik po zmianie',exact:true}).click();assert.equal(await card.getByRole('spinbutton',{name:'Początek podlewania — godziny',exact:true}).inputValue(),'23');assert.equal(await card.getByRole('button',{name:'Wt',exact:true}).getAttribute('aria-pressed'),'true');
  console.log('PASS mobile layout and midnight pieces reopen as one schedule');
  await header.click();assert.equal(await card.locator('.body').isVisible(),true);assert.equal(await card.locator('.schedule-form').isVisible(),true);assert.equal(await card.getByRole('spinbutton',{name:'Początek podlewania — godziny',exact:true}).inputValue(),'23');assert.deepEqual(errors,[]);console.log('PASS heading is static and preserves the open form');
  const before=await page.evaluate(()=>({saved:JSON.stringify(demoSchedules),writes:wsCalls.filter(c=>['schedule/create','schedule/update','schedule/delete'].includes(c.type)).length}));
  await title.fill('Porzucona nazwa');await card.getByRole('button',{name:'Anuluj',exact:true}).click();assert.equal(await card.locator('.schedule-form').isVisible(),false);assert.deepEqual(await page.evaluate(()=>({title:demoCard._title,from:demoCard._from,to:demoCard._to})),{title:'',from:'12:00',to:'13:00'});
  assert.deepEqual(await page.evaluate(()=>({saved:JSON.stringify(demoSchedules),writes:wsCalls.filter(c=>['schedule/create','schedule/update','schedule/delete'].includes(c.type)).length})),before);console.log('PASS cancel closes form, resets default hours and performs no writes');
  await page.evaluate(()=>{demoSchedules.push({id:'empty-storage',name:'Nawodnienie pusty'});demoRegistry.push({platform:'schedule',unique_id:'empty-storage',entity_id:'schedule.nawodnienie_pusty',disabled_by:null});demoStates['schedule.nawodnienie_pusty']={state:'off',attributes:{editable:true}}});await card.getByRole('button',{name:'Odśwież',exact:true}).click();await card.getByText('Błąd',{exact:true}).waitFor();assert.equal(await card.getByRole('button',{name:'Błąd',exact:true}).count(),0);console.log('PASS invalid helper shows a status label, not a check button');
  const recorded=await page.evaluate(()=>JSON.stringify(demoSchedules.find(s=>s.id==='fixture-storage-a')));
  await page.evaluate(()=>demoCard.setConfig({...demoCard._config,valves:[...demoCard._valves].reverse().map(v=>({...v,name:v.entity==='switch.garden_2'?'Rabaty pod domem':v.name}))}));
  await page.waitForFunction(()=>demoCard._ready && !demoCard._loading);
  assert.equal(await page.evaluate(()=>JSON.stringify(demoSchedules.find(s=>s.id==='fixture-storage-a'))),recorded);
  await card.getByRole('button',{name:'Edytuj harmonogram Trawnik po zmianie',exact:true}).click();assert.equal(await card.getByRole('button',{name:'Zawór Rabaty pod domem',exact:true}).getAttribute('aria-pressed'),'true');
  console.log('PASS entity/name configuration, renamed valve, and reordered list preserve saved assignments');
  await card.getByRole('button',{name:'Anuluj',exact:true}).click();
  await page.evaluate(()=>demoCard.setConfig({...demoCard._config,valves:demoCard._valves.filter(v=>v.entity!=='switch.garden_7')}));await page.waitForFunction(()=>demoCard._ready && !demoCard._loading);
  assert.equal(await card.locator('[data-zone="switch.garden_7"]').count(),0);
  assert.equal(await page.evaluate(()=>demoCatalog.retired[0].entity),'switch.garden_7');
  console.log('PASS removing entity persists closure information for the background controller');
  await page.waitForFunction(()=>!demoCard._loading && !demoCard._busy && !demoCard._changeTimer);
  await page.evaluate(()=>{
    const renamed=demoCatalog.valves.map(v=>({...v,name:v.entity==='switch.garden_2'?'Nazwa zmieniona w opcjach HA':v.name}));
    demoCatalog.valves=renamed;publish();
  });await page.waitForFunction(()=>demoCard._valves.some(v=>v.name==='Nazwa zmieniona w opcjach HA') && !demoCard._loading && !demoCard._changeTimer);
  assert.equal(await page.evaluate(()=>demoCard._catalogReady),true);
  console.log('PASS integration options changes refresh the valve catalog through HA state notifications');
  // Use a fresh page to advance three polling periods without waiting 90 real seconds.
  const idle=await browser.newPage();idle.on('pageerror',e=>errors.push(e.message));
  await idle.goto(`http://127.0.0.1:${server.address().port}/`);
  await idle.waitForFunction(()=>demoCard._ready && !demoCard._loading && !demoCard._changeTimer);
  await idle.locator('irrigation-schedule-integration-card [data-action=add-form]').click();
  await idle.locator('irrigation-schedule-integration-card [data-title]').fill('Szkic podczas bezczynności');
  const translations = JSON.parse(fs.readFileSync(path.join(root,'custom_components/irrigation_schedule/locales/en.json'),'utf8'));
  await idle.evaluate(()=>{
    demoCard.setConfig({});
    demoStates['sensor.nawodnienie_integracja_status'].attributes.status_code='status_watering';
    demoStates['sensor.nawodnienie_integracja_status'].attributes.status_params={schedules:'Trawnik rano',valves:'Trawnik'};
  });await idle.waitForFunction(()=>demoCard._ready && !demoCard._loading && !demoCard._changeTimer);
  await idle.locator('irrigation-schedule-integration-card [data-action=add-form]').click();
  await idle.locator('irrigation-schedule-integration-card [data-title]').fill('User supplied name');
  for (const [language, title, add, hours, status] of [
    ['en-US','Irrigation','Add schedule','Watering start — hours','Watering: Trawnik rano · valves: Trawnik'],
    ['de','Bewässerung','Zeitplan hinzufügen','Beginn der Bewässerung — Stunden','Bewässerung: Trawnik rano · Ventile: Trawnik'],
    ['pl','Nawodnienie','Dodaj harmonogram','Początek podlewania — godziny','Podlewanie: Trawnik rano · zawory: Trawnik'],
    ['fr','Irrigation','Add schedule','Watering start — hours','Watering: Trawnik rano · valves: Trawnik']
  ]) {
    await idle.evaluate(language=>{demoLanguage=language;publish();},language);
    const main=idle.locator('irrigation-schedule-integration-card');
    assert.equal(await main.locator('.heading strong').textContent(),title);
    assert.equal(await main.locator('[data-action=save]').textContent(),add);
    assert.equal(await main.getByRole('spinbutton',{name:hours,exact:true}).inputValue(),'12');
    assert.equal(await main.locator('[data-title]').inputValue(),'User supplied name');
    assert.equal(await main.locator('[data-sensor]').textContent(),status);
    assert.equal(await main.locator('.schedule-form').isVisible(),true);
    assert.equal(await idle.evaluate(()=>demoCard.shadowRoot.activeElement===demoCard.shadowRoot.querySelector('[data-title]')),true);
  }
  await idle.locator('irrigation-schedule-integration-card [data-title]').fill('Szkic podczas bezczynności');
  await idle.evaluate(()=>{demoLanguage='de';publish();demoCard._days.clear();});
  await idle.locator('irrigation-schedule-integration-card [data-action=save]').click();
  assert.equal(await idle.locator('irrigation-schedule-integration-card .message').textContent(),'Mindestens einen Tag auswählen.');
  await idle.evaluate(()=>{demoLanguage='pl';publish();});
  assert.equal(await idle.locator('irrigation-schedule-integration-card .message').textContent(),'Wybierz przynajmniej jeden dzień.');
  await idle.locator('irrigation-schedule-integration-card [data-title]').focus();
  console.log('PASS HA language en/pl/de, regional codes and English fallback translate heading, controls, time ARIA, live status and validation without resetting the focused draft');
  await idle.clock.install();
  const beforeIdle=await idle.evaluate(()=>{
    const root=demoCard.shadowRoot;window.idleMutations=[];window.idleBody=root.querySelector('.body');window.idleTitle=root.querySelector('[data-title]');
    window.idleObserver=new MutationObserver(records=>idleMutations.push(...records));idleObserver.observe(root,{subtree:true,attributes:true,childList:true,characterData:true});
    return wsCalls.length;
  });await idle.clock.runFor(95000);
  const afterIdle=await idle.evaluate(()=>{
    idleObserver.disconnect();const root=demoCard.shadowRoot;
    return {calls:wsCalls.length,mutations:idleMutations.length,sameBody:idleBody===root.querySelector('.body'),sameTitle:idleTitle===root.querySelector('[data-title]'),focused:root.activeElement===idleTitle,value:idleTitle.value};
  });assert.deepEqual(afterIdle,{calls:beforeIdle,mutations:0,sameBody:true,sameTitle:true,focused:true,value:'Szkic podczas bezczynności'});
  // The websocket library keeps the Connection object while reconnecting.
  await idle.evaluate(()=>{demoSchedules=[];demoRegistry=[];for(const callback of readyListeners)callback();emitScheduleChanges([]);});
  await idle.clock.runFor(250);
  assert.equal(await idle.evaluate(()=>demoCard._entries.length),0);
  assert.equal(await idle.evaluate(()=>demoCard._title),'Szkic podczas bezczynności');
  assert.equal(await idle.evaluate(()=>scheduleListeners.size),1);
  await idle.evaluate(()=>demoCard.remove());
  assert.deepEqual(await idle.evaluate(()=>({schedules:scheduleListeners.size,ready:readyListeners.size})),{schedules:0,ready:0});
  console.log('PASS socket reconnect refreshes helpers deleted while offline and detach cleans up all listeners');
  await idle.close();console.log('PASS 95 idle seconds cause no polling, no DOM mutations, no replaced card or lost focused draft');
  assert.deepEqual(errors,[]);

 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
