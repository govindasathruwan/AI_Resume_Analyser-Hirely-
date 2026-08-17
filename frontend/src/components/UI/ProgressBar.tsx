import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'primary' | 'emerald' | 'blue' | 'yellow' | 'red' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
}

const colorMap: Record<string, string> = {
  primary: '#0071e3',
  blue:    '#0071e3',
  emerald: '#34c759',
  yellow:  '#ff9500',
  red:     '#ff3b30',
  cyan:    '#32ade6',
};

const heightMap = { sm: 5, md: 7, lg: 10 };

const ProgressBar = ({
  value, max = 100, label, showValue = true,
  color = 'primary', size = 'md',
}: ProgressBarProps) => {
  const pct   = Math.min((value / max) * 100, 100);
  const fill  = colorMap[color] || colorMap.primary;
  const h     = heightMap[size];

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label     && <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>}
          {showValue && <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{ height: h, borderRadius: 999, background: 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: fill,
            borderRadius: 999,
            transition: 'width 1s ease-out',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
