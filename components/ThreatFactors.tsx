import { AlertTriangle } from "lucide-react";

interface Props {
  factors: string[];
  score: number;
}

function getBulletColor(score: number): string {
  if (score <= 20) return "text-green-400";
  if (score <= 40) return "text-yellow-400";
  if (score <= 60) return "text-orange-400";
  return "text-red-400";
}

export default function ThreatFactors({ factors, score }: Props) {
  const bulletColor = getBulletColor(score);

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        <h2 className="text-white font-semibold text-lg">
          Key Factors Driving Score
        </h2>
      </div>
      <ul className="space-y-3">
        {factors.map((factor, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={`${bulletColor} font-bold text-lg leading-none mt-0.5`}>
              •
            </span>
            <span className="text-gray-300 text-sm leading-relaxed">{factor}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
