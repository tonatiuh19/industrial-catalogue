import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";

interface LoadingMaskProps {
  isLoading: boolean;
  message?: string;
  fullscreen?: boolean;
}

export const LoadingMask = ({
  isLoading,
  message = "Cargando...",
  fullscreen = true,
}: LoadingMaskProps) => {
  if (!isLoading) return null;

  const containerClasses = fullscreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#1b3148]/95 via-[#1b3148]/90 to-[#1b3148]/95 backdrop-blur-sm"
    : "absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={containerClasses}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="flex flex-col items-center gap-6 rounded-3xl bg-white p-10 shadow-2xl border border-gray-100"
        >
          {/* Animated gear system */}
          <div className="relative h-32 w-32">
            {/* Large outer gear */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Settings
                className="h-32 w-32 text-[#c03818]"
                strokeWidth={1.5}
              />
            </motion.div>

            {/* Medium gear (top right) */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -right-8 -top-8 flex items-center justify-center"
            >
              <Settings
                className="h-20 w-20 text-[#1b3148]"
                strokeWidth={1.5}
              />
            </motion.div>

            {/* Small gear (bottom left) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -bottom-6 -left-6 flex items-center justify-center"
            >
              <Settings
                className="h-16 w-16 text-[#c03818]/70"
                strokeWidth={1.5}
              />
            </motion.div>

            {/* Pulsing center circle */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#c03818] to-[#1b3148]"
            />
          </div>

          {/* Loading text with animation */}
          <div className="flex flex-col items-center gap-3">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-[#1b3148]"
            >
              {message}
            </motion.p>

            {/* Animated progress bar */}
            <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-full w-1/3 bg-gradient-to-r from-[#c03818] via-[#c03818] to-[#1b3148]"
              />
            </div>

            {/* Animated dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                  className="h-2.5 w-2.5 rounded-full bg-[#c03818]"
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
              }}
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                ],
                scale: [0, 1, 0],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
              className="absolute h-2 w-2 rounded-full bg-[#c03818]"
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Smaller inline loading spinner
export const LoadingSpinner = ({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`${sizeClasses[size]} rounded-full border-2 border-gray-300 border-t-blue-600`}
    />
  );
};
