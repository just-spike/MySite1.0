import React from 'react';

const ResumeItem = ({ meta, role, desc }) => (
  <li className="relative pl-8 mb-5 before:content-[''] before:absolute before:left-[2px] before:top-[6px] before:w-3 before:h-3 before:bg-bg before:border-2 before:border-accent before:rounded-full">
    <div className="text-[13px] text-muted">{meta}</div>
    <div className="text-lg font-semibold mt-1">{role}</div>
    <div className="text-[13px] text-fg mt-2 leading-relaxed space-y-1">
      {desc.map((line, idx) => (
        <div key={idx} dangerouslySetInnerHTML={{ __html: line }}></div>
      ))}
    </div>
  </li>
);

const ResumeTimeline = () => {
  const experiences = [
    {
      meta: "2024.3 — 至今 · 英雄游戏 · 潘神工作室",
      role: "交互策划（二重螺旋）",
      desc: [
        "<strong>战斗相关</strong> | 负责PC/移动/手柄端的HUD布局的设计和迭代；负责1.1版本移动端战斗操作的体验优化；负责处决/QTE/技能量谱/跳字/准星/血条/等战斗交互的设计。",
        "<strong>系统相关</strong> | 负责宠物/魔之匣/组队联机/任务栏/图鉴等系统的交互设计与迭代；负责拍照/灵鸟之证/文明博弈/社区分享等活动的交互设计。",
        "<strong>玩法相关</strong> | 负责区域探索/推理/灵鸟试炼副本/派遣/动态事件/梦魇残声（周本Boos）/区域联机副本等玩法的设计和迭代。",
        "<strong>设计规范</strong> | 负责通用按钮/通用数量选择器/通用奖励弹窗等交互控件的开发规范。"
      ]
    },
    {
      meta: "2021.7 — 2023.9 · 网易互娱 · 用户体验中心",
      role: "交互设计师（命运·群星）",
      desc: [
        "<strong>战斗相关</strong> | 负责角色枪械/技能/载具等战斗操作的交互设计；负责血条/准星/技能量谱/受击反馈等战斗提示的交互设计；参与战斗HUD的整体设计与迭代；负责手柄端战斗HUD的设计；参与战斗体验自评和优化工作。",
        "<strong>系统相关</strong> | 负责地图/声望/外观/商店等系统的交互设计与迭代；负责整体系统操作的操作无断点优化。",
        "<strong>玩法相关</strong> | 负责莫格兰之猎（肉鸽）/大世界探索/日常任务等玩法的交互设计和迭代。",
        "<strong>设计规范</strong> | 参与交互组件库从0到1的搭建工作。",
        "<strong>成果&荣誉</strong> | 设计创新专利10+；【UX AWARD-2022】杰出设计三等奖。"
      ]
    }
  ];

  return (
    <section id="resume-timeline" className="w-full">
      <div className="max-w-content mx-auto px-6">
        <div className="flex items-baseline justify-start">
          <div className="font-semibold tracking-wide">项目经历</div>
        </div>
        <div className="h-px bg-border my-4 mb-6"></div>
        <ul className="relative pl-0 m-0 list-none before:content-[''] before:absolute before:left-2 before:top-0 before:bottom-0 before:w-[2px] before:bg-border">
          {experiences.map((exp, idx) => (
            <ResumeItem key={idx} {...exp} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ResumeTimeline;
