import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Scale } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { differenceInMonths, differenceInYears, parseISO, isAfter, addDays } from 'date-fns';

export default function CaseCard({ caseData, index = 0 }) {
  const navigate = useNavigate();
  const lang = localStorage.getItem('nyaya_lang') || 'hindi';

  const arrestDate = parseISO(caseData.arrest_date);
  const now = new Date();
  const years = differenceInYears(now, arrestDate);
  const months = differenceInMonths(now, arrestDate) % 12;
  const custodyText = lang === 'hindi'
    ? `${years} साल ${months} महीने हिरासत में`
    : `${years} years ${months} months in custody`;

  const nextHearing = caseData.next_hearing ? parseISO(caseData.next_hearing) : null;
  const isUpcoming = nextHearing && isAfter(nextHearing, now) && !isAfter(nextHearing, addDays(now, 7));

  const summary = lang === 'hindi'
    ? caseData.ai_summary_hindi
    : caseData.ai_summary_english;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className="card cursor-pointer group"
      onClick={() => navigate(`/case/${caseData.id}`)}
    >
      {/* Row 1: Name + Status */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-devanagari text-lg text-accent-saffron font-semibold">
          {caseData.prisoner_name}
        </h3>
        <StatusBadge status={caseData.case_status} />
      </div>

      {/* Row 2: FIR + Police Station */}
      <div className="flex items-center gap-3 mb-2 text-text-tertiary text-[13px]">
        <span className="font-mono">{caseData.fir_number}</span>
        <span className="flex items-center gap-1">
          <MapPin size={12} /> {caseData.police_station}
        </span>
      </div>

      {/* Row 3: Court + Judge */}
      <div className="text-text-secondary text-[13px] mb-2">
        <Scale size={12} className="inline mr-1" />
        {caseData.court_name} — {caseData.judge_name}
      </div>

      {/* Row 4: Custody duration */}
      <div className={`text-sm font-medium mb-2 ${years >= 2 ? 'text-accent-red' : 'text-text-secondary'}`}>
        ⏱ {custodyText}
      </div>

      {/* Row 5: Next hearing */}
      {nextHearing && (
        <div className={`flex items-center gap-2 text-sm mb-3 ${isUpcoming ? 'text-accent-saffron' : 'text-text-secondary'}`}>
          <Calendar size={14} className={isUpcoming ? 'animate-pulse-saffron rounded-full' : ''} />
          <span>
            {lang === 'hindi' ? 'अगली सुनवाई: ' : 'Next hearing: '}
            {nextHearing.toLocaleDateString('hi-IN')}
          </span>
        </div>
      )}

      {/* Row 6: Summary preview */}
      {summary && (
        <p className="text-text-tertiary text-xs leading-relaxed line-clamp-2 mb-3 font-devanagari">
          {summary.slice(0, 120)}...
        </p>
      )}

      {/* Bottom CTA */}
      <div className="text-right">
        <span className="text-accent-saffron text-sm font-medium group-hover:underline">
          {lang === 'hindi' ? 'देखें →' : 'View →'}
        </span>
      </div>
    </motion.div>
  );
}
