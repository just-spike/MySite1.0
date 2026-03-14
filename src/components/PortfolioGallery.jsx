import React, { useState } from 'react';

const PortfolioItem = ({ title, desc, onClick }) => (
  <div 
    className="col-span-4 md:col-span-6 sm:col-span-12 border border-border rounded-lg overflow-hidden bg-bg cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-lg"
    onClick={onClick}
  >
    <div className="h-40 bg-gray-block"></div>
    <div className="p-3 pb-4">
      <div className="font-semibold">{title}</div>
      <div className="text-[13px] text-muted mt-1">{desc}</div>
    </div>
  </div>
);

const Drawer = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      <div 
        className={`fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      <aside 
        className={`fixed top-0 right-0 w-[80vw] md:w-[90vw] h-full bg-bg z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] border-l border-border shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div className="text-xl font-bold">{title}</div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-muted text-2xl hover:text-fg hover:bg-gray-block rounded transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-12 md:p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </aside>
    </>
  );
};

const PortfolioGallery = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    { title: "作品标题 A", desc: "简短说明文字" },
    { title: "作品标题 B", desc: "简短说明文字" },
    { title: "作品标题 C", desc: "简短说明文字" }
  ];

  return (
    <section id="portfolio-gallery" className="w-full">
      <div className="max-w-content mx-auto px-6">
        <div className="flex items-baseline justify-start">
          <div className="font-semibold tracking-wide">作品集</div>
        </div>
        <div className="h-px bg-border my-4 mb-6"></div>
        <div className="grid grid-cols-12 md:grid-cols-6 sm:grid-cols-2 gap-4">
          {projects.map((p, idx) => (
            <PortfolioItem 
              key={idx}
              title={p.title}
              desc={p.desc}
              onClick={() => setSelectedProject(p)}
            />
          ))}
        </div>
      </div>

      <Drawer 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        title={selectedProject?.title || '作品详情'}
      >
        <div className="max-w-[800px] mx-auto">
          <div className="flex gap-3 mb-6">
            <span className="text-xs px-2 py-1 bg-gray-block rounded text-muted">UI/UX Design</span>
            <span className="text-xs px-2 py-1 bg-gray-block rounded text-muted">2024</span>
            <span className="text-xs px-2 py-1 bg-gray-block rounded text-muted">Case Study</span>
          </div>
          
          <h3 className="text-lg font-bold mt-8 mb-4">项目背景</h3>
          <p className="text-sm leading-relaxed text-fg mb-6">这里是项目背景的详细描述文本。它可以很长，介绍项目的起源、目标和挑战。我们在这个项目中致力于解决用户的核心痛点，通过深入的用户调研和竞品分析，确立了设计方向。</p>
          
          <div className="w-full h-[400px] md:h-[240px] bg-gray-block rounded-lg flex items-center justify-center text-muted text-sm mb-6 border border-dashed border-border">
            [图片占位符：项目主视觉 / Key Visual]
          </div>

          <h3 className="text-lg font-bold mt-8 mb-4">设计流程</h3>
          <p className="text-sm leading-relaxed text-fg mb-6">我们采用了双钻模型进行设计探索，从发现问题到定义问题，再到构思方案和交付设计。在交互设计阶段，我们梳理了详细的用户体验地图。</p>
          
          <div className="w-full h-[300px] bg-gray-50 rounded-lg flex items-center justify-center text-muted text-sm mb-6 border border-dashed border-border">
            [流程图占位符：用户体验地图 / 交互流程]
          </div>

          <h3 className="text-lg font-bold mt-8 mb-4">核心功能演示</h3>
          <p className="text-sm leading-relaxed text-fg mb-6">为了直观展示设计成果，我们制作了高保真原型和动态演示视频，还原了真实的交互体验。</p>
          
          <div className="w-full h-[450px] md:h-[240px] bg-black text-white rounded-lg flex items-center justify-center text-sm mb-6">
            [视频占位符：功能演示 Demo / 1080P]
          </div>
          
          <h3 className="text-lg font-bold mt-8 mb-4">界面展示</h3>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[240px] bg-gray-block rounded-lg flex items-center justify-center text-muted text-sm border border-dashed border-border">
                [界面详情图 {i}]
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </section>
  );
};

export default PortfolioGallery;
