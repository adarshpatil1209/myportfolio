// scripts.js — starfield, planet interactions, and page transitions
(function(){
  const canvas = document.getElementById('starfield');
  const ctx = canvas && canvas.getContext && canvas.getContext('2d');
  let stars = [];

  function resize(){
    if(!canvas) return;
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }

  function initStars(){
    stars = [];
    const count = Math.floor((innerWidth+innerHeight)/10);
    for(let i=0;i<count;i++){
      stars.push({
        x: Math.random()*innerWidth,
        y: Math.random()*innerHeight,
        r: Math.random()*1.5+0.2,
        alpha: Math.random(),
        twinkle: Math.random()*0.02+0.005
      });
    }
  }

  function drawStars(){
    if(!ctx) return;
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for(const s of stars){
      s.alpha += (Math.random()-0.5)*s.twinkle;
      if(s.alpha<0) s.alpha=0; if(s.alpha>1) s.alpha=1;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${s.alpha*0.9})`;
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    }
  }

  function animate(){
    drawStars();
    requestAnimationFrame(animate);
  }

  function setup(){
    if(!canvas || !ctx) return;
    resize();
    initStars();
    animate();
  }

  addEventListener('resize', ()=>{ resize(); initStars(); });

  // planet interactions
  function setupPlanets(){
    const planets = document.querySelectorAll('.planet');
    planets.forEach(p=>{
      // position from inline styles --x and --y
      const x = p.style.getPropertyValue('--x') || '50%';
      const y = p.style.getPropertyValue('--y') || '50%';
      p.style.left = x;
      p.style.top = y;
      // set size
      const size = getComputedStyle(p).getPropertyValue('--size') || '100px';
      const core = p.querySelector('.planet-core');
      if(core) core.style.width = core.style.height = size;

      // parallax on mouse move
      p.addEventListener('mousemove', (ev)=>{
        const rect = p.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const dx = (ev.clientX - cx)/rect.width;
        const dy = (ev.clientY - cy)/rect.height;
        p.style.transform = `translate(-50%,-50%) rotateX(${dy*8}deg) rotateY(${dx*8}deg) translateZ(0)`;
      });
      p.addEventListener('mouseleave', ()=>{ p.style.transform='translate(-50%,-50%)'; });

      // click to navigate with exit animation
      p.addEventListener('click', (ev)=>{
        const target = p.getAttribute('data-target');
        if(!target) return;
        // create overlay at click position and expand to cover screen
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
        const rect = p.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        overlay.style.left = cx + 'px';
        overlay.style.top = cy + 'px';
        // force reflow then open
        requestAnimationFrame(()=> overlay.classList.add('open'));
        // navigate after overlay expands
        setTimeout(()=>{ location.href = target; }, 600);
      });
    });
  }

  // particle emitters for each planet to create aura/particles
  function startPlanetEmitters(){
    const planets = document.querySelectorAll('.planet');
    planets.forEach(p=>{
      // small emitter interval
      const interval = Math.random()*900 + 500;
      setInterval(()=>{
        emitParticle(p);
      }, interval);
    });
  }

  function emitParticle(planet){
    const rect = planet.getBoundingClientRect();
    const core = planet.querySelector('.planet-core');
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;
    const particle = document.createElement('div');
    particle.className = 'planet-particle';
    document.body.appendChild(particle);
    // random direction and distance
    const angle = Math.random()*Math.PI*2;
    const dist = (rect.width * 0.8) + Math.random()*80;
    const tx = Math.cos(angle)*dist;
    const ty = Math.sin(angle)*dist;
    particle.style.left = (centerX - 3) + 'px';
    particle.style.top = (centerY - 3) + 'px';
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    const dur = Math.random()*700 + 900;
    particle.style.animation = `particle-fly ${dur}ms cubic-bezier(.2,.9,.2,1)`;
    // remove after animation
    particle.addEventListener('animationend', ()=> particle.remove());
  }

  // For content pages: page enter animation and intercept links for exit
  function setupPageTransitions(){
    const container = document.querySelector('.content');
    if(container){
      container.classList.add('page-enter');
      requestAnimationFrame(()=>{
        container.classList.add('page-enter-active');
      });

      // intercept internal links to play exit animation
      document.addEventListener('click', (e)=>{
        const a = e.target.closest('a');
        if(!a) return;
        const href = a.getAttribute('href');
        if(!href) return;
        // only intercept local navigations
        if(href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;
        e.preventDefault();
        container.classList.remove('page-enter-active');
        container.classList.add('page-exit-active');
        setTimeout(()=>{ location.href = href; }, 420);
      });
    }
  }

  // init all
  document.addEventListener('DOMContentLoaded', ()=>{
    setup();
    setupPlanets();
    setupPageTransitions();
    // reveal elements sequentially
    revealSequentially();
    // start emitters after DOM ready
    startPlanetEmitters();
  });

  function revealSequentially(){
    const groups = document.querySelectorAll('.reveal-group');
    groups.forEach(group=>{
      const items = Array.from(group.querySelectorAll('.reveal'));
      items.forEach((el, i)=>{
        setTimeout(()=> el.classList.add('visible'), 110 * i);
      });
    });
    // also reveal any single elements marked .reveal
    const singles = document.querySelectorAll(':scope > .reveal');
    singles.forEach((el,i)=> setTimeout(()=> el.classList.add('visible'), 120*i));
  }

})();
