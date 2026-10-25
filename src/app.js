import './workbench.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { buildWatch, componentInfo } from './watch.js';

const icons={play:'<path d="m7 4 9 6-9 6Z"/>',pause:'<path d="M7 4v12m6-12v12"/>',download:'<path d="M10 2v10m-4-4 4 4 4-4M3 13v4h14v-4"/>',close:'<path d="m5 5 10 10M5 15 15 5"/>'};
const icon=name=>`<svg viewBox="0 0 20 20" aria-hidden="true">${icons[name]}</svg>`;
document.querySelector('#app').innerHTML=`
<header class="topbar">
  <div class="brand">CALIBRE<sup>/ 001</sup></div>
  <nav class="mode-nav" aria-label="Model display">
    <button id="section" aria-pressed="false">SECTION</button><button id="explode" aria-pressed="false">EXPLODE</button><button id="wireframe" aria-pressed="false">WIREFRAME</button><button id="names" aria-pressed="false">NAMES</button>
  </nav>
  <div class="header-actions"><button id="run" aria-label="Pause mechanism" aria-pressed="true">PAUSE</button><span class="divider">//</span><button id="speed" aria-label="Playback speed">1× / 10×</button><span class="divider">//</span><button id="export" class="export" aria-label="Export model"><span>EXPORT</span>${icon('download')}</button></div>
</header>
<main class="workspace">
  <section class="stage" aria-label="Interactive watch study">
    <div id="viewport" tabindex="0" role="img" aria-label="3D Submariner-inspired watch. Drag to rotate; scroll to zoom. Arrow keys orbit and plus or minus keys zoom."><span class="loading">Preparing the watch…</span></div>
    <div class="stage-heading"><div class="kicker">ROLEX / OYSTER PERPETUAL / REF. 126610LV</div><h1>SUBMARINER<span>DECONSTRUCTED</span></h1><p>A mechanical icon, part by part.<br>Explore the construction.<br>Time in motion. T = <span id="elapsed">0.0</span> S</p></div>
    <div class="live-readout"><div><span class="live-dot"></span><b id="running-status">MECHANISM RUNNING</b></div><div>CALIBRE <b>3235</b></div><div><b id="mesh-count">—</b> MESHES / 09 ASSEMBLIES</div><div>ILLUSTRATIVE RECONSTRUCTION</div></div>
    <div id="section-note" class="section-note" hidden>HALF-SECTION<br>Outer shell cut away to reveal the movement.</div>
    <svg id="leaders" class="leader-lines" aria-hidden="true" hidden></svg><div id="annotations" class="annotations" hidden>${componentInfo.map((p,i)=>`<button class="annotation" data-label="${p.id}" aria-label="Inspect ${p.name}"><span>${String(i+1).padStart(2,'0')}</span>${p.name}</button>`).join('')}</div>
    <section class="wave-panel" aria-label="Illustrative balance motion"><h2>BALANCE<br>OSCILLATION <span>4 Hz</span></h2><svg viewBox="0 0 220 85" role="img" aria-label="Illustrative four hertz oscillation"><path class="chart-grid" d="M0 15H220M0 42.5H220M0 70H220M0 0V85M55 0V85M110 0V85M165 0V85M220 0V85"/><path id="wave" class="wave" d="M0 42.5H220"/></svg><p>THE BALANCE SETS THE RHYTHM.<br>ILLUSTRATIVE MOTION, NOT MEASURED DATA.</p></section>
    <div class="stage-bottom"><div class="camera-tools"><button class="reset" id="reset">RESET VIEW ↗</button><button class="zoom" id="zoom-out" aria-label="Zoom out">−</button><button class="zoom" id="zoom-in" aria-label="Zoom in">+</button><button class="reset" id="front" aria-label="Front view">FRONT</button></div><div class="orbit-control"><label for="orbit">ROTATE THE MODEL</label><input id="orbit" type="range" min="-180" max="180" value="24" step="1" aria-label="Rotate model"><output id="angle" for="orbit">24°</output></div></div>
    <div class="stage-caption">INDEPENDENT VISUAL STUDY. NOT AFFILIATED WITH ROLEX.</div>
  </section>
  <aside class="inspector" aria-label="Watch instruments">
    <section class="panel"><h2><span class="index">01</span> ASSEMBLY <small>EXPLODED VIEW</small></h2><label class="control-title" for="explosion">SEPARATION <output id="percentage">0%</output></label><div class="range-scale"><span>0</span><span>50</span><span>100 %</span></div><input type="range" id="explosion" min="0" max="100" step="0.1" value="0" aria-label="Assembly separation" aria-valuetext="Fully assembled"><p>Lift the crystal, separate the dial, and reveal the mechanism inside.</p><div class="panel-actions"><button class="sequence" id="play" aria-label="Play assembly animation" aria-pressed="false">${icon('play')} PLAY SEQUENCE</button><button id="assemble">REASSEMBLE</button></div><div class="metrics"><div class="metric"><span>ASSEMBLIES</span><strong>09</strong></div><div class="metric"><span>CASE</span><strong>41</strong><small>mm</small></div><div class="metric"><span>RESERVE</span><strong>70</strong><small>h</small></div></div></section>
    <section class="panel"><h2><span class="index">02</span> THE MOVEMENT <small>CALIBRE 3235</small></h2><div class="run-state"><span id="motion-label">SELF-WINDING / IN MOTION</span><button id="inspect-movement">INSPECT ↗</button></div><div class="transmission"><span>SECONDS<b>60 s / REV</b></span><span>→</span><span>MINUTES<b>60 min / REV</b></span><span>→</span><span>HOURS<b>12 h / REV</b></span></div><p>The winding rotor feeds the mainspring. The gear train carries energy to the hands, regulated by the balance.</p><p class="small-note">The internal geometry and gear motion are an interpretation, not a service schematic.</p></section>
    <section class="panel components-panel"><h2><span class="index">03</span> COMPONENTS <small>SELECT TO INSPECT</small></h2><div class="part-list">${componentInfo.map((p,i)=>`<button class="part-button" data-part="${p.id}" aria-pressed="false"><span class="number">${String(i+1).padStart(2,'0')}</span>${p.name}<span class="swatch"></span></button>`).join('')}</div><div class="part-details" aria-live="polite"><h3 class="selected-name" id="detail-title">Inside the Oyster.</h3><span class="material-tag" id="detail-material">A SYSTEM OF NINE ASSEMBLIES</span><p id="detail-description">Select a name or click a part of the watch to explore its construction.</p><div class="panel-actions"><button id="isolate" hidden>ISOLATE PART</button><button id="clear" hidden>CLEAR</button></div></div></section>
    <section class="panel reference-panel"><h2><span class="index">04</span> REFERENCE <small>126610LV</small></h2><div class="reference-row"><span>CASE MATERIAL</span><b>Oystersteel</b></div><div class="reference-row"><span>BEZEL INSERT</span><b>Green ceramic</b></div><div class="reference-row"><span>WATER RESISTANCE</span><b>300 m</b></div><div class="reference-row"><span>WINDING</span><b>Automatic</b></div><p class="small-note">Published specifications describe the real watch. This model uses illustrative geometry.</p></section>
    <footer class="inspector-footer">A SUBMARINER, FROM THE INSIDE.<br>An independent interactive reconstruction.<div class="links"><button id="references">ABOUT / SOURCES ↗</button><a href="https://www.rolex.com/watches/submariner/m126610lv-0002" target="_blank" rel="noopener noreferrer">ROLEX REFERENCE ↗</a></div></footer>
  </aside>
</main>
<div class="tooltip" id="tooltip" hidden></div><div class="toast" role="status" id="toast" hidden></div>
<dialog id="about-dialog" aria-labelledby="about-title"><button class="close-dialog" aria-label="Close about this study">${icon('close')}</button><div class="kicker">DESIGN / GEOMETRY / MATERIALS</div><h2 id="about-title">Inside the Submariner.</h2><p>An independent, interactive interpretation of the Rolex Submariner Date 126610LV. The white technical workspace takes its visual direction from your Millrace reference.</p><ul><li><a href="https://www.rolex.com/watches/submariner/m126610lv-0002" target="_blank" rel="noopener noreferrer">Rolex · Submariner Date 126610LV ↗</a><small>Case, dial, bracelet and published specifications.</small></li><li><a href="https://www.rolex.com/watches/submariner/features" target="_blank" rel="noopener noreferrer">Rolex · Submariner features ↗</a><small>Automatic winding, materials and calibre 3235.</small></li><li><a href="https://x.com/konstantinsaifo/status/2106786935951745338" target="_blank" rel="noopener noreferrer">Raptor 3 exploded assembly · Konstantin Saifoulline ↗</a><small>The original separating-parts interaction reference.</small></li><li><a href="https://polyhaven.com/a/studio_small_09" target="_blank" rel="noopener noreferrer">Studio Small 09 · Sergej Majboroda / Poly Haven ↗</a><small>CC0 studio HDR lighting, bundled locally.</small></li></ul><p>The geometry, gear layout, and oscillation are illustrative, not a manufacturing model or a physical simulation. Export saves the visible watch as a GLB mesh file. Rolex names and marks belong to their respective owner.</p></dialog>`;

