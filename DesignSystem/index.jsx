import React, { useMemo, useState } from 'react';
import { cssVariables, theme } from './theme';
import FigmaButton from './components/FigmaButton';
import IconButton from './components/IconButton';
import { AddIcon, ArrowRightIcon, CheckIcon, ActivityIcon, AgentIcon } from './components/Icons';

const tabs = [
  { key: 'typography', label: 'Typography' },
  { key: 'color', label: 'Color' },
  { key: 'button', label: 'Button' },
  { key: 'icon-button', label: 'Icon Button' },
];

const colorTokens = [
  { name: 'color-background-primary', variable: '--bg-primary', light: '#FFFFFF', dark: '#1F1E1D' },
  { name: 'color-background-secondary', variable: '--bg-secondary', light: '#F5F4F1', dark: '#30302E' },
  { name: 'color-text-primary', variable: '--text-primary', light: '#141413', dark: '#FFFFFF' },
  { name: 'color-text-secondary', variable: '--text-secondary', light: '#73726C', dark: '#A1A09A' },
  { name: 'color-border-default', variable: '--border-default', light: '#E6E4DD', dark: '#454543' },
  { name: 'color-button-default', variable: '--btn-default-bg', light: '#141413', dark: '#141413' },
  { name: 'color-button-secondary', variable: '--btn-secondary-bg', light: '#FFFFFF', dark: '#FFFFFF' },
  { name: 'color-button-danger', variable: '--btn-danger-bg', light: '#B53333', dark: '#B53333' },
];

const typographyTokens = [
  { name: 'Display', style: theme.typography.scale.display, sample: 'Design System' },
  { name: 'Heading', style: theme.typography.scale.heading, sample: 'Token Documentation' },
  { name: 'Body', style: theme.typography.scale.body, sample: 'The quick brown fox jumps over the lazy dog.' },
  { name: 'Body Small', style: theme.typography.scale.bodySmall, sample: 'Component usage and spacing guidance.' },
  { name: 'Caption', style: theme.typography.scale.caption, sample: '--color-background-primary' },
];

const pixelTypographyTokens = [
  { name: 'Display', style: { ...theme.typography.scale.display, fontFamily: theme.typography.fontFamily.pixel }, sample: 'Design System' },
  { name: 'Heading', style: { ...theme.typography.scale.heading, fontFamily: theme.typography.fontFamily.pixel }, sample: 'Token Documentation' },
  { name: 'Body', style: { ...theme.typography.scale.body, fontFamily: theme.typography.fontFamily.pixel }, sample: 'The quick brown fox jumps over the lazy dog.' },
  { name: 'Body Small', style: { ...theme.typography.scale.bodySmall, fontFamily: theme.typography.fontFamily.pixel }, sample: 'Component usage and spacing guidance.' },
  { name: 'Caption', style: { ...theme.typography.scale.caption, fontFamily: theme.typography.fontFamily.pixel }, sample: '--color-background-primary' },
];

const modernTypographyTokens = [
  { name: 'Display', style: { ...theme.typography.scale.display, fontFamily: theme.typography.fontFamily.sans }, sample: 'Design System' },
  { name: 'Heading', style: { ...theme.typography.scale.heading, fontFamily: theme.typography.fontFamily.sans }, sample: 'Token Documentation' },
  { name: 'Body', style: { ...theme.typography.scale.body, fontFamily: theme.typography.fontFamily.sans }, sample: 'The quick brown fox jumps over the lazy dog.' },
  { name: 'Body Small', style: { ...theme.typography.scale.bodySmall, fontFamily: theme.typography.fontFamily.sans }, sample: 'Component usage and spacing guidance.' },
  { name: 'Caption', style: { ...theme.typography.scale.caption, fontFamily: theme.typography.fontFamily.sans }, sample: '--color-background-primary' },
];

const buttonMatrix = [
  { variant: 'Default', state: 'Default' },
  { variant: 'Default', state: 'Focused' },
  { variant: 'Default', state: 'Disabled' },
  { variant: 'Secondary', state: 'Default' },
  { variant: 'Secondary', state: 'Focused' },
  { variant: 'Secondary', state: 'Disabled' },
  { variant: 'Danger', state: 'Default' },
  { variant: 'Danger', state: 'Focused' },
  { variant: 'Danger', state: 'Disabled' },
];

