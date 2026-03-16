import { motion } from 'framer-motion';

export default function StatCard({ label, value, trend, icon: Icon, color = 'text-accent-saffron' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] text-text-secondary mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {trend && <p className="text-xs text-text-tertiary mt-1">{trend}</p>}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-accent-saffron/10 flex items-center justify-center">
            <Icon size={20} className="text-accent-saffron" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
