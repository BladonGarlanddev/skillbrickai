import { motion, AnimatePresence } from 'motion/react';
import styles from './SuccessCheckmark.module.scss';

interface SuccessCheckmarkProps {
  visible: boolean;
  label?: string;
}

export function SuccessCheckmark({ visible, label = 'Copied!' }: SuccessCheckmarkProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className={styles.content}>
            <motion.div
              className={styles.circle}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            >
              <motion.svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
                />
              </motion.svg>
            </motion.div>

            <motion.p
              className={styles.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {label}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