const iconButtonMatrix = [
  { variant: 'Default', state: 'Default', icon: <AddIcon /> },
  { variant: 'Default', state: 'Focused', icon: <AddIcon /> },
  { variant: 'Default', state: 'Disabled', icon: <AddIcon /> },
  { variant: 'Secondary', state: 'Default', icon: <ArrowRightIcon /> },
  { variant: 'Secondary', state: 'Focused', icon: <ArrowRightIcon /> },
  { variant: 'Secondary', state: 'Disabled', icon: <ArrowRightIcon /> },
  { variant: 'Danger', state: 'Default', icon: <CheckIcon /> },
  { variant: 'Danger', state: 'Focused', icon: <CheckIcon /> },
  { variant: 'Danger', state: 'Disabled', icon: <CheckIcon /> },
  { variant: 'Ghost', state: 'Default', icon: <ActivityIcon /> },
];

const DesignSystemPreview = () => {
  const [activeTab, setActiveTab] = useState('typography');
  const [typographyMode, setTypographyMode] = useState('modern'); // 'modern' (default) or 'pixel'
  const [darkMode, setDarkMode] = useState(false);

  const tabTitle = useMemo(() => tabs.find((tab) => tab.key === activeTab)?.label ?? 'Button', [activeTab]);

  const toggleDarkMode = () => {
    setDarkMode((value) => !value);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 font-sans`}>
      <style>{cssVariables}</style>
      <header className="sticky top-0 z-20 border-b border-[var(--border-default)] bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-btn-default-bg text-btn-default-text flex items-center justify-center">
              <AgentIcon />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Design System Spec Preview</h1>
              <p className="text-sm text-[var(--text-secondary)]">Current section: {tabTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="h-9 px-4 rounded-md border border-[var(--border-default)] text-sm hover:bg-[var(--bg-secondary)]"
          >
            {darkMode ? '切换浅色' : '切换深色'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-wrap gap-2 border-b border-[var(--border-default)] pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`h-9 px-4 rounded-md text-sm transition-colors ${
                activeTab === tab.key
                  ? 'bg-btn-default-bg text-btn-default-text'
                  : 'border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'button' && (
          <section className="pt-8 space-y-6">
            <h2 className="text-xl font-semibold">Button Spec</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {buttonMatrix.map((item) => (
                <div key={`${item.variant}-${item.state}`} className="rounded-lg border border-[var(--border-default)] p-4 space-y-3">
                  <div className="text-xs text-[var(--text-secondary)]">{item.variant} / {item.state}</div>
                  <FigmaButton variant={item.variant} state={item.state} label="Button" />
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'icon-button' && (
          <section className="pt-8 space-y-6">
            <h2 className="text-xl font-semibold">Icon Button Spec</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {iconButtonMatrix.map((item, index) => (
                <div key={`${item.variant}-${item.state}-${index}`} className="rounded-lg border border-[var(--border-default)] p-4 space-y-3">
                  <div className="text-xs text-[var(--text-secondary)]">{item.variant} / {item.state}</div>
                  <IconButton variant={item.variant} state={item.state} icon={item.icon} />
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'color' && (
          <section className="pt-8 space-y-6">
            <h2 className="text-xl font-semibold">Color Spec</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorTokens.map((token) => (
                <div key={token.name} className="rounded-lg border border-[var(--border-default)] overflow-hidden">
                  <div className="h-20" style={{ backgroundColor: token.light }} />
                  <div className="p-4 space-y-1">
                    <p className="text-sm font-medium">{token.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{token.variable}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Light: {token.light}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Dark: {token.dark}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'typography' && (
          <section className="pt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Typography Spec</h2>
              <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg">
                <button
                  onClick={() => setTypographyMode('modern')}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                    typographyMode === 'modern'
                      ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Modern (MiSans)
                </button>
                <button
                  onClick={() => setTypographyMode('pixel')}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                    typographyMode === 'pixel'
                      ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Pixel (Fusion)
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {(typographyMode === 'pixel' ? pixelTypographyTokens : modernTypographyTokens).map((token) => (
                <div key={token.name} className="rounded-lg border border-[var(--border-default)] p-5">
                  <p className="text-xs text-[var(--text-secondary)] mb-2">{token.name}</p>
                  <p
                    style={{
                      fontFamily: token.style.fontFamily,
                      fontWeight: token.style.fontWeight,
                      fontSize: token.style.fontSize,
                      lineHeight: token.style.lineHeight,
                      letterSpacing: token.style.letterSpacing,
                    }}
                  >
                    {token.sample}
                  </p>
                  <p className="mt-3 text-xs text-[var(--text-secondary)]">
                    {token.style.fontFamily.split(',')[0].replace(/"/g, '')} / {token.style.fontWeight} / {token.style.fontSize} / {token.style.lineHeight}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default DesignSystemPreview;
