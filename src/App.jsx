import React, { useEffect } from 'react';
import './index.css';

function App() {
  useEffect(() => {
    let ctx;
    let timeoutId;
    const initApp = () => {
      if (window.gsap && window.ScrollTrigger && window.bootstrap) {
        window.gsap.registerPlugin(window.ScrollTrigger);
                
        /* cursor */
        const cg = document.getElementById('cursorGlow');
        document.addEventListener('mousemove', e => { if(cg) { cg.style.left = e.clientX+'px'; cg.style.top = e.clientY+'px'; } });
        
        /* nav scroll + active */
        const nb = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
          if(nb) nb.classList.toggle('scrolled', window.scrollY > 50);
          let cur = '';
          document.querySelectorAll('section[id]').forEach(s => { if(window.scrollY >= s.offsetTop-130) cur = s.id; });
          document.querySelectorAll('.nav-link-item').forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#'+cur));
        }, { passive:true });
        
        /* close mobile menu on link click */
        const navLinksMobile = document.querySelectorAll('#navMenu .nav-link-item, #navMenu .nav-cta, #mobileMenu .nav-link-item');
        const navMenuEl = document.getElementById('mobileMenu'); // Note: ID in HTML is mobileMenu
        navLinksMobile.forEach(l => {
          l.addEventListener('click', () => {
            if (navMenuEl && navMenuEl.classList.contains('show') && window.bootstrap) {
              let bsCollapse = window.bootstrap.Offcanvas.getInstance(navMenuEl);
              if (!bsCollapse) {
                bsCollapse = new window.bootstrap.Offcanvas(navMenuEl, { toggle: false });
              }
              bsCollapse.hide();
            }
          });
        });
        
        ctx = window.gsap.context(() => {
          const tl = window.gsap.timeline({ defaults:{ ease:'power3.out' } });
          tl.from('.hero-badge',       { opacity:0, y:16, duration:.5 })
            .from('.hero-title .word', { opacity:0, y:52, stagger:.14, duration:.72 }, '-=.22')
            .from('.hero-sub',         { opacity:0, y:16, duration:.5 }, '-=.32')
            .from('.hero-btns',        { opacity:0, y:16, duration:.44 }, '-=.26')
            .from('.hero-stats .stat', { opacity:0, y:16, stagger:.1, duration:.44 }, '-=.2')
            .from('.stat-divider',     { opacity:0, scaleY:0, duration:.3 }, '-=.28')
            .from('.hero-avatar',      { opacity:0, scale:.92, duration:.72, ease:'back.out(1.4)' }, '-=.52')
            .from('.hero-float-card',  { opacity:0, scale:.82, stagger:.18, duration:.44 }, '-=.32');
        
          document.querySelectorAll('[data-count]').forEach(el => {
            const t = +el.dataset.count;
            window.gsap.fromTo(el, {textContent: 0}, { textContent:t, duration:1.8, delay:1.1, snap:{ textContent:1 }, ease:'power2.out',
              onUpdate(){ el.textContent = Math.round(+el.textContent)+'+'; } });
          });
        
          const rd = { ease:'power2.out', duration:.62 };
          window.gsap.utils.toArray('.reveal').forEach(el => window.gsap.fromTo(el, {opacity:0, y:28}, { ...rd, opacity:1, y:0, scrollTrigger:{ trigger:el, start:'top 87%' } }));
          window.gsap.utils.toArray('.reveal-left').forEach(el => window.gsap.fromTo(el, {opacity:0, x:-28}, { ...rd, opacity:1, x:0, scrollTrigger:{ trigger:el, start:'top 87%' } }));
          window.gsap.utils.toArray('.reveal-right').forEach(el => window.gsap.fromTo(el, {opacity:0, x:28}, { ...rd, opacity:1, x:0, scrollTrigger:{ trigger:el, start:'top 87%' } }));
        
          window.gsap.fromTo('.timeline-item', {opacity:0, x:22}, { opacity:1, x:0, stagger:.18, duration:.55, ease:'power2.out', scrollTrigger:{ trigger:'.timeline', start:'top 82%' } });
          window.gsap.fromTo('.skill-chip', {opacity:0, scale:0.84}, { opacity:1, scale:1, stagger:.04, duration:.36, ease:'back.out(1.5)', scrollTrigger:{ trigger:'.skills-grid', start:'top 83%' } });
          window.gsap.fromTo('.project-card', {opacity:0, y:34}, { opacity:1, y:0, stagger:.13, duration:.55, ease:'power2.out', scrollTrigger:{ trigger:'#projects', start:'top 80%' } });
        
          window.gsap.to('.fc1', { y:-10, repeat:-1, yoyo:true, duration:2.8, ease:'sine.inOut' });
          window.gsap.to('.fc2', { y: 10, repeat:-1, yoyo:true, duration:3.2, ease:'sine.inOut', delay:.6 });
        
          const imgWrap = document.querySelector('.hero-img-wrap');
          if(imgWrap){
            imgWrap.addEventListener('mousemove', e => {
              const r = imgWrap.getBoundingClientRect();
              const dx = ((e.clientX-r.left)/r.width  - .5)*10;
              const dy = ((e.clientY-r.top) /r.height - .5)*8;
              window.gsap.to('.hero-avatar', { rotateY:dx, rotateX:-dy, duration:.45, ease:'power1.out', transformPerspective:800 });
            });
            imgWrap.addEventListener('mouseleave', () => window.gsap.to('.hero-avatar', { rotateY:0, rotateX:0, duration:.6, ease:'power2.out' }));
          }
        }); // end ctx
        
        document.querySelectorAll('.oc-link').forEach(link => {
          link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            const offcanvasEl = document.getElementById('mobileMenu');
            
            if (offcanvasEl && window.bootstrap) {
              const offcanvasInstance = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
              if (offcanvasInstance) offcanvasInstance.hide();
              
              const scrollAfterClose = () => {
                if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                offcanvasEl.removeEventListener('hidden.bs.offcanvas', scrollAfterClose);
              };
              
              offcanvasEl.addEventListener('hidden.bs.offcanvas', scrollAfterClose);
            } else {
              if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });
        
      } else {
        timeoutId = setTimeout(initApp, 100);
      }
    };
    initApp();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <>
      

    <div className="cursor-glow" id="cursorGlow" aria-hidden="true"></div>
    {/*  NAV  */}
    <nav id="navbar" role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          <a href="#hero" className="nav-brand" aria-label="Mayur Antala home">
            <div className="nav-logo-box" aria-hidden="true">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="#000" strokeWidth="2.6" strokeLinecap="round"
                strokeLinejoin="round"><polyline
                  points="16 18 22 12 16 6" /><polyline
                  points="8 6 2 12 8 18" /></svg>
            </div>
            Mayur<span className="nav-sep">/</span>Dev
          </a>

          {/*  Hamburger Button (mobile only)  */}
          <button className="navbar-toggler d-md-none" type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileMenu"
            aria-controls="mobileMenu"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/*  Desktop Links  */}
          <div className="d-none d-md-flex align-items-center gap-1">
            <a href="#about" className="nav-link-item">About</a>
            <a href="#skills" className="nav-link-item">Skills</a>
            <a href="#experience" className="nav-link-item">Experience</a>
            <a href="#projects" className="nav-link-item">Projects</a>
            <a href="#contact" className="nav-link-item">Contact</a>
            <a href="mailto:Mayurantala777@gmail.com" className="nav-cta ms-2">Hire
              Me</a>
          </div>
        </div>
      </div>
    </nav>

    {/*  Offcanvas Menu (Left Side)  */}
    <div className="offcanvas offcanvas-start" tabindex="-1" id="mobileMenu"
      aria-labelledby="mobileMenuLabel"
      data-bs-backdrop="true"
      data-bs-scroll="false">

      {/*  Header  */}
      <div className="offcanvas-header">
        <a href="#hero" className="nav-brand" id="mobileMenuLabel">
          <div className="nav-logo-box" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="#000" strokeWidth="2.6" strokeLinecap="round"
              strokeLinejoin="round"><polyline
                points="16 18 22 12 16 6" /><polyline
                points="8 6 2 12 8 18" /></svg>
          </div>
          Mayur<span className="nav-sep">/</span>Dev
        </a>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"
          aria-label="Close"></button>
      </div>

      {/*  Body / Links  */}
      <div className="offcanvas-body d-flex flex-column gap-2">
        <a href="#about" className="nav-link-item oc-link"
          data-bs-dismiss="offcanvas">About</a>
        <a href="#skills" className="nav-link-item oc-link"
          data-bs-dismiss="offcanvas">Skills</a>
        <a href="#experience" className="nav-link-item oc-link"
          data-bs-dismiss="offcanvas">Experience</a>
        <a href="#projects" className="nav-link-item oc-link"
          data-bs-dismiss="offcanvas">Projects</a>
        <a href="#contact" className="nav-link-item oc-link"
          data-bs-dismiss="offcanvas">Contact</a>

        <div className="mt-auto pt-3 border-top">
          <a href="mailto:Mayurantala777@gmail.com"
            className="nav-cta d-block text-center">Hire Me</a>
        </div>
      </div>
    </div>

    {/*  HERO  */}
    <section id="hero" aria-label="Introduction">
      <div className="hero-glow" aria-hidden="true"></div>
      <div className="hero-glow2" aria-hidden="true"></div>
      <div className="container">
        <div className="row align-items-center">

          <div className="col-lg-6">
            <div className="hero-badge" role="status">
              <span className="badge-dot" aria-hidden="true"></span>
              Available for opportunities
            </div>
            <h1 className="hero-title">
              <span className="line"><span className="word">Building</span></span>
              <span className="line"><span
                  className="word highlight">Exceptional</span></span>
              <span className="line"><span className="word">Web
                  Experiences</span></span>
            </h1>
            <p className="hero-sub">Senior Frontend Developer crafting responsive,
              performant, and pixel-perfect web applications with React.js and
              modern web technologies.</p>
            <div className="hero-btns">
              <a href="#projects" className="btn-primary-custom">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"><rect x="2" y="3" width="20" height="14"
                    rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                View Projects
              </a>
              <a href="mailto:Mayurantala777@gmail.com"
                className="btn-outline-custom">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"><path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline
                    points="22,6 12,13 2,6" /></svg>
                Get in Touch
              </a>
            </div>
            <div className="hero-stats" role="list" aria-label="Career highlights">
              <div className="stat" role="listitem">
                <span className="stat-num" data-count="2">0</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-divider" aria-hidden="true"></div>
              <div className="stat" role="listitem">
                <span className="stat-num" data-count="10">0</span>
                <span className="stat-label">Technologies</span>
              </div>
              <div className="stat-divider" aria-hidden="true"></div>
              <div className="stat" role="listitem">
                <span className="stat-num" data-count="3">0</span>
                <span className="stat-label">Major Projects</span>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mt-5 mt-lg-0">
            <div className="hero-img-wrap">
              <div className="hero-avatar" aria-label="Mayur Antala avatar">
                <div className="avatar-monogram" aria-hidden="true">
                  
                  {/*  <span className="mono-tag">Frontend Developer</span>  */}
                </div>
              </div>
              <div className="hero-float-card fc1" aria-hidden="true">
                <span className="fc-dot"></span>
                Senior Dev · Hyperlink Infosystem
              </div>
              <div className="hero-float-card fc2" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"
                  opacity=".6" aria-hidden="true"><polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                React.js Expert
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <div className="divider" role="separator"></div>

    {/*  ABOUT  */}
    <section id="about" aria-labelledby="about-h">
      <div className="container">
        <div className="row gy-5 align-items-start">
          <div className="col-lg-5 reveal-left">
            <div className="section-tag">About Me</div>
            <h2 className="section-title mt-2" id="about-h">Passionate about
              crafting great UI</h2>
            <p className="about-prose">I'm a <strong>Senior Frontend
                Developer</strong> at Hyperlink Infosystem, Ahmedabad, with
              hands-on experience building scalable web applications using
              React.js and modern JavaScript.</p>
            <p className="about-prose">I specialise in translating Figma wireframes
              into pixel-perfect, accessible interfaces with a strong focus on
              clean code, performance, and developer collaboration.</p>
            <div className="social-links" aria-label="Social links">
              <a href="https://www.linkedin.com/in/mayur-antala-90b468268/"
                target="_blank" rel="noopener noreferrer" className="social-btn"
                aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round"><path
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect
                    x="2" y="9" width="4" height="12" /><circle cx="4" cy="4"
                    r="2" /></svg>
              </a>
              <a href="mailto:Mayurantala777@gmail.com" className="social-btn"
                aria-label="Email">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round"><path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline
                    points="22,6 12,13 2,6" /></svg>
              </a>
              <a href="tel:+918469666081" className="social-btn" aria-label="Phone">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round"><path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 13.18 13.18 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.87-.87a2 2 0 0 1 2.11-.45 13.18 13.18 0 0 0 2.81.7A2 2 0 0 1 22 17z" /></svg>
              </a>
            </div>
          </div>
          <div className="col-lg-7 reveal-right">
            <div className="about-card">
              <div className="about-card-header">Personal Info</div>
              <div className="info-row"><svg className="info-ico" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true"><path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle
                    cx="12" cy="7" r="4" /></svg><div><div className="info-lbl">Full
                    Name</div><div className="info-val">Mayur
                    Antala</div></div></div>
              <div className="info-row"><svg className="info-ico" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7"
                    width="20" height="14" rx="2" /><path
                    d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg><div><div
                    className="info-lbl">Current Role</div><div
                    className="info-val">Senior Frontend Developer · Hyperlink
                    Infosystem</div></div></div>
              <div className="info-row"><svg className="info-ico" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true"><path
                    d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle
                    cx="12" cy="10" r="3" /></svg><div><div
                    className="info-lbl">Location</div><div
                    className="info-val">Ahmedabad, Gujarat, India</div></div></div>
              <div className="info-row"><svg className="info-ico" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true"><path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline
                    points="22,6 12,13 2,6" /></svg><div><div
                    className="info-lbl">Email</div><div
                    className="info-val">Mayurantala777@gmail.com</div></div></div>
              <div className="info-row"><svg className="info-ico" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true"><path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 13.18 13.18 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.87-.87a2 2 0 0 1 2.11-.45 13.18 13.18 0 0 0 2.81.7A2 2 0 0 1 22 17z" /></svg><div><div
                    className="info-lbl">Phone</div><div className="info-val">+91 84696
                    66081</div></div></div>
              <div className="info-row"><svg className="info-ico" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" aria-hidden="true"><circle cx="12"
                    cy="12" r="10" /><polyline
                    points="12 6 12 12 16 14" /></svg><div><div
                    className="info-lbl">Experience</div><div className="info-val">2+
                    Years · Jul 2023 – Present</div></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="divider" role="separator"></div>

    {/*  SKILLS  */}
    <section id="skills" aria-labelledby="skills-h">
      <div className="container">
        <div className="text-center mb-5 reveal">
          <div className="section-tag" style={{display: 'inline-flex'}}>Technical
            Skills</div>
          <h2 className="section-title mt-2" id="skills-h">Technologies I work
            with</h2>
          <p className="section-sub" style={{maxWidth: '460px', margin: '0 auto'}}>Focused
            on modern frontend ecosystems — from markup to advanced React
            architecture.</p>
        </div>
        <div className="skills-grid reveal" role="list">
          <div className="skill-chip" role="listitem"><div
              className="skill-icon-box"><svg width="19" height="19"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"><polyline
                  points="16 18 22 12 16 6" /><polyline
                  points="8 6 2 12 8 18" /></svg></div>HTML5</div>
          <div className="skill-chip" role="listitem"><div
              className="skill-icon-box"><svg width="19" height="19"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"><circle cx="12" cy="12" r="10" /><path
                  d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" /></svg></div>CSS3</div>
          <div className="skill-chip" role="listitem"><div
              className="skill-icon-box"><svg width="19" height="19"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"><circle cx="12" cy="12" r="3" /><path
                  d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg></div>Sass/SCSS</div>
          <div className="skill-chip" role="listitem"><div
              className="skill-icon-box"><svg width="19" height="19"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"><polygon
                  points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg></div>JavaScript</div>
          <div className="skill-chip" role="listitem"><div
              className="skill-icon-box"><svg width="19" height="19"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"><path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg></div>React.js</div>
          <div className="skill-chip" role="listitem"><div
              className="skill-icon-box"><svg width="19" height="19"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"><rect x="2" y="3" width="20" height="14"
                  rx="2" /><path
                  d="M8 21h8M12 17v4" /></svg></div>Bootstrap</div>
          <div className="skill-chip" role="listitem"><div
              className="skill-icon-box"><svg width="19" height="19"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"><path
                  d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline
                  points="9 22 9 12 15 12 15 22" /></svg></div>Tailwind
            CSS</div>
          <div className="skill-chip" role="listitem"><div
              className="skill-icon-box"><svg width="19" height="19"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"><path d="M12 20h9" /><path
                  d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg></div>Figma</div>
          <div className="skill-chip" role="listitem"><div
              className="skill-icon-box"><svg width="19" height="19"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"><circle cx="6" cy="6" r="3" /><circle cx="6"
                  cy="18" r="3" /><line x1="20" y1="4" x2="8.12"
                  y2="15.88" /><line x1="14.47" y1="14.48" x2="20"
                  y2="20" /><line x1="8.12" y1="8.12" x2="12"
                  y2="12" /></svg></div>Less</div>
          <div className="skill-chip" role="listitem"><div
              className="skill-icon-box"><svg width="19" height="19"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"><circle cx="12" cy="18" r="3" /><circle
                  cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" /><path
                  d="M18 9a9 9 0 0 1-9 9M6 9a9 9 0 0 0 9 9" /></svg></div>Material
            UI</div>
          <div className="skill-chip" role="listitem"><div
              className="skill-icon-box"><svg width="19" height="19"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"><path
                  d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg></div>Git
            / GitLab</div>
          <div className="skill-chip" role="listitem"><div
              className="skill-icon-box"><svg width="19" height="19"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"><path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></div>REST
            APIs</div>
        </div>
      </div>
    </section>

    <div className="divider" role="separator"></div>

    {/*  EXPERIENCE  */}
    <section id="experience" aria-labelledby="exp-h">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-5 mb-lg-0 reveal-left">
            <div className="position-sticky top-60">
              <div className="section-tag">Work History</div>
              <h2 className="section-title mt-2" id="exp-h">My professional
                journey</h2>
              <p className="section-sub">2+ years at Hyperlink Infosystem — growing
                from intern to Senior Frontend Developer building
                production-grade web products.</p>
            </div>
          </div>
          <div className="col-lg-8 reveal-right">
            <div className="timeline" role="list" aria-label="Work experience">
              <div className="timeline-item" role="listitem">
                <div className="timeline-card">
                  <div className="t-role">Senior Frontend Developer</div>
                  <div className="t-company">Hyperlink Infosystem</div>
                  <div className="t-period"><svg width="10" height="10"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round" aria-hidden="true"><rect x="3"
                        y="4" width="18" height="18" rx="2" /><line x1="16"
                        y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8"
                        y2="6" /><line x1="3" y1="10" x2="21"
                        y2="10" /></svg>Jan 2025 – Present</div>
                  <ul className="t-points">
                    <li>Led development of complex, scalable frontend
                      applications using React.js and modern JavaScript.</li>
                    <li>Designed and implemented reusable UI components,
                      improving development speed and maintainability.</li>
                    <li>Collaborated with product, design, and backend teams to
                      deliver high-quality, user-centric interfaces.</li>
                    <li>Optimized performance, reducing load times and improving
                      application responsiveness significantly.</li>
                    <li>Mentored junior developers and conducted thorough code
                      reviews to enforce best practices.</li>
                  </ul>
                </div>
              </div>
              <div className="timeline-item" role="listitem">
                <div className="timeline-card">
                  <div className="t-role">Junior Frontend Developer</div>
                  <div className="t-company">Hyperlink Infosystem</div>
                  <div className="t-period"><svg width="10" height="10"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round" aria-hidden="true"><rect x="3"
                        y="4" width="18" height="18" rx="2" /><line x1="16"
                        y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8"
                        y2="6" /><line x1="3" y1="10" x2="21"
                        y2="10" /></svg>Jan 2024 – Jan 2025</div>
                  <ul className="t-points">
                    <li>Developed responsive web pages using HTML, CSS, SCSS,
                      and JavaScript.</li>
                    <li>Built reusable UI components and dynamic features using
                      React.js.</li>
                    <li>Converted Figma wireframes into pixel-perfect,
                      responsive interfaces.</li>
                    <li>Integrated REST APIs and optimized user experience
                      across multiple devices.</li>
                    <li>Maintained code quality through best practices and
                      GitLab version control.</li>
                  </ul>
                </div>
              </div>
              <div className="timeline-item" role="listitem">
                <div className="timeline-card">
                  <div className="t-role">Frontend Developer Intern</div>
                  <div className="t-company">Hyperlink Infosystem</div>
                  <div className="t-period"><svg width="10" height="10"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round" aria-hidden="true"><rect x="3"
                        y="4" width="18" height="18" rx="2" /><line x1="16"
                        y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8"
                        y2="6" /><line x1="3" y1="10" x2="21"
                        y2="10" /></svg>Jul 2023 – Jan 2024</div>
                  <ul className="t-points">
                    <li>Designed responsive and visually appealing web pages
                      using HTML, CSS, and Bootstrap.</li>
                    <li>Converted Figma and Photoshop designs into clean,
                      pixel-perfect UI layouts.</li>
                    <li>Assisted developers in creating reusable components and
                      improving frontend workflows.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="divider" role="separator"></div>

    {/*  PROJECTS  */}
    <section id="projects" aria-labelledby="proj-h">
      <div className="container">
        <div className="text-center mb-5 reveal">
          <div className="section-tag" style={{display: 'inline-flex'}}>Featured
            Work</div>
          <h2 className="section-title mt-2" id="proj-h">Projects I've built</h2>
          <p className="section-sub"
            style={{maxWidth: '480px', margin: '0 auto'}}>Real-world applications built
            with attention to performance, design, and user experience.</p>
        </div>
        <div className="row g-4">
          <div className="col-lg-4 col-md-6 reveal">
            <article className="project-card">
              <div className="project-thumb" aria-hidden="true">
                <div className="thumb-grid"></div>
                <div className="thumb-icon"><svg width="26" height="26"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.7" strokeLinecap="round"
                    strokeLinejoin="round"><path
                      d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path
                      d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg></div>
              </div>
              <div className="project-body">
                <div className="project-tags"><span
                    className="ptag">React.js</span><span
                    className="ptag">UI/UX</span><span
                    className="ptag">E-Learning</span></div>
                <h3 className="project-title">Axiatom – Learning Platform</h3>
                <p className="project-desc">An online learning platform simplifying
                  education through high-quality video courses. Features
                  structured learning paths, mentor profiles, and engaging
                  content for continuous skill development.</p>
                <a href="#" className="project-link"
                  aria-label="View Axiatom project">View Details <svg width="12"
                    height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"><line x1="5" y1="12" x2="19"
                      y2="12" /><polyline points="12 5 19 12 12 19" /></svg></a>
              </div>
            </article>
          </div>
          <div className="col-lg-4 col-md-6 reveal">
            <article className="project-card">
              <div className="project-thumb" aria-hidden="true">
                <div className="thumb-grid"></div>
                <div className="thumb-icon"><svg width="26" height="26"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.7" strokeLinecap="round"
                    strokeLinejoin="round"><path
                      d="M3 11l19-9-9 19-2-8-8-2z" /></svg></div>
              </div>
              <div className="project-body">
                <div className="project-tags"><span className="ptag">Figma</span><span
                    className="ptag">React.js</span><span className="ptag">Food
                    App</span></div>
                <h3 className="project-title">Iwant – Food Application</h3>
                <p className="project-desc">A modern food desktop application with
                  clean layouts and smooth navigation. Includes dashboard, menu,
                  orders, and profile screens built with strong UI/UX principles
                  for a polished experience.</p>
                <a href="#" className="project-link"
                  aria-label="View Iwant project">View Details <svg width="12"
                    height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"><line x1="5" y1="12" x2="19"
                      y2="12" /><polyline points="12 5 19 12 12 19" /></svg></a>
              </div>
            </article>
          </div>
          <div className="col-lg-4 col-md-6 reveal">
            <article className="project-card">
              <div className="project-thumb" aria-hidden="true">
                <div className="thumb-grid"></div>
                <div className="thumb-icon"><svg width="26" height="26"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.7" strokeLinecap="round"
                    strokeLinejoin="round"><rect x="2" y="3" width="20"
                      height="14" rx="2" /><path d="M8 21h8M12 17v4" /><path
                      d="M7 8h10M7 12h6" /></svg></div>
              </div>
              <div className="project-body">
                <div className="project-tags"><span
                    className="ptag">Multi-Portal</span><span
                    className="ptag">React.js</span><span
                    className="ptag">SaaS</span></div>
                <h3 className="project-title">SourceNow – Service Platform</h3>
                <p className="project-desc">A comprehensive multi-user platform with
                  portals for customers, suppliers, admins, and account
                  managers. Features quote management, workflows, chat,
                  payments, and analytics across all panels.</p>
                <a href="#" className="project-link"
                  aria-label="View SourceNow project">View Details <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"><line x1="5" y1="12" x2="19"
                      y2="12" /><polyline points="12 5 19 12 12 19" /></svg></a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <div className="divider" role="separator"></div>

    {/*  EDUCATION  */}
    <section id="education" aria-labelledby="edu-h">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4 mb-5 mb-lg-0 reveal-left">
            <div className="section-tag">Education</div>
            <h2 className="section-title mt-2" id="edu-h">Academic background</h2>
            <p className="section-sub">A strong foundation in computer applications
              from Saurashtra University, Gujarat.</p>
          </div>
          <div className="col-lg-8 reveal-right">
            <div className="edu-card">
              <div className="edu-icon" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round"><path
                    d="M22 10v6M2 10l10-5 10 5-10 5z" /><path
                    d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
              </div>
              <div>
                <div className="edu-degree">Bachelor of Computer Applications
                  (B.C.A.)</div>
                <div className="edu-school">S.S.S.D.I.I.T – Junagadh &nbsp;·&nbsp;
                  Saurashtra University</div>
                <div className="edu-year">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true"><rect x="3" y="4" width="18" height="18"
                      rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line
                      x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21"
                      y2="10" /></svg>
                  Graduated 2015
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="divider" role="separator"></div>

    {/*  CONTACT  */}
    <section id="contact" aria-labelledby="contact-h">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center reveal">
            <div className="section-tag" style={{display: 'inline-flex'}}>Let's
              Talk</div>
            <h2 className="section-title mt-2" id="contact-h">Open to new
              opportunities</h2>
            <p className="section-sub"
              style={{maxWidth: '520px', margin: '0 auto 3rem'}}>Whether you have a
              project in mind, want to discuss a role, or just want to say hello
              — my inbox is always open.</p>
          </div>
        </div>
        <div className="row g-4 justify-content-center">
          <div className="col-lg-5 reveal-left">
            <div className="contact-card">
              <div className="contact-card-title">Contact Info</div>
              <a href="mailto:Mayurantala777@gmail.com"
                className="contact-item"><div className="ci-icon"
                  aria-hidden="true"><svg width="15" height="15"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round"><path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline
                      points="22,6 12,13 2,6" /></svg></div><div><div
                    className="ci-lbl d-none">Email</div><div
                    className="ci-val">Mayurantala777@gmail.com</div></div></a>
              <a href="tel:+918469666081" className="contact-item"><div
                  className="ci-icon" aria-hidden="true"><svg width="15" height="15"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round"><path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 13.18 13.18 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.87-.87a2 2 0 0 1 2.11-.45 13.18 13.18 0 0 0 2.81.7A2 2 0 0 1 22 17z" /></svg></div><div><div
                    className="ci-lbl d-none">Phone</div><div className="ci-val">+91
                    84696 66081</div></div></a>
              <a href="https://www.linkedin.com/in/mayur-antala-90b468268/"
                target="_blank" rel="noopener noreferrer"
                className="contact-item"><div className="ci-icon"
                  aria-hidden="true"><svg width="15" height="15"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round"><path
                      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect
                      x="2" y="9" width="4" height="12" /><circle cx="4" cy="4"
                      r="2" /></svg></div><div><div
                    className="ci-lbl d-none">LinkedIn</div><div
                    className="ci-val">mayur-antala-90b468268</div></div></a>
              <div className="contact-item" style={{cursor: 'default'}}><div
                  className="ci-icon" aria-hidden="true"><svg width="15" height="15"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round"><path
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle
                      cx="12" cy="10" r="3" /></svg></div><div><div
                    className="ci-lbl d-none">Location</div><div
                    className="ci-val">Ahmedabad, Gujarat, India</div></div></div>
              <a href="https://wa.me/918469666081" target="_blank"
                className="contact-item">
                <div className="ci-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24"
                    fill="currentColor" stroke="none">
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path
                      d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.522 5.855L.057 23.625a.75.75 0 00.921.921l5.808-1.461A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.498-5.2-1.371l-.374-.214-3.878.976.995-3.77-.234-.389A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                </div>
                <div>
                  <div className="ci-lbl d-none">WhatsApp</div>
                  <div className="ci-val">Chat On WhatsApp</div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-lg-5 reveal-right">
            <div className="contact-card d-flex flex-column">
              <div className="contact-card-title">Send a Message</div>
              <p className="section-sub"
                style={{fontSize: '.82rem', marginBottom: '1.5rem'}}>I typically reply
                within 24 hours.</p>
              <label htmlFor="cname" className="visually-hidden">Your name</label>
              <input id="cname" type="text" placeholder="Your name"
                className="form-field" autocomplete="name" />
              <label htmlFor="cemail" className="visually-hidden">Your email</label>
              <input id="cemail" type="email" placeholder="Your email"
                className="form-field" autocomplete="email" />
              <label htmlFor="cmsg" className="visually-hidden">Your message</label>
              <textarea id="cmsg" rows="4" placeholder="Your message..."
                className="form-field"></textarea>
              <a href="mailto:Mayurantala777@gmail.com"
                className="btn-primary-custom mt-1 justify-content-center"
                role="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"><line x1="22" y1="2" x2="11"
                    y2="13" /><polygon
                    points="22 2 15 22 11 13 2 9 22 2" /></svg>
                Send Message
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/*  FOOTER  */}
    <footer role="contentinfo">
      <div className="container">
        <div
          className="d-flex align-items-center justify-content-center justify-content-sm-between flex-wrap gap-3">
          <div>Designed &amp; built by <strong
              style={{color: 'var(--text2)', fontWeight: 600}}>Mayur Antala</strong>
            &nbsp;·&nbsp; 2026</div>
          <div className="d-flex align-items-center gap-2" style={{fontSize: '.78rem'}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden="true"><polyline
                points="20 6 9 17 4 12" /></svg>
            Open to work &nbsp;·&nbsp; Ahmedabad, India
          </div>
        </div>
      </div>
    </footer>

    
    
    
    
    
  
    </>
  );
}

export default App;
