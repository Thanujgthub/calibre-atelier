import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const componentInfo = [
  { id:'crystal', name:'Sapphire crystal', material:'Sapphire', description:'A clear protective window above the dial. The raised Cyclops lens sits over the date display.', detail:'Scratch-resistant crystal', offset:[0,0,5.8] },
  { id:'bezel', name:'Ceramic bezel', material:'Ceramic · steel', description:'A green, graduated diving bezel with a finely knurled steel edge. Its 60-minute scale frames the dial.', detail:'Unidirectional · 60 minutes', offset:[0,0,4.3] },
  { id:'hands', name:'Hands & pinion', material:'Metal · luminous fill', description:'Three hands share a central axis. The distinctive hour hand and long minute hand make the time immediately legible.', detail:'Hours · minutes · seconds', offset:[0,0,3.1] },
  { id:'dial', name:'Dial & hour markers', material:'Black dial · luminous fill', description:'A black dial, applied luminous markers, and a date aperture form the face of the Submariner Date.', detail:'Chromalight-inspired markers', offset:[0,0,2.1] },
  { id:'movement', name:'Mechanical movement', material:'Brass · steel · jewels', description:'An illustrative arrangement of the barrel, gear train, balance, and bridges. Inspired by calibre 3235; not a technical reconstruction.', detail:'Reference calibre · 3235', offset:[0,0,.6] },
  { id:'rotor', name:'Winding rotor', material:'Brushed metal', description:'The semi-circular rotor turns with wrist movement to wind an automatic watch. The open shape reveals the mechanism beneath it.', detail:'Perpetual self-winding', offset:[0,0,-1.1] },
  { id:'case', name:'Oyster case & crown', material:'Oystersteel reference', description:'The middle case surrounds the movement. Four tapered lugs meet the bracelet, while crown guards protect the winding crown.', detail:'Reference case diameter · 41 mm', offset:[0,0,-2.5] },
  { id:'caseback', name:'Screw-down case back', material:'Steel', description:'A solid, screw-down back closes the Oyster case. Its fine fluting provides a gripping surface for a servicing tool.', detail:'Solid case back', offset:[0,0,-3.8] },
  { id:'bracelet', name:'Oyster bracelet', material:'Brushed steel', description:'Three-piece links form the Oyster bracelet. The broad centre links are framed by narrower outer links.', detail:'Three-piece link construction', offset:[0,0,0] },
];

