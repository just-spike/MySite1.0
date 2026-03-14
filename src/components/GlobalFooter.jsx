import React from 'react';

const GlobalFooter = () => {
  return (
    <footer className="w-full">
      <div className="max-w-content mx-auto px-6">
        <div className="h-px bg-border mb-4"></div>
        <div className="flex justify-between text-[13px] text-muted py-6 pb-12">
          <div>© 2026 你的名字</div>
          <div>备案号 · ICP 00000000 号</div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