const $=selector=>document.querySelector(selector);
const viewport=$('#viewport');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});}
catch(error){viewport.innerHTML='<div class="error">Enable hardware acceleration to view this 3D study.<button onclick="location.reload()">Reload viewer</button></div>';throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setClearColor(0xffffff,1);
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1;
renderer.localClippingEnabled=true;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
viewport.replaceChildren(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0xffffff);
const camera=new THREE.PerspectiveCamera(35,1,.1,100);
const home=new THREE.Vector3(7,5,19);
camera.position.copy(home);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=!reduced.matches;controls.dampingFactor=.08;controls.enablePan=false;controls.minDistance=3.5;controls.maxDistance=38;
const pmrem=new THREE.PMREMGenerator(renderer);
const room=new RoomEnvironment();const studioFallback=pmrem.fromScene(room,.025);scene.environment=studioFallback.texture;room.dispose();pmrem.dispose();
scene.environmentIntensity=1;
let studioTexture=null,disposed=false;
new HDRLoader().load(`${import.meta.env.BASE_URL}textures/studio_small_09_2k.hdr`,texture=>{if(disposed){texture.dispose();return;}texture.mapping=THREE.EquirectangularReflectionMapping;scene.environment=texture;scene.environmentRotation.set(.1,.45,0);studioTexture=texture;studioFallback.dispose();dirty=true;},undefined,()=>notify('Studio lighting could not load. Refresh to retry.'));
scene.add(new THREE.HemisphereLight(0xffffff,0x92999d,.5));
const key=new THREE.DirectionalLight(0xffffff,2.1);key.position.set(-5,9,10);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:1,far:35});key.shadow.bias=-.00025;key.shadow.normalBias=.015;scene.add(key);
const rim=new THREE.DirectionalLight(0xe4ebff,.6);rim.position.set(5,-4,-3);scene.add(rim);
const watch=buildWatch();watch.root.rotation.z=-.29;scene.add(watch.root);$('#mesh-count').textContent=watch.meshCount;
const sectionPlane=new THREE.Plane(new THREE.Vector3(-1,0,0),.16);
const sectionParts=new Set(['case','caseback','dial','crystal','bezel']);
const materialList=[];
for(const [id,part] of watch.parts){const cloned=new Map();part.traverse(object=>{if(!object.isMesh)return;const convert=material=>{if(!cloned.has(material)){const copy=material.clone();copy.userData.sectionShell=sectionParts.has(id);cloned.set(material,copy);materialList.push(copy);}return cloned.get(material);};object.material=Array.isArray(object.material)?object.material.map(convert):convert(object.material);});}
const outline=new THREE.BoxHelper(new THREE.Object3D(),0x21734d);outline.material.transparent=true;outline.material.opacity=.4;outline.visible=false;scene.add(outline);
let target=0,current=0,selected=null,isolated=false,section=false,wireframe=false,names=false;
let running=!reduced.matches,speed=1,simulationTime=0,playing=false,playStart=0,playFrom=0,playTo=1;
let dirty=true,last=performance.now(),lastReadout=0,animationFrame,toastTimer,pointerDown=null;
const raycaster=new THREE.Raycaster();const mouse=new THREE.Vector2();
function notify(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4000);}
function resize(){const {width,height}=viewport.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.setViewOffset(width,height,width>650?-width*.08:0,0,width,height);camera.updateProjectionMatrix();dirty=true;}
const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(viewport);resize();
function updateRange(){const value=Math.round(target*1000)/10;$('#explosion').value=value;$('#explosion').style.setProperty('--progress',`${value}%`);$('#percentage').value=`${Math.round(value)}%`;$('#explode').setAttribute('aria-pressed',String(target>.5));$('#explosion').setAttribute('aria-valuetext',value===0?'Fully assembled':value===100?'Fully exploded':`${Math.round(value)} percent separated`);}
function stopPlay(){playing=false;$('#play').innerHTML=`${icon('play')} PLAY SEQUENCE`;$('#play').setAttribute('aria-label','Play assembly animation');$('#play').setAttribute('aria-pressed','false');}
function setTarget(value){target=THREE.MathUtils.clamp(value,0,1);updateRange();if(reduced.matches)current=target;dirty=true;}
function setRunning(value){running=value;$('#run').textContent=running?'PAUSE':'PLAY';$('#run').setAttribute('aria-label',running?'Pause mechanism':'Play mechanism');$('#run').setAttribute('aria-pressed',String(running));$('#running-status').textContent=running?'MECHANISM RUNNING':'MECHANISM PAUSED';$('#motion-label').textContent=running?'SELF-WINDING / IN MOTION':'SELF-WINDING / PAUSED';dirty=true;}
function setSection(value){section=value;$('#section').setAttribute('aria-pressed',String(value));$('#section-note').hidden=!value;for(const m of materialList){m.clippingPlanes=value&&m.userData.sectionShell?[sectionPlane]:[];m.clipShadows=true;m.needsUpdate=true;}dirty=true;}
function homeView(front=false){controls.target.set(0,0,0);camera.position.copy(front?new THREE.Vector3(0,0,21):home);controls.update();dirty=true;}
function focusPart(){watch.root.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(watch.parts.get(selected));const center=bounds.getCenter(new THREE.Vector3());const distance=Math.max(5,bounds.getSize(new THREE.Vector3()).length()*1.9);const direction=camera.position.clone().sub(controls.target).normalize();controls.target.copy(center);camera.position.copy(center).addScaledVector(direction,distance);controls.update();dirty=true;}
function selectPart(id){if(isolated)homeView();selected=id;isolated=false;watch.select(id);for(const b of document.querySelectorAll('[data-part],[data-label]'))b.setAttribute('aria-pressed',String((b.dataset.part||b.dataset.label)===id));const p=componentInfo.find(p=>p.id===id);$('#detail-title').textContent=p?.name||'Inside the Oyster.';$('#detail-material').textContent=p?.material||'A SYSTEM OF NINE ASSEMBLIES';$('#detail-description').textContent=p?.description||'Select a name or click a part of the watch to explore its construction.';$('#isolate').hidden=!p;$('#clear').hidden=!p;$('#isolate').textContent='ISOLATE PART';outline.visible=!!id;if(id){if(target<.25){stopPlay();setTarget(.85);}outline.setFromObject(watch.parts.get(id));}dirty=true;}
function zoom(factor){const direction=camera.position.clone().sub(controls.target);direction.setLength(THREE.MathUtils.clamp(direction.length()*factor,controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(direction);controls.update();dirty=true;}
function reset(){stopPlay();selectPart(null);setTarget(0);setSection(false);if(wireframe)$('#wireframe').click();homeView();}
$('#explosion').addEventListener('input',event=>{stopPlay();setTarget(Number(event.target.value)/100);});
$('#explode').addEventListener('click',()=>{stopPlay();setTarget(target>.5?0:1);if(isolated){isolated=false;watch.select(selected);$('#isolate').textContent='ISOLATE PART';homeView();}});
$('#assemble').addEventListener('click',()=>{stopPlay();if(isolated)selectPart(null);setTarget(0);homeView();});
$('#play').addEventListener('click',()=>{if(playing){stopPlay();return;}if(isolated)selectPart(null);if(reduced.matches){setTarget(target>.5?0:1);return;}playing=true;playStart=performance.now();playFrom=current;playTo=current>.5?0:1;$('#play').innerHTML=`${icon('pause')} PAUSE SEQUENCE`;$('#play').setAttribute('aria-label','Pause assembly animation');$('#play').setAttribute('aria-pressed','true');});
$('#section').addEventListener('click',()=>setSection(!section));
$('#wireframe').addEventListener('click',()=>{wireframe=!wireframe;for(const m of materialList){m.wireframe=wireframe;m.needsUpdate=true;}$('#wireframe').setAttribute('aria-pressed',String(wireframe));dirty=true;});
$('#names').addEventListener('click',()=>{names=!names;$('#names').setAttribute('aria-pressed',String(names));$('#annotations').hidden=!names;$('#leaders').hidden=!names;dirty=true;});
$('#run').addEventListener('click',()=>setRunning(!running));$('#speed').addEventListener('click',()=>{speed=speed===1?10:1;$('#speed').textContent=speed===1?'1× / 10×':'10× / 1×';$('#speed').setAttribute('aria-label',`Playback speed ${speed} times`);dirty=true;});
for(const button of document.querySelectorAll('[data-part],[data-label]'))button.addEventListener('click',()=>{const id=button.dataset.part||button.dataset.label;selectPart(id===selected?null:id);});
$('#inspect-movement').addEventListener('click',()=>{selectPart('movement');setSection(true);});
$('#clear').addEventListener('click',()=>selectPart(null));
$('#isolate').addEventListener('click',()=>{isolated=!isolated;watch.select(selected,isolated);outline.visible=!!selected&&!isolated;$('#isolate').textContent=isolated?'SHOW ASSEMBLY':'ISOLATE PART';if(isolated){setSection(false);focusPart();}else homeView();dirty=true;});
$('#reset').addEventListener('click',reset);$('#front').addEventListener('click',()=>homeView(true));$('#zoom-in').addEventListener('click',()=>zoom(.85));$('#zoom-out').addEventListener('click',()=>zoom(1.18));
$('#orbit').addEventListener('input',event=>{const spherical=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));spherical.theta=Number(event.target.value)*Math.PI/180;camera.position.setFromSpherical(spherical).add(controls.target);controls.update();dirty=true;});
$('#references').addEventListener('click',()=>$('#about-dialog').showModal());$('.close-dialog').addEventListener('click',()=>$('#about-dialog').close());
$('#about-dialog').addEventListener('click',event=>{if(event.target!==event.currentTarget)return;const b=event.currentTarget.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)event.currentTarget.close();});
$('#export').addEventListener('click',async()=>{const button=$('#export');button.disabled=true;try{const {GLTFExporter}=await import('three/addons/exporters/GLTFExporter.js');const data=await new GLTFExporter().parseAsync(watch.root,{binary:true,onlyVisible:true});const url=URL.createObjectURL(new Blob([data],{type:'model/gltf-binary'}));const link=document.createElement('a');link.href=url;link.download=`submariner-study-${Math.round(current*100)}pct.glb`;link.click();setTimeout(()=>URL.revokeObjectURL(url),30000);notify(section?'GLB exported. The live section cut is a display effect and is not baked into the mesh.':'Current visible assembly exported as GLB.');}catch(error){console.error(error);notify('Export failed. Please try again.');}finally{button.disabled=false;}});
function hit(event){const rect=renderer.domElement.getBoundingClientRect();mouse.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(mouse,camera);const hits=raycaster.intersectObjects([...watch.parts.values()].filter(p=>p.visible),true);for(const h of hits){let p=h.object;while(p&&!p.userData.partId)p=p.parent;if(!p||p.userData.partId==='crystal')continue;if(section&&sectionParts.has(p.userData.partId)&&sectionPlane.distanceToPoint(h.point)<0)continue;return p.userData.partId;}return null;}
renderer.domElement.addEventListener('pointerdown',event=>{pointerDown={x:event.clientX,y:event.clientY};$('#tooltip').hidden=true;});
renderer.domElement.addEventListener('pointerup',event=>{if(pointerDown&&Math.hypot(event.clientX-pointerDown.x,event.clientY-pointerDown.y)<5){const id=hit(event);if(id)selectPart(id===selected?null:id);}pointerDown=null;});
renderer.domElement.addEventListener('pointercancel',()=>pointerDown=null);
renderer.domElement.addEventListener('pointerleave',()=>{$('#tooltip').hidden=true;pointerDown=null;});
renderer.domElement.addEventListener('pointermove',event=>{if(pointerDown||event.pointerType==='touch')return;const id=hit(event);const tip=$('#tooltip');tip.hidden=!id;if(id){tip.textContent=componentInfo.find(p=>p.id===id).name;tip.style.left=`${Math.min(innerWidth-190,event.clientX+14)}px`;tip.style.top=`${event.clientY+18}px`;}});
viewport.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(event.key))return;event.preventDefault();const spherical=new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));if(event.key==='ArrowLeft')spherical.theta-=.1;if(event.key==='ArrowRight')spherical.theta+=.1;if(event.key==='ArrowUp')spherical.phi=Math.max(.1,spherical.phi-.1);if(event.key==='ArrowDown')spherical.phi=Math.min(Math.PI-.1,spherical.phi+.1);camera.position.setFromSpherical(spherical).add(controls.target);if(event.key==='+')zoom(.9);if(event.key==='-')zoom(1.1);controls.update();dirty=true;});
controls.addEventListener('change',()=>{dirty=true;const angle=Math.round(Math.atan2(camera.position.x-controls.target.x,camera.position.z-controls.target.z)*180/Math.PI);$('#orbit').value=angle;$('#angle').value=`${angle}°`;});
controls.addEventListener('start',()=>$('#tooltip').hidden=true);
reduced.addEventListener('change',()=>{controls.enableDamping=!reduced.matches;if(reduced.matches){stopPlay();setRunning(false);current=target;dirty=true;}});
renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();notify('The graphics context was interrupted. Reload to restore the viewer.');});
function labels(){const rect=viewport.getBoundingClientRect();const projected=[];watch.root.updateMatrixWorld(true);for(const info of componentInfo){const part=watch.parts.get(info.id);const element=document.querySelector(`[data-label="${info.id}"]`);element.hidden=!part.visible;if(!part.visible)continue;const p=new THREE.Vector3(info.id==='bracelet'?.95:1.7,info.id==='bracelet'?3.3:0,0);part.localToWorld(p);p.project(camera);if(p.z>1||p.z< -1){element.hidden=true;continue;}const x=(p.x+1)*.5*rect.width,y=(1-p.y)*.5*rect.height;projected.push({element,x,y});}
  const top=viewport.offsetTop,compact=rect.width<520,minY=compact?top+10:180,maxY=top+rect.height-(compact?30:120);
  projected.sort((a,b)=>a.y-b.y);const spacing=Math.min(compact?24:28,(maxY-minY)/Math.max(1,projected.length-1));let previous=minY-spacing;
  for(const p of projected){p.labelY=Math.max(THREE.MathUtils.clamp(p.y+top,minY,maxY),previous+spacing);previous=p.labelY;}
  let next=maxY+spacing;for(let i=projected.length-1;i>=0;i--){projected[i].labelY=Math.min(projected[i].labelY,next-spacing);next=projected[i].labelY;}
  let paths='';for(const p of projected){const y=p.labelY,x=THREE.MathUtils.clamp(p.x+42,10,rect.width-p.element.offsetWidth-12);p.element.style.transform=`translate(${Math.round(x)}px,${Math.round(y)}px)`;paths+=`<path d="M${p.x.toFixed(1)} ${(p.y+top).toFixed(1)} L${(x-12).toFixed(1)} ${(y+10).toFixed(1)} H${x.toFixed(1)}"/>`;}
  $('#leaders').innerHTML=paths;
}
function readout(){ $('#elapsed').textContent=simulationTime.toFixed(1);let d='';for(let i=0;i<=110;i++){const x=i*2;const y=42.5-Math.sin((simulationTime+i/110)*Math.PI*8)*25;d+=`${i?'L':'M'}${x} ${y.toFixed(2)} `;}$('#wave').setAttribute('d',d);}
function frame(now){animationFrame=requestAnimationFrame(frame);if(document.hidden){last=now;return;}const dt=Math.min((now-last)/1000,.05);last=now;
  if(running){simulationTime+=dt*speed;watch.animate(simulationTime);dirty=true;}
  if(playing){const progress=Math.min((now-playStart)/5500,1);target=THREE.MathUtils.lerp(playFrom,playTo,progress*progress*(3-2*progress));current=target;updateRange();dirty=true;if(progress===1)stopPlay();}
  if(Math.abs(target-current)>.0001){current=THREE.MathUtils.damp(current,target,4.5,dt);dirty=true;}
  watch.explode(current);watch.root.rotation.y=-current*.45;
  const nextZoom=isolated?1:1/(1+current*.2);if(Math.abs(camera.zoom-nextZoom)>.00001){camera.zoom=nextZoom;camera.updateProjectionMatrix();dirty=true;}
  watch.root.updateMatrixWorld(true);sectionPlane.set(new THREE.Vector3(-1,0,0),.16).applyMatrix4(watch.root.matrixWorld);
  if(selected&&outline.visible)outline.setFromObject(watch.parts.get(selected));controls.update(dt);
  if(now-lastReadout>80){if(running||dirty)readout();lastReadout=now;}
  if(dirty){if(names)labels();renderer.render(scene,camera);dirty=false;}
}
setRunning(running);updateRange();readout();requestAnimationFrame(frame);
window.addEventListener('pagehide',event=>{if(event.persisted)return;disposed=true;cancelAnimationFrame(animationFrame);resizeObserver.disconnect();controls.dispose();const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(object=>{if(object.geometry)geometries.add(object.geometry);if(object.material)(Array.isArray(object.material)?object.material:[object.material]).forEach(m=>materials.add(m));});for(const m of materials){Object.values(m).filter(v=>v?.isTexture).forEach(t=>textures.add(t));m.dispose();}geometries.forEach(g=>g.dispose());textures.forEach(t=>t.dispose());studioTexture?.dispose();studioFallback.dispose();renderer.dispose();});
