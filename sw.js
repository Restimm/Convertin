const V='convertin-v1';
const SHELL=['./','index.html','manifest.json','logo.jpg','icon-192.png','icon-512.png'];
const HOSTS=['cdn.tailwindcss.com','cdnjs.cloudflare.com','fonts.googleapis.com','fonts.gstatic.com','cdn.jsdelivr.net'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==V).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put('index.html',cp));return res}).catch(()=>caches.match('index.html')));
    return;
  }
  if(u.origin===location.origin||HOSTS.includes(u.hostname)){
    e.respondWith(caches.open(V).then(c=>c.match(r).then(hit=>{
      const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>hit);
      return hit||net;
    })));
  }
});