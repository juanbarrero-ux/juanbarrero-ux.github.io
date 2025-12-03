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

  // Markmap removed — no fit calls needed

  // Mindmap removed: no observation needed

  // Set thumbnails for post cards from data-img attribute
  function initPostThumbnails(){
    var posts = document.querySelectorAll('.post-card');
    posts.forEach(function(card){
      var img = card.getAttribute('data-img');
      var thumb = card.querySelector('.thumb');
      if(!thumb) return;
      if(img){ thumb.style.backgroundImage = 'url("' + img + '")'; }
      // set entire card background image with a subtle cover
      if(img){ card.style.backgroundImage = 'url("' + img + '")'; card.style.backgroundSize = 'cover'; card.style.backgroundPosition = 'center'; card.style.backgroundRepeat='no-repeat'; }
    });
  }
  initPostThumbnails();

  // Panel interactions: scroll to anchor or open link
  function setupPanelItems(root){
    var items = (root||document).querySelectorAll('.panel-item');
    items.forEach(function(btn){
    btn.addEventListener('click', function(){
      var t = btn.getAttribute('data-target');
      if(!t) return;
      // Set active class
      document.querySelectorAll('.panel-item').forEach(function(x){ x.classList.remove('active') });
      btn.classList.add('active');
      if(t.startsWith('#')){
        var el = document.querySelector(t);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
      } else if(t.startsWith('posts/') || t.endsWith('.html')){
        window.open(t, '_blank');
      } else {
        window.open(t, '_blank');
      }
      // If this click happened inside the mobile drawer, close it
      try{
        if(root && root.id === 'mobile-drawer'){
          var dr = document.getElementById('mobile-drawer');
          if(dr){ dr.setAttribute('aria-hidden','true'); var toggle = document.querySelector('.drawer-toggle'); if(toggle){ toggle.setAttribute('aria-expanded','false') } document.body.style.overflow=''; }
        }
      }catch(e){/* ignore */}
    });
    });
  }
  setupPanelItems();

  // Highlight panel item when the related post is in view
  function syncPanelWithScroll(){
    var posts = document.querySelectorAll('.post-card');
    posts.forEach(function(p){
      var rect = p.getBoundingClientRect();
      var anchor = p.querySelector('h4 a');
      var target = anchor ? anchor.getAttribute('href') : null;
      if(!target || !target.startsWith('#')) return;
      var panelBtn = document.querySelector('.panel-item[data-target="' + target + '"]');
      if(!panelBtn) return;
      if(rect.top >= 0 && rect.top < (window.innerHeight * 0.4)){
        panelBtn.classList.add('active');
      } else {
        panelBtn.classList.remove('active');
      }
    });
  }
  window.addEventListener('scroll', syncPanelWithScroll, {passive:true});
  syncPanelWithScroll();

  // Social buttons: open in new tab and add glow animation
  document.querySelectorAll('.btn.social').forEach(function(b){
    b.addEventListener('click', function(e){
      // default is to follow link; we can add a simple effect
      b.classList.add('neon'); setTimeout(()=>b.classList.remove('neon'), 800);
    });
  });

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

  // Drawer: mobile floating panel
  var drawerToggle = qs('.drawer-toggle');
  var drawer = document.getElementById('mobile-drawer');
  var drawerClose = drawer && drawer.querySelector('.drawer-close');
  var drawerList = drawer && drawer.querySelector('.drawer-list');
  if(drawer && drawerToggle){
    // copy the panel list into drawer list to keep behaviors
    var originalPanel = document.querySelector('.panel-list');
    if(originalPanel && drawerList){
      drawerList.innerHTML = originalPanel.innerHTML;
      // reinitialize panel items inside drawer
      setupPanelItems(drawer);
    }
    drawerToggle.addEventListener('click', function(e){
      var open = drawer.getAttribute('aria-hidden') === 'false';
      drawer.setAttribute('aria-hidden', open ? 'true' : 'false');
      drawerToggle.setAttribute('aria-expanded', String(!open));
      if(!open){ document.body.style.overflow='hidden' } else { document.body.style.overflow='' }
    });
    if(drawerClose){ drawerClose.addEventListener('click', function(){ drawer.setAttribute('aria-hidden','true'); drawerToggle.setAttribute('aria-expanded','false'); document.body.style.overflow='' }) }
    // close when clicking outside of drawer
    drawer.addEventListener('click', function(e){ if(e.target===drawer){ drawer.setAttribute('aria-hidden','true'); drawerToggle.setAttribute('aria-expanded','false'); document.body.style.overflow='' } });
  }

  // Animate the badge into view
  var badge = qs('.badge');
  if(badge){ badge.style.opacity=0; badge.style.transform='translateY(-18px) rotate(12deg)'; setTimeout(()=>{ badge.style.transition='transform .7s cubic-bezier(.2,.8,.2,1), opacity .6s'; badge.style.transform='translateY(0) rotate(6deg)'; badge.style.opacity=1; }, 350); }
})();
