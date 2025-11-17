import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function TimelineBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("timeline-bar");
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const percentage = (visibleHeight / rect.height) * 100;
        setProgress(Math.min(percentage, 100));
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const milestones = [
    { day: "Day 1", label: "Initial Call", position: 0 },
    { day: "Day 2-5", label: "Docs & Verify", position: 33.3 },
    { day: "Day 6-10", label: "Setup System", position: 66.6 },
    { day: "Day 11-14", label: "Launch & Train", position: 100 },
  ];

  return (
    <div id="timeline-bar" className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Timeline</h3>
        <p className="text-gray-600 text-sm">2 Weeks from Registration to Go-Live</p>
      </div>

      <div className="relative">
        {/* Background bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Milestones */}
        <div className="relative mt-4">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${milestone.position}%` }}
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              {/* Dot */}
              <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
                <motion.div
                  className={`w-4 h-4 rounded-full border-4 border-white shadow-md ${
                    index === 0
                      ? "bg-blue-500"
                      : index === 1
                      ? "bg-purple-500"
                      : index === 2
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                  whileHover={{ scale: 1.5 }}
                />
              </div>

              {/* Label */}
              <div className="text-center mt-2">
                <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{milestone.day}</p>
                <p className="text-xs text-gray-600 whitespace-nowrap">{milestone.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
