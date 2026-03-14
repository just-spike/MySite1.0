import React, { useEffect, useState } from 'react';

const PageToc = () => {
  const [activeId, setActiveId] = useState('');

  const navItems = [
    { id: 'bio-header', idx: '01', label: '关于我' },
    { id: 'resume-timeline', idx: '02', label: '项目经历' },
    { id: 'portfolio-gallery', idx: '03', label: '作品集' },
  ];

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    
    const rectTop = el.getBoundingClientRect().top + window.pageYOffset;
    const target = rectTop - window.innerHeight * 0.3;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const top = Math.min(Math.max(target, 0), maxScroll);
    
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveId(id);
  };

  useEffect(() => {
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
        setActiveId('');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <aside className="fixed left-0 top-0 w-toc-sm min-[900px]:w-toc h-screen bg-bg z-10 flex flex-col p-6 px-4 gap-4 border-r border-transparent">
      <a 
        href="#avatar-hero" 
        className="self-start cursor-pointer"
        onClick={(e) => handleScrollTo(e, 'avatar-hero')}
      >
        <div className="w-10 h-10 bg-fg text-bg flex items-center justify-center font-bold rounded-lg text-sm">ME</div>
      </a>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleScrollTo(e, item.id)}
            className={`flex items-baseline gap-2 px-2 py-1.5 rounded-md transition-all duration-200 hover:text-accent hover:translate-x-1 ${
              activeId === item.id ? 'text-accent font-semibold' : 'text-muted'
            }`}
          >
            <span className={`text-sm ${activeId === item.id ? 'text-accent' : 'text-muted'}`}>
              {item.idx}
            </span>
            <span className="hidden min-[900px]:inline">{item.label}</span>
          </a>
        ))}
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