export function buildWatch() {
  const root = new THREE.Group(); root.name = 'Submariner — independent visual study';
  const parts = new Map(); const moving = []; const gears = [];
  const grainCanvas=document.createElement('canvas');grainCanvas.width=grainCanvas.height=512;
  const grainContext=grainCanvas.getContext('2d');grainContext.fillStyle='#d1d1d1';grainContext.fillRect(0,0,512,512);
  let seed=107;for(let i=0;i<2400;i++){seed=(seed*16807)%2147483647;const x=seed%512;const shade=155+seed%85;grainContext.strokeStyle=`rgba(${shade},${shade},${shade},.3)`;grainContext.lineWidth=.4;grainContext.beginPath();grainContext.moveTo(x,0);grainContext.lineTo(x,512);grainContext.stroke();}
  const grain=new THREE.CanvasTexture(grainCanvas);grain.wrapS=grain.wrapT=THREE.RepeatWrapping;grain.anisotropy=8;
  const metal = new THREE.MeshPhysicalMaterial({color:0xd3d7d9,metalness:1,roughness:.23});
  const polished = new THREE.MeshPhysicalMaterial({color:0xe0e3e5,metalness:1,roughness:.115});
  const brushed = new THREE.MeshPhysicalMaterial({color:0xc6cbce,metalness:1,roughness:.5,roughnessMap:grain,bumpMap:grain,bumpScale:.0012,anisotropy:.45});
  const gold = new THREE.MeshStandardMaterial({color:0xc49c4f,metalness:1,roughness:.24});
  const dark = new THREE.MeshStandardMaterial({color:0x101817,metalness:.35,roughness:.35});
  const ceramic = new THREE.MeshPhysicalMaterial({color:0x003b20,metalness:0,roughness:.16,clearcoat:.8,clearcoatRoughness:.08});
  const lume = new THREE.MeshStandardMaterial({color:0xe8eee3,metalness:0,roughness:.5});
  const ruby = new THREE.MeshPhysicalMaterial({color:0xb62453,metalness:.2,roughness:.13,clearcoat:1});
  // Anti-reflective sapphire: a faint specular surface keeps the dial crisp at every viewport size.
  const glass = new THREE.MeshPhysicalMaterial({color:0xeaf5ff,metalness:0,roughness:.06,transparent:true,opacity:.045,depthWrite:false,specularIntensity:.4,side:THREE.DoubleSide});
  function add(parent, geometry, material, name, x=0,y=0,z=0) {
    const mesh = new THREE.Mesh(geometry, material); mesh.name=name; mesh.position.set(x,y,z); mesh.castShadow=material!==glass;mesh.receiveShadow=material!==glass;parent.add(mesh); return mesh;
  }
  function disc(parent,r,h,z,mat=metal,name='Disc',x=0,y=0) {
    const geo=new THREE.CylinderGeometry(r,r,h,80);geo.rotateX(Math.PI/2);return add(parent,geo,mat,name,x,y,z);
  }
  function ring(parent,outer,inner,depth,z,mat=metal,name='Ring') {
    const s=new THREE.Shape();s.absarc(0,0,outer,0,Math.PI*2,false);const h=new THREE.Path();h.absarc(0,0,inner,0,Math.PI*2,true);s.holes.push(h);
    const geo=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.018,bevelThickness:.018,curveSegments:80});geo.translate(0,0,-depth/2);
    return add(parent,geo,mat,name,0,0,z);
  }
  function box(parent,w,h,d,x,y,z,mat=metal,name='Link',radius=.06) {return add(parent,new RoundedBoxGeometry(w,h,d,radius<=.02?2:3,radius),mat,name,x,y,z);}
  function torus(parent,r,t,z,mat=polished,name='Rim',x=0,y=0) {return add(parent,new THREE.TorusGeometry(r,t,10,100),mat,name,x,y,z);}
  function screw(parent,x,y,z,size=.055) {disc(parent,size,.035,z,polished,'Polished screw',x,y);box(parent,size*1.4,.013,.007,x,y,z+.021,dark,'Screw slot',.002);}
  function part(id) {const info=componentInfo.find(p=>p.id===id);const g=new THREE.Group();g.name=info.name;g.userData.partId=id;root.add(g);parts.set(id,g);moving.push({object:g,base:new THREE.Vector3(),offset:new THREE.Vector3(...info.offset)});return g;}
  function texture(draw,size=1024) {const c=document.createElement('canvas');c.width=c.height=size;const ctx=c.getContext('2d');draw(ctx,size);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;}
  const faceTexture=texture((ctx,s)=>{
    ctx.fillStyle='#080d0c';ctx.fillRect(0,0,s,s);ctx.translate(s/2,s/2);
    for(let i=0;i<60;i++){ctx.save();ctx.rotate(i*Math.PI/30);ctx.fillStyle='#bcc4ba';ctx.fillRect(-1.5,-467,3,i%5===0?22:13);ctx.restore();}
    ctx.fillStyle='#e5e8dd';ctx.textAlign='center';
    ctx.font='bold 56px Georgia';ctx.fillText('ROLEX',0,-165);ctx.font='20px Arial';ctx.fillText('OYSTER PERPETUAL DATE',0,-132);
    ctx.font='25px Arial';ctx.fillText('SUBMARINER',0,178);ctx.font='21px Arial';ctx.fillText('1000ft = 300m',0,210);
    ctx.font='15px Arial';ctx.fillText('SUPERLATIVE CHRONOMETER',0,252);ctx.fillText('OFFICIALLY CERTIFIED',0,274);ctx.font='12px Arial';ctx.fillText('SWISS MADE',0,443);
    ctx.strokeStyle='#d9dfc8';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-31,-232);ctx.lineTo(-42,-274);ctx.lineTo(-20,-250);ctx.lineTo(-20,-290);ctx.lineTo(0,-254);ctx.lineTo(0,-301);ctx.lineTo(20,-254);ctx.lineTo(22,-290);ctx.lineTo(30,-251);ctx.lineTo(43,-274);ctx.lineTo(31,-232);ctx.closePath();ctx.stroke();
    ctx.fillStyle='#e1dfcd';ctx.fillRect(300,-43,106,86);ctx.fillStyle='#17201a';ctx.font='61px Georgia';ctx.fillText('25',353,22);
  });
  const bezelTexture=texture((ctx,s)=>{
    ctx.clearRect(0,0,s,s);ctx.translate(s/2,s/2);ctx.strokeStyle='#e7e9da';ctx.fillStyle='#e7e9da';ctx.textAlign='center';ctx.textBaseline='middle';
    for(let i=0;i<60;i++){ctx.save();ctx.rotate(i*Math.PI/30);if(i>0&&i%10===0){ctx.font='500 62px Arial';ctx.fillText(String(i),0,-458);}else if(i>0&&(i<15||i%5===0)){ctx.fillRect(-2.5,-483,5,i%5===0?42:24);}ctx.restore();}
    ctx.beginPath();ctx.moveTo(-23,-483);ctx.lineTo(23,-483);ctx.lineTo(0,-435);ctx.closePath();ctx.fill();
  });

  const caseGroup=part('case');
  const caseProfile=[[1.72,-.42],[1.9,-.42],[2.0,-.3],[2.025,-.15],[2.0,.1],[1.9,.17],[1.74,.17],[1.7,.07],[1.7,-.36],[1.72,-.42]].map(([r,z])=>new THREE.Vector2(r,z));
  const caseGeometry=new THREE.LatheGeometry(caseProfile,144);caseGeometry.rotateX(Math.PI/2);add(caseGroup,caseGeometry,polished,'Sculpted Oyster middle case');
  torus(caseGroup,1.75,.035,.15,polished,'Inner rehaut');
  for(const sy of [-1,1]) for(const sx of [-1,1]) {
    const profile=new THREE.Shape();profile.moveTo(sx*.8,sy*1.48);profile.quadraticCurveTo(sx*1.15,sy*1.35,sx*1.64,sy*1.18);profile.quadraticCurveTo(sx*1.62,sy*1.75,sx*1.3,sy*2.3);profile.lineTo(sx*.93,sy*2.27);profile.quadraticCurveTo(sx*1.02,sy*1.83,sx*.8,sy*1.48);profile.closePath();
    add(caseGroup,new THREE.ExtrudeGeometry(profile,{depth:.38,bevelEnabled:true,bevelSize:.035,bevelThickness:.035,bevelSegments:5}),[brushed,polished],'Tapered case lug',0,0,-.36);
  }
  box(caseGroup,.55,.24,.4,2.02,.42,-.06,metal,'Upper crown guard');box(caseGroup,.55,.24,.4,2.02,-.42,-.06,metal,'Lower crown guard');
  const crown=disc(caseGroup,.28,.39,0,polished,'Triplock crown');crown.rotation.y=Math.PI/2;crown.position.set(2.2,0,-.04);
  for(let i=0;i<28;i++){const a=i*Math.PI/14;const ridge=box(caseGroup,.36,.028,.04,2.2,Math.sin(a)*.28,Math.cos(a)*.28-.04,brushed,'Crown fluting',.006);ridge.rotation.x=-a;}
  const back=part('caseback');disc(back,1.82,.15,-.48,brushed,'Solid case back');torus(back,1.7,.08,-.52);ring(back,1.83,1.68,.09,-.46,polished,'Case back fluting');
  for(let i=0;i<64;i++){const a=i*Math.PI/32;const r=box(back,.07,.045,.06,Math.sin(a)*1.8,Math.cos(a)*1.8,-.49,metal,'Case back tooth',.01);r.rotation.z=-a;}

  const bezel=part('bezel');ring(bezel,2.08,1.64,.19,.30,polished,'Knurled bezel mount');ring(bezel,2.02,1.67,.09,.42,ceramic,'Green ceramic insert');
  torus(bezel,2.04,.025,.47,polished);torus(bezel,1.66,.023,.47,polished);
  for(let i=0;i<100;i++){const a=i*Math.PI/50;const tooth=box(bezel,.045,.075,.16,Math.sin(a)*2.075,Math.cos(a)*2.075,.32,metal,'Bezel grip tooth',.009);tooth.rotation.z=-a;}
  const bezelFaceMat=new THREE.MeshStandardMaterial({map:bezelTexture,transparent:true,alphaTest:.1,metalness:.7,roughness:.3,depthWrite:false});add(bezel,new THREE.PlaneGeometry(4.08,4.08),bezelFaceMat,'Bezel minute scale',0,0,.494);
  disc(bezel,.055,.025,.49,lume,'Luminous bezel pearl',0,1.83);

  const dial=part('dial');disc(dial,1.65,.06,.2,dark,'Black dial plate');const faceMat=new THREE.MeshPhysicalMaterial({map:faceTexture,metalness:0,roughness:.32,clearcoat:.35,clearcoatRoughness:.2});add(dial,new THREE.CircleGeometry(1.64,128),faceMat,'Dial typography and date',0,0,.236);
  for(let i=0;i<12;i++) {if(i===3)continue;const a=i*Math.PI/6,x=Math.sin(a)*1.36,y=Math.cos(a)*1.36;
    if(i===0){const shape=new THREE.Shape();shape.moveTo(-.13,1.5);shape.lineTo(.13,1.5);shape.lineTo(0,1.19);shape.closePath();add(dial,new THREE.ExtrudeGeometry(shape,{depth:.045,bevelEnabled:false}),polished,'12 o’clock marker',0,0,.25);const inner=shape.clone();const m=add(dial,new THREE.ShapeGeometry(inner),lume,'12 o’clock luminous insert',0,.13,.3);m.scale.set(.83,.9,1);}
    else if(i===6||i===9){const marker=box(dial,.12,.27,.055,x,y,.27,polished,'Applied hour marker',.025);marker.rotation.z=-a;const infill=box(dial,.073,.22,.02,x,y,.307,lume,'Luminous hour marker',.012);infill.rotation.z=-a;}
    else {disc(dial,.12,.055,.27,polished,'Round hour marker',x,y);disc(dial,.087,.02,.31,lume,'Luminous dot',x,y);}
  }

  const hands=part('hands');
  function hand(angle,length,width,z,name){const g=new THREE.Group();g.name=name;g.rotation.z=angle;hands.add(g);box(g,width,length,.045,0,length*.38,z,polished,name,.025);box(g,width*.48,length*.7,.018,0,length*.4,z+.03,lume,'Luminous hand insert',.01);return g;}
  const hour=hand(Math.PI/3,.92,.11,.34,'Hour hand');disc(hour,.14,.035,.375,polished,'Mercedes hour ring',0,.62);disc(hour,.106,.015,.399,lume,'Mercedes luminous fill',0,.62);
  for(let i=0;i<3;i++){const bar=box(hour,.022,.22,.015,0,.62,.412,polished,'Hour hand spoke',.002);bar.rotation.z=i*Math.PI*2/3;}
  const minute=hand(-Math.PI/3,1.3,.075,.4,'Minute hand');const second=hand(-Math.PI*.9,1.45,.019,.47,'Seconds hand');disc(second,.068,.025,.49,lume,'Seconds luminous dot',0,.98);disc(hands,.08,.09,.47,polished,'Central hand pinion');

  const crystal=part('crystal');disc(crystal,1.635,.075,.56,glass,'Sapphire crystal');
  const crystalEdge=new THREE.MeshPhysicalMaterial({color:0x8faab5,metalness:.25,roughness:.14,transparent:true,opacity:.45,depthWrite:false});
  torus(crystal,1.635,.014,.59,crystalEdge,'Polished crystal edge');
  box(crystal,.43,.33,.095,1.12,0,.64,new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.025,transmission:1,thickness:.2,ior:1.5}),'Cyclops magnifier',.065);

  const movement=part('movement');disc(movement,1.59,.11,-.05,brushed,'Movement mainplate');ring(movement,1.57,1.49,.06,.027,polished,'Movement retaining ring');
  // Small concentric engravings suggest the circular-grained mainplate finish.
  for(let i=0;i<6;i++)torus(movement,.35+i*.2,.006,.012,metal,'Mainplate circular graining');
  function gear(x,y,r,teeth,z) {
    const g=new THREE.Group();g.position.set(x,y,z);movement.add(g);g.name='Gear train wheel';const shape=new THREE.Shape();
    for(let i=0;i<teeth*4;i++){const a=i/(teeth*4)*Math.PI*2,rr=r*(i%4<2?1:.9);const px=Math.sin(a)*rr,py=Math.cos(a)*rr;if(i===0)shape.moveTo(px,py);else shape.lineTo(px,py);}shape.closePath();
    for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const hole=new THREE.Path();hole.absarc(Math.sin(a)*r*.52,Math.cos(a)*r*.52,r*.19,0,Math.PI*2,true);shape.holes.push(hole);}
    add(g,new THREE.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:false}),gold,'Toothed wheel');disc(g,r*.16,.11,.04,polished,'Wheel axle');screw(g,0,0,.1,.04);gears.push(g);return g;
  }
  gear(-.62,.5,.57,46,.045);gear(.16,.73,.31,32,.09);gear(.58,.22,.4,36,.04);gear(.22,-.47,.34,30,.095);gear(-.38,-.73,.28,30,.08);gear(.88,-.61,.38,32,.05);
  disc(movement,.49,.1,.05,brushed,'Mainspring barrel',-.68,.53);torus(movement,.43,.02,.11,gold,'Barrel rim',-.68,.53);screw(movement,-.68,.53,.13,.07);
  const bridge=box(movement,1.32,.32,.11,-.12,.78,.2,brushed,'Barrel bridge',.12);bridge.rotation.z=-.28;
  const trainBridge=box(movement,.28,1.25,.11,.44,-.1,.22,metal,'Train bridge',.1);trainBridge.rotation.z=-.45;
  for(const [x,y] of [[-.65,.9],[.3,.66],[.69,-.56],[-.6,-1.13],[-1.17,-.4],[1.2,.62]]) {screw(movement,x,y,.27);disc(movement,.035,.02,.29,ruby,'Ruby bearing',x+.1,y+.08);}
  const balance=new THREE.Group();balance.name='Oscillating balance assembly';balance.position.set(-.8,-.55,.18);movement.add(balance);
  torus(balance,.36,.028,0,gold,'Balance wheel');
  const springMetal=new THREE.MeshStandardMaterial({color:0x326aa2,metalness:.8,roughness:.25});
  for(let i=0;i<5;i++)torus(balance,.07+i*.046,.007,.02,springMetal,'Blue hairspring');
  for(let i=0;i<3;i++){const spoke=box(balance,.035,.66,.025,0,0,-.01,gold,'Balance wheel spoke',.01);spoke.rotation.z=i*Math.PI/3;}
  screw(balance,0,0,.05,.035);

  for(const child of movement.children) child.position.z-=.33;
  const rotor=part('rotor');
  const rotorShape=new THREE.Shape();rotorShape.absarc(0,0,1.45,Math.PI*.08,Math.PI*.92,false);rotorShape.lineTo(-.3,.2);rotorShape.quadraticCurveTo(0,-.22,.3,.2);rotorShape.closePath();
  const rotorHole=new THREE.Path();rotorHole.absellipse(0,.8,.77,.22,0,Math.PI*2,true);rotorShape.holes.push(rotorHole);
  add(rotor,new THREE.ExtrudeGeometry(rotorShape,{depth:.085,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3}),brushed,'Semi-circular winding mass',0,0,-.26);
  disc(rotor,.23,.13,-.22,polished,'Rotor bearing');torus(rotor,.14,.025,-.14,gold,'Rotor bearing race');screw(rotor,0,0,-.13,.085);

  const bracelet=part('bracelet');
  for(const sign of [-1,1]) {
    for(let i=0;i<7;i++) {
      const g=new THREE.Group();g.name=`${sign>0?'Upper':'Lower'} bracelet link ${i+1}`;bracelet.add(g);
      const y=sign*(2.35+i*.46),z=-.22-Math.pow(i/6,1.7)*1.85;g.position.set(0,y,z);g.rotation.x=-sign*(i/7)*.76;
      const taper=1-i*.025;box(g,.9*taper,.455,.29,0,0,0,[polished,polished,brushed,brushed,brushed,brushed],'Brushed centre link',.03);
      for(const side of [-1,1]) {box(g,.43*taper,.455,.31,side*.69*taper,.025,-.015,[polished,polished,metal,metal,brushed,metal],'Outer Oyster link',.03);}
      const pin=disc(g,.035,1.83*taper,0,polished,'Bracelet hinge pin');pin.rotation.y=Math.PI/2;pin.position.y=.14;
      moving.push({object:g,base:g.position.clone(),offset:new THREE.Vector3(sign*(1.2+i*.12),sign*(.4+i*.1),-1.35-i*.08)});
    }
  }
  let meshCount=0;root.traverse(o=>{if(o.isMesh)meshCount++;});
  function explode(value) {for(const p of moving)p.object.position.copy(p.base).addScaledVector(p.offset,value);}
  function select(id,isolated=false) {
    for(const [key,g] of parts)g.visible=!isolated||!id||key===id;
  }
  function animate(time){second.rotation.z=-Math.PI*.9-time*Math.PI/30;minute.rotation.z=-Math.PI/3-time*Math.PI/1800;hour.rotation.z=Math.PI/3-time*Math.PI/21600;gears.forEach((g,i)=>g.rotation.z=(i%2?1:-1)*time*(.04+i*.013));balance.rotation.z=Math.sin(time*Math.PI*8)*.35;}
  return {root,parts,moving,gears,meshCount,explode,select,animate};
}
