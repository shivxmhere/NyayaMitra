import { motion } from 'framer-motion';
import { parseISO, isAfter } from 'date-fns';

const typeColors = {
  bail: 'bg-amber-500/15 text-amber-400',
  framing: 'bg-blue-500/15 text-blue-400',
  evidence: 'bg-purple-500/15 text-purple-400',
  arguments: 'bg-green-500/15 text-green-400',
  judgment: 'bg-red-500/15 text-red-400',
};

const typeLabels = {
  bail: 'जमानत', framing: 'आरोप तय', evidence: 'साक्ष्य',
  arguments: 'बहस', judgment: 'फैसला',
};

export default function HearingTimeline({ hearings }) {
  const now = new Date();
  const sorted = [...hearings].sort((a, b) => new Date(a.hearing_date) - new Date(b.hearing_date));

  return (
    <div className="relative">
      {sorted.map((hearing, index) => {
        const hearingDate = parseISO(hearing.hearing_date);
        const isFuture = isAfter(hearingDate, now);
        const isNext = isFuture && (index === 0 || !isAfter(parseISO(sorted[index - 1]?.hearing_date), now));

        return (
          <motion.div
            key={hearing.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex gap-4 pb-6 last:pb-0"
          >
            {/* Left: connector + date circle */}
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0
                ${isNext
                  ? 'bg-accent-saffron/20 border-accent-saffron text-accent-saffron animate-pulse-saffron'
                  : isFuture
                    ? 'bg-accent-gold/10 border-accent-gold/50 text-accent-gold'
                    : 'bg-bg-elevated border-text-tertiary/30 text-text-tertiary'}`}
              >
                {hearingDate.getDate()}
              </div>
              {index < sorted.length - 1 && (
                <div className={`w-px flex-1 mt-1 ${isFuture ? 'border-l border-dashed border-text-tertiary/30' : 'bg-text-tertiary/20'}`}
                  style={{ minHeight: '30px' }} />
              )}
            </div>

            {/* Right: card */}
            <div className={`flex-1 card !p-3 ${isNext ? '!border-accent-saffron/40' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`badge text-[10px] ${typeColors[hearing.hearing_type] || 'bg-gray-500/15 text-gray-400'}`}>
                  {typeLabels[hearing.hearing_type] || hearing.hearing_type}
                </span>
                <span className="text-xs text-text-tertiary">
                  {hearingDate.toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-text-secondary">{hearing.court_name}</p>
              <p className="text-xs text-text-tertiary">{hearing.judge_name}</p>
              {hearing.outcome && (
                <p className="text-sm text-text-primary mt-2 font-devanagari">{hearing.outcome}</p>
              )}
              {hearing.notes && (
                <p className="text-xs text-text-tertiary mt-1 italic">{hearing.notes}</p>
              )}
              {isNext && (
                <div className="mt-2 text-xs text-accent-saffron font-semibold font-devanagari">
                  ⚡ अगली सुनवाई
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
