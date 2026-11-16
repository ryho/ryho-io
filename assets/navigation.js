document.querySelectorAll('nav').forEach(nav=>{
 const button=nav.querySelector('.nav-toggle');
 const panel=nav.querySelector('.nav-panel');
 if(!button||!panel)return;
 nav.classList.add('js-nav');
 const close=()=>{panel.classList.remove('is-open');button.setAttribute('aria-expanded','false');};
 button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));panel.classList.toggle('is-open',open);});
 nav.addEventListener('keydown',event=>{if(event.key==='Escape'&&button.getAttribute('aria-expanded')==='true'){close();button.focus();}});
 panel.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
 document.addEventListener('click',event=>{if(!nav.contains(event.target))close();});
 window.matchMedia('(max-width:1000px)').addEventListener('change',close);
});
