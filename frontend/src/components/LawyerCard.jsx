import { motion } from 'framer-motion';
import { Star, Phone, Shield } from 'lucide-react';

export default function LawyerCard({ lawyer, index = 0 }) {
  const initials = lawyer.name.replace('Adv. ', '').split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card-elevated"
    >
      {/* Row 1: Avatar + Name + Badge */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-accent-saffron/20 flex items-center justify-center 
          text-accent-saffron font-bold text-sm flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-text-primary truncate">{lawyer.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {lawyer.is_legal_aid ? (
              <span className="badge bg-accent-green/15 text-green-400 text-[10px]">
                <Shield size={10} className="mr-1" /> Legal Aid Free
              </span>
            ) : (
              <span className="badge bg-amber-500/15 text-amber-400 text-[10px]">
                Fees Negotiable
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Bar Council */}
      <p className="font-mono text-xs text-text-tertiary mb-2">
        {lawyer.bar_council_number} • {lawyer.district}
      </p>

      {/* Row 3: Rating + Cases */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} 
              className={i < Math.floor(lawyer.rating) ? 'text-accent-gold fill-accent-gold' : 'text-text-tertiary'} />
          ))}
          <span className="text-xs text-text-secondary ml-1">{lawyer.rating}</span>
        </div>
        <span className="text-xs text-text-tertiary">{lawyer.cases_handled} cases</span>
      </div>

      {/* Row 4: Specialization */}
      <div className="flex flex-wrap gap-1 mb-3">
        {lawyer.specialization.split(', ').map((spec) => (
          <span key={spec} className="text-[10px] bg-bg-primary/50 text-text-secondary px-2 py-0.5 rounded-full border border-border-default">
            {spec}
          </span>
        ))}
      </div>

      {/* Row 5: Languages */}
      <div className="flex flex-wrap gap-1 mb-3">
        {lawyer.languages.split(', ').map((lang) => (
          <span key={lang} className="text-[10px] bg-accent-saffron/5 text-accent-saffron px-2 py-0.5 rounded-full">
            {lang}
          </span>
        ))}
      </div>

      {/* Row 6: Actions */}
      <div className="flex items-center gap-2">
        <a href={`tel:${lawyer.phone}`}
          className="btn-saffron text-sm flex items-center gap-1.5 flex-1 justify-center !py-2">
          <Phone size={14} /> Call Now
        </a>
        {lawyer.is_legal_aid && (
          <span className="text-[10px] text-accent-green font-medium">DLSA Empanelled ✓</span>
        )}
      </div>

      {/* Note */}
      {lawyer.note && (
        <p className="text-xs text-text-tertiary italic mt-3">{lawyer.note}</p>
      )}
    </motion.div>
  );
}
