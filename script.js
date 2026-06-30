// NAV scroll
const nav=document.getElementById('nav');
const btt=document.getElementById('btt');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('up',scrollY>40);
  btt.classList.toggle('show',scrollY>500);
},{passive:true});

// Hamburger
const burger=document.getElementById('burger');
const mnav=document.getElementById('mnav');
const ov=document.getElementById('ov');
function tog(open){
  burger.classList.toggle('open',open);
  mnav.classList.toggle('open',open);
  ov.classList.toggle('on',open);
  burger.setAttribute('aria-expanded',String(open));
  document.body.style.overflow=open?'hidden':'';
}
burger.addEventListener('click',()=>tog(!mnav.classList.contains('open')));
ov.addEventListener('click',()=>tog(false));
document.querySelectorAll('.mnav-links a, .mnav-cta a').forEach(a=>a.addEventListener('click',()=>tog(false)));
window.addEventListener('resize',()=>{if(innerWidth>600)tog(false)},{passive:true});

// Scroll reveal
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target);}});
},{threshold:.1,rootMargin:'0px 0px -36px 0px'});
document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el=>io.observe(el));

// Counter
function animCount(el,target,dec=false){
  const dur=1400,s=performance.now();
  const tick=now=>{
    const t=Math.min((now-s)/dur,1);
    const ease=1-Math.pow(1-t,3);
    el.textContent=dec?(ease*target).toFixed(1):Math.floor(ease*target);
    if(t<1)requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const cio=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target;
    animCount(el,+el.dataset.t,el.classList.contains('cntd'));
    cio.unobserve(el);
  });
},{threshold:.5});
document.querySelectorAll('.cnt,.cntd').forEach(el=>cio.observe(el));

// Back to top
btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// Galerie dots + auto-scroll
(function(){
  const strip = document.getElementById('galerie');
  const dots  = document.querySelectorAll('.gallery-dots span');
  if(!strip || !dots.length) return;

  const count = dots.length;
  let cur = 0, timer, isDragging = false;

  function goTo(n){
    cur = (n + count) % count;
    strip.scrollTo({ left: cur * strip.scrollWidth / count, behavior: 'smooth' });
    dots.forEach((d,i) => d.classList.toggle('act', i === cur));
  }

  function start(){ timer = setInterval(() => goTo(cur + 1), 3000); }
  function stop(){  clearInterval(timer); }

  // Sync dots on manual scroll
  strip.addEventListener('scroll', () => {
    const idx = Math.round(strip.scrollLeft / (strip.scrollWidth / count));
    cur = idx;
    dots.forEach((d,i) => d.classList.toggle('act', i === idx));
  }, { passive: true });

  // Pause auto-scroll on touch
  strip.addEventListener('touchstart', () => { stop(); isDragging = true; }, { passive: true });
  strip.addEventListener('touchend',   () => { isDragging = false; start(); }, { passive: true });

  dots.forEach((d,i) => d.addEventListener('click', () => { stop(); goTo(i); start(); }));
  start();
})();

// Hero slideshow
(function(){
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if(!slides.length) return;
  let cur = 0, timer;

  function goTo(n){
    slides[cur].classList.remove('active');
    if(dots[cur]) dots[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    if(dots[cur]) dots[cur].classList.add('active');
  }

  function start(){ timer = setInterval(()=>goTo(cur+1), 5000); }
  function stop(){  clearInterval(timer); }

  dots.forEach((d,i)=>d.addEventListener('click',()=>{ stop(); goTo(i); start(); }));
  start();
})();

// Toggle voir plus menu
function toggleMenu(){
  const btn = document.getElementById('voirPlusBtn');
  const hidden = document.querySelectorAll('.plat-hidden');
  const isOpen = btn.classList.contains('open');
  btn.classList.toggle('open', !isOpen);
  btn.innerHTML = isOpen
    ? 'Voir plus de plats <i class="arrow">▼</i>'
    : 'Voir moins <i class="arrow">▼</i>';
  hidden.forEach(el => {
    el.classList.toggle('shown', !isOpen);
    if(!isOpen){
      // Déclencher les animations reveal
      setTimeout(()=>{ el.classList.add('reveal'); el.classList.add('on'); }, 50);
    }
  });
  if(isOpen){
    // Scroller vers le haut de la section menu
    document.getElementById('menu').scrollIntoView({behavior:'smooth', block:'start'});
  }
}

// ── Animation GSAP "miam" sur l'emoji 😋 ──
(function() {

  // 1. CSS fallback — fonctionne toujours, même sans CDN
  const style = document.createElement('style');
  style.textContent = `
    @keyframes miamCSS {
      0%           { transform: scale(1)    rotate(0deg)   translateY(0); }
      12%          { transform: scale(1.5)  rotate(18deg)  translateY(-12px); }
      22%          { transform: scale(0.85) rotate(-10deg) translateY(3px); }
      32%          { transform: scale(1.25) rotate(6deg)   translateY(-6px); }
      40%          { transform: scale(1.05) rotate(-3deg)  translateY(-2px); }
      52%          { transform: scale(1)    rotate(0deg)   translateY(0); }
      100%         { transform: scale(1)    rotate(0deg)   translateY(0); }
    }
    #miamEmoji {
      display: inline-block;
      transform-origin: center bottom;
      animation: miamCSS 2.8s ease-in-out infinite;
      animation-delay: .5s;
      cursor: default;
    }
  `;
  document.head.appendChild(style);

  // 2. GSAP enhancement — si le CDN répond, on remplace par la version JS
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
  s.onload = function() {
    const el = document.getElementById('miamEmoji');
    if (!el || typeof gsap === 'undefined') return;
    // Désactiver le CSS pour laisser GSAP prendre le relais
    el.style.animation = 'none';
    gsap.timeline({ repeat: -1, repeatDelay: 1.4, defaults: { ease: 'power2.inOut' } })
      .to(el, { scale: 1.5,  rotate: 18,  y: -12, duration: 0.22, ease: 'back.out(2.5)' })
      .to(el, { scale: 0.85, rotate: -10, y: 3,   duration: 0.18 })
      .to(el, { scale: 1.25, rotate: 6,   y: -6,  duration: 0.16, ease: 'back.out(2)' })
      .to(el, { scale: 1.05, rotate: -3,  y: -2,  duration: 0.14 })
      .to(el, { scale: 1,    rotate: 0,   y: 0,   duration: 0.35, ease: 'elastic.out(1.2, 0.4)' });
  };
  s.onerror = function() {
    // CDN bloqué → la CSS animation tourne déjà, rien à faire
    console.info('GSAP CDN indisponible — animation CSS active');
  };
  document.head.appendChild(s);
})();

