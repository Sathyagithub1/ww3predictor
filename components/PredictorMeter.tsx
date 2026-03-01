"use client";

import { useEffect, useState } from "react";

interface Props {
  score: number;
  animated?: boolean;
}

function getThreatLabel(score: number): string {
  if (score <= 20) return "LOW RISK";
  if (score <= 40) return "ELEVATED";
  if (score <= 60) return "MODERATE";
  if (score <= 80) return "HIGH ALERT";
  return "CRITICAL";
}

function getThreatColor(score: number): string {
  if (score <= 20) return "#22c55e";
  if (score <= 40) return "#eab308";
  if (score <= 60) return "#f97316";
  if (score <= 80) return "#ef4444";
  return "#dc2626";
}

function getThreatGlow(score: number): string {
  if (score <= 20) return "0 0 30px rgba(34,197,94,0.4)";
  if (score <= 40) return "0 0 30px rgba(234,179,8,0.4)";
  if (score <= 60) return "0 0 30px rgba(249,115,22,0.4)";
  return "0 0 40px rgba(239,68,68,0.5)";
}

export default function PredictorMeter({ score, animated = true }: Props) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }
    // Animate count-up
    const duration = 1500;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score, animated]);

  // SVG arc gauge parameters
  const cx = 150;
  const cy = 150;
  const r = 110;
  const strokeWidth = 16;

  // Arc spans 200° (from -200/2 + 90 = -10° to 190°, i.e., -10° to 190°)
  const startAngle = -200; // degrees from top, going clockwise
  const totalAngle = 200;

  function polarToXY(angleDeg: number, radius: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  function describeArc(startDeg: number, endDeg: number, radius: number) {
    const start = polarToXY(startDeg, radius);
    const end = polarToXY(endDeg, radius);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  const bgStart = -100; // -100 from top = left
  const bgEnd = bgStart + totalAngle; // +200 = right

  const fillFraction = displayScore / 100;
  const fillEnd = bgStart + fillFraction * totalAngle;

  const color = getThreatColor(score);
  const label = getThreatLabel(score);
  const glow = getThreatGlow(score);

  const needleAngle = bgStart + fillFraction * totalAngle;
  const needleTip = polarToXY(needleAngle, r - 10);
  const needleBase = polarToXY(needleAngle + 90, 10);
  const needleBase2 = polarToXY(needleAngle - 90, 10);

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        viewBox="0 0 300 220"
        className="w-full max-w-xs sm:max-w-sm"
        aria-label={`WW3 threat level: ${score}%`}
      >
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <path
          d={describeArc(bgStart, bgEnd, r)}
          fill="none"
          stroke="#1f2937"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Filled arc */}
        {displayScore > 0 && (
          <path
            d={describeArc(bgStart, fillEnd, r)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter="url(#glow)"
            style={{ transition: "stroke 0.3s ease" }}
          />
        )}

        {/* Tick marks */}
        {[0, 20, 40, 60, 80, 100].map((tick) => {
          const angle = bgStart + (tick / 100) * totalAngle;
          const inner = polarToXY(angle, r - strokeWidth / 2 - 6);
          const outer = polarToXY(angle, r + strokeWidth / 2 + 4);
          return (
            <line
              key={tick}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#374151"
              strokeWidth={2}
            />
          );
        })}

        {/* Needle */}
        {displayScore > 0 && (
          <polygon
            points={`${needleTip.x},${needleTip.y} ${needleBase.x},${needleBase.y} ${cx},${cy} ${needleBase2.x},${needleBase2.y}`}
            fill={color}
            filter="url(#strongGlow)"
            opacity={0.9}
          />
        )}

        {/* Center hub */}
        <circle cx={cx} cy={cy} r={12} fill="#111827" stroke={color} strokeWidth={3} />
        <circle cx={cx} cy={cy} r={5} fill={color} />

        {/* Score text */}
        <text
          x={cx}
          y={cy - 35}
          textAnchor="middle"
          fill={color}
          fontSize="48"
          fontWeight="bold"
          fontFamily="monospace"
          filter="url(#glow)"
        >
          {displayScore}%
        </text>

        {/* Label */}
        <text
          x={cx}
          y={cy + 35}
          textAnchor="middle"
          fill={color}
          fontSize="14"
          fontWeight="bold"
          letterSpacing="3"
          fontFamily="sans-serif"
        >
          {label}
        </text>
      </svg>

      {/* Pulse ring for high scores */}
      {score >= 60 && (
        <div
          className="w-4 h-4 rounded-full animate-ping mt-2"
          style={{ backgroundColor: color, boxShadow: glow }}
        />
      )}
    </div>
  );
}
