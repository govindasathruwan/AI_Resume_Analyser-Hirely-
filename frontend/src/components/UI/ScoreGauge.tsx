import React, { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return { stroke: '#34c759', label: 'Excellent', bg: 'rgba(52,199,89,0.10)', text: '#1a9c3c' };
  if (score >= 65) return { stroke: '#0071e3', label: 'Good',      bg: 'rgba(0,113,227,0.08)', text: '#0071e3' };
  if (score >= 50) return { stroke: '#ff9500', label: 'Average',   bg: 'rgba(255,149,0,0.10)', text: '#b36a00' };
  if (score >= 35) return { stroke: '#ff6b00', label: 'Below Avg', bg: 'rgba(255,107,0,0.10)', text: '#cc4400' };
  return              { stroke: '#ff3b30', label: 'Poor',      bg: 'rgba(255,59,48,0.10)', text: '#cc2e25' };
};

const sizes = {
  sm: { r: 36, cx: 50,  cy: 50,  viewBox: '0 0 100 100', stroke: 7,  fontSize: 20, container: 'w-24 h-24' },
  md: { r: 44, cx: 60,  cy: 60,  viewBox: '0 0 120 120', stroke: 8,  fontSize: 26, container: 'w-32 h-32' },
  lg: { r: 56, cx: 72,  cy: 72,  viewBox: '0 0 144 144', stroke: 10, fontSize: 36, container: 'w-44 h-44' },
};

const ScoreGauge = ({ score, label, size = 'md', showLabel = true }: ScoreGaugeProps) => {
  const [animated, setAnimated] = useState(0);
  const color        = getScoreColor(score);
  const cfg          = sizes[size];
  const circumference= 2 * Math.PI * cfg.r;
  const offset       = ((100 - animated) / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      let cur = 0;
      const step = score / 60;
      const iv = setInterval(() => {
        cur += step;
        if (cur >= score) { setAnimated(score); clearInterval(iv); }
        else              { setAnimated(Math.floor(cur)); }
      }, 16);
      return () => clearInterval(iv);
    }, 200);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${cfg.container} flex items-center justify-center`}>
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox={cfg.viewBox}>
          {/* Track */}
          <circle cx={cfg.cx} cy={cfg.cy} r={cfg.r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={cfg.stroke} />
          {/* Progress */}
          <circle
            cx={cfg.cx} cy={cfg.cy} r={cfg.r}
            fill="none" stroke={color.stroke}
            strokeWidth={cfg.stroke} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
        </svg>
        <div className="text-center z-10">
          <span style={{ fontSize: cfg.fontSize, fontWeight: 700, color: color.stroke, letterSpacing: '-1px' }}>
            {animated}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-subtle)', display: 'block' }}>/100</span>
        </div>
      </div>
      {showLabel && (
        <div className="text-center">
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>{label}</p>
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ background: color.bg, color: color.text }}>
            {color.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default ScoreGauge;
