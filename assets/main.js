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

  // If the #mindmap element receives an SVG child, call fit again (helpful when map loads late)
  (function observeMindmapSVG(){
    var container = document.getElementById('mindmap');
    if(!container) return;
    var mo = new MutationObserver(function(mutations){
      mutations.forEach(function(m){
        m.addedNodes && m.addedNodes.forEach(function(n){
          if(n.nodeName && n.nodeName.toLowerCase()==='svg'){ tryFit(); }
        })
      })
    });
    mo.observe(container, {childList:true, subtree:false});
  })();

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

  // Modal logic: show SVG in overlay
  function createModal(){
    if(qs('.modal-overlay')) return;
    var overlay = document.createElement('div'); overlay.className='modal-overlay';
    var content = document.createElement('div'); content.className='modal-content';
    var close = document.createElement('button'); close.className='modal-close'; close.textContent='Cerrar';
    overlay.appendChild(content); overlay.appendChild(close); document.body.appendChild(overlay);
    close.addEventListener('click', function(){ overlay.classList.remove('visible'); overlay.querySelector('.modal-content').innerHTML=''; });
    overlay.addEventListener('click', function(e){ if(e.target===overlay){ overlay.classList.remove('visible'); overlay.querySelector('.modal-content').innerHTML=''; } });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') overlay.classList.remove('visible'); });
  }
  createModal();

  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-modal-target]');
    if(!btn) return;
    e.preventDefault();
    var url = btn.getAttribute('data-modal-target');
    var overlay = qs('.modal-overlay');
    var content = overlay.querySelector('.modal-content');
    // load image
    content.innerHTML = '<img src="'+url+'" alt="Infografía">';
    overlay.classList.add('visible');
  });

  // Toggle license details
  var toggleBtn = qs('#toggle-licenses');
  if(toggleBtn){ toggleBtn.addEventListener('click', function(){ var el = qs('#licenses-details'); if(el){ el.style.display = el.style.display==='none' ? 'block' : 'none'; } }) }

  // Copy email helper (for contact card)
  function attachCopyEmail(){
    var emailEls = document.querySelectorAll('[data-copy-email]');
    emailEls.forEach(function(btn){ btn.addEventListener('click', function(){ var text=btn.getAttribute('data-copy-email'); if(navigator.clipboard){ navigator.clipboard.writeText(text).then(function(){ btn.textContent='Copiado'; setTimeout(()=>btn.textContent='Copiar correo',1400); }); } }) });
  }
  attachCopyEmail();

  // Animate the badge into view
  var badge = qs('.badge');
  if(badge){ badge.style.opacity=0; badge.style.transform='translateY(-18px) rotate(12deg)'; setTimeout(()=>{ badge.style.transition='transform .7s cubic-bezier(.2,.8,.2,1), opacity .6s'; badge.style.transform='translateY(0) rotate(6deg)'; badge.style.opacity=1; }, 350); }
})();
