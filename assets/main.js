// Interacciones ligeras: logo animation, smooth scroll, reveal on scroll, theme toggle
(function(){
  function qs(sel, ctx){return (ctx||document).querySelector(sel)}
  function qsa(sel, ctx){return (ctx||document).querySelectorAll(sel)}

  // Pulse logo once
  var logo = qs('.logo')
  if(logo){
    setTimeout(function(){ logo.classList.add('pulse'); setTimeout(()=>logo.classList.remove('pulse'),900) }, 350);
  }

  // Smooth scroll for nav links
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if(!a) return;
    var id = a.getAttribute('href');
    if(id && id.startsWith('#')){
      var el = document.querySelector(id);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); }
    }
  });

  // Intersection observer to reveal elements
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('visible'); obs.unobserve(en.target) } })
  },{threshold:0.12});
  document.querySelectorAll('.fade-in').forEach(function(el){ obs.observe(el) });

  // Theme toggle (light/dark) - simple class on body
  var themeBtn = document.createElement('button'); themeBtn.className='theme-toggle'; themeBtn.textContent='Toggle theme';
  themeBtn.addEventListener('click', function(){ document.body.classList.toggle('light-mode'); });
  var nav = qs('nav'); if(nav) nav.appendChild(themeBtn);

  // Ensure markmap instance fit after it becomes available
  function tryFit(){
    try{ if(window.__markmap && typeof window.__markmap.fit==='function') window.__markmap.fit(); }
    catch(e){/* ignore */}
  }
  // Try a few times (map may initialize after scripts load)
  [300,800,1500,3000].forEach(function(t){ setTimeout(tryFit,t) });

  // Parallax for hero background
  var heroBg = qs('.hero-bg');
  if(heroBg){
    function onScroll(){
      var y = window.scrollY || window.pageYOffset;
      // translate a bit to create depth
      heroBg.style.transform = 'translateY(' + (y * 0.12) + 'px)';
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    // initial call
    onScroll();
  }

  // Animate the badge into view
  var badge = qs('.badge');
  if(badge){ badge.style.opacity=0; badge.style.transform='translateY(-18px) rotate(12deg)'; setTimeout(()=>{ badge.style.transition='transform .7s cubic-bezier(.2,.8,.2,1), opacity .6s'; badge.style.transform='translateY(0) rotate(6deg)'; badge.style.opacity=1; }, 350); }
})();
