import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PageToc = () => {
  const [activeId, setActiveId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'bio-header', path: '/', idx: '01', label: '关于我' },
    { id: 'portfolio-gallery', path: '/portfolio', idx: '02', label: '作品集' },
  ];

  const handleNavigation = (e, item) => {
    e.preventDefault();
    
    // If we are on the target page
    if (location.pathname === item.path) {
      const el = document.getElementById(item.id);
      if (el) {
        const rectTop = el.getBoundingClientRect().top + window.pageYOffset;
        const target = rectTop - window.innerHeight * 0.3;
        window.scrollTo({ top: target, behavior: 'smooth' });
        setActiveId(item.id);
      } else {
        // Fallback to top if element not found (e.g. page just loaded)
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Navigate to the page
      // If navigating to home, we might want to skip the intro
      if (item.path === '/') {
        navigate(item.path, { state: { skipIntro: true } });
      } else {
        navigate(item.path);
      }
    }
  };

  useEffect(() => {
    // Only observe elements that exist on current page
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -69% 0px' }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY < 100) {
        // Only clear if we are on the page where the first item exists?
        // Or just keep it simple.
        // setActiveId(''); 
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Set active based on current path
    const currentItem = navItems.find(item => item.path === location.pathname);
    if (currentItem) {
       // If on the page, we might want to highlight it, 
       // but strictly speaking activeId is for scroll spy.
       // Let's at least highlight the page we are on if no scroll spy is active.
       if (!activeId) setActiveId(currentItem.id);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]); // Re-run when path changes

  return (
    <aside className="fixed left-0 top-0 w-toc-sm min-[900px]:w-toc h-screen bg-bg z-10 flex flex-col p-6 px-4 gap-4 border-r border-transparent">
      <a 
        href="/"
        className="self-start cursor-pointer"
        onClick={(e) => { e.preventDefault(); navigate('/', { state: { showIntro: true, t: Date.now() } }); }}
      >
        <div className="w-10 h-10 bg-fg text-bg flex items-center justify-center font-bold rounded-lg text-sm">ME</div>
      </a>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = activeId === item.id || location.pathname === item.path;
          return (
            <a
              key={item.id}
              href={item.path}
              onClick={(e) => handleNavigation(e, item)}
              className={`flex items-baseline gap-2 px-2 py-1.5 rounded-md transition-all duration-200 hover:text-accent hover:translate-x-1 ${
                isActive ? 'text-accent font-semibold' : 'text-muted'
              }`}
            >
              <span className={`text-sm ${isActive ? 'text-accent' : 'text-muted'}`}>
                {item.idx}
              </span>
              <span className="hidden min-[900px]:inline">{item.label}</span>
            </a>
          );
        })}
      </nav>
      <div className="mt-4 flex flex-col gap-1">
        <a className="text-[10px] text-muted px-2 py-1 hover:text-fg hover:underline" href="#">Twitter</a>
        <a className="text-[10px] text-muted px-2 py-1 hover:text-fg hover:underline" href="#">Facebook</a>
        <a className="text-[10px] text-muted px-2 py-1 hover:text-fg hover:underline" href="#">LinkedIn</a>
      </div>
    </aside>
  );
};

export default PageToc;
