import { motion } from "framer-motion";

const Equalizer = ({ values = [], active }) => {
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-1 px-6 pb-6 pointer-events-none">
      {values.map((val, i) => (
        <motion.div
          key={i}
          initial={{ height: 0, opacity: 0 }}
          animate={
            active
              ? {
                  height: `${Math.min(val * 10, 100)}%`,
                  opacity: 0.9,
                }
              : { height: 0, opacity: 0 }
          }
          transition={{
            repeat: active ? Infinity : 0,
            repeatType: "mirror",
            duration: 0.6 + i * 0.1,
            ease: "easeInOut",
          }}
          className="w-2 rounded-full bg-gradient-to-t from-purple-500 to-orange-400"
        />
      ))}
    </div>
  );
};

export default Equalizer;
