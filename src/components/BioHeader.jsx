import React from 'react';

const BioHeader = () => {
  return (
    <section id="bio-header" className="w-full">
      <div className="max-w-content mx-auto px-6">
        <div className="flex items-baseline justify-start">
          <div className="font-semibold tracking-wide">关于我</div>
        </div>
        <div className="h-px bg-border my-4 mb-6"></div>
        <div className="text-4xl font-bold tracking-wide my-3 mb-4">粟鹏 (西米)</div>
        <ul className="pl-5 text-[15px] leading-relaxed text-muted list-disc">
          <li className="mb-1.5">四年+游戏交互设计经验，了解游戏开发的全周期流程。</li>
          <li className="mb-1.5">熟悉UE引擎，了解用户界面实现逻辑与开发流程。</li>
          <li className="mb-1.5">游戏经历丰富，喜爱动作/射击类游戏。</li>
        </ul>
      </div>
    </section>
  );
};

export default BioHeader;
