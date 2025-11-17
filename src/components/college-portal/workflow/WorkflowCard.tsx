import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, CheckCircle2, LucideIcon } from "lucide-react";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";

interface WorkflowCardProps {
  step: number;
  title: string;
  description: string;
  details: string[];
  deliverable: string;
  badge: string;
  icon: LucideIcon;
  timeline: string;
  color: string;
  delay: number;
}

export function WorkflowCard({
  step,
  title,
  description,
  details,
  deliverable,
  badge,
  icon: Icon,
  timeline,
  color,
  delay,
}: WorkflowCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const colorClasses = {
    blue: {
      badge: "bg-blue-500",
      border: "border-blue-500",
      text: "text-blue-600",
      bg: "bg-blue-50",
      icon: "text-blue-600",
    },
    purple: {
      badge: "bg-purple-500",
      border: "border-purple-500",
      text: "text-purple-600",
      bg: "bg-purple-50",
      icon: "text-purple-600",
    },
    green: {
      badge: "bg-green-500",
      border: "border-green-500",
      text: "text-green-600",
      bg: "bg-green-50",
      icon: "text-green-600",
    },
    orange: {
      badge: "bg-orange-500",
      border: "border-orange-500",
      text: "text-orange-600",
      bg: "bg-orange-50",
      icon: "text-orange-600",
    },
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="relative"
    >
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Card
          className={`relative h-full p-6 border-2 border-gray-200 hover:${colors.border} transition-all duration-300 hover:shadow-xl cursor-pointer bg-white`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Step Number Badge */}
          <div className="absolute -top-5 left-6">
            <motion.div
              className={`w-16 h-16 rounded-full ${colors.badge} flex items-center justify-center shadow-lg`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-white text-2xl font-bold">{step}</span>
            </motion.div>
          </div>

          {/* Timeline Badge */}
          <div className="flex justify-end mb-4">
            <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
              {timeline}
            </Badge>
          </div>

          {/* Icon */}
          <motion.div
            className={`w-16 h-16 rounded-xl ${colors.bg} flex items-center justify-center mb-4 mx-auto`}
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Icon className={`w-8 h-8 ${colors.icon}`} />
          </motion.div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{title}</h3>

          {/* Description */}
          <p className="text-gray-600 text-sm text-center leading-relaxed mb-4">
            {description}
          </p>

          {/* Expandable Details */}
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`${colors.bg} rounded-lg p-4 mb-4`}>
              <ul className="space-y-2">
                {details.map((detail, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isExpanded ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-gray-700 text-sm"
                  >
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.icon}`} />
                    <span>{detail}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Expand Button */}
          <div className="flex items-center justify-center mb-4">
            <motion.button
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-medium"
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <span>{isExpanded ? "Show Less" : "Show Details"}</span>
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Deliverable */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <p className="text-sm font-medium text-center">
              <span className="text-gray-600">Deliverable:</span>{" "}
              <span className="text-gray-900">{deliverable}</span>
            </p>
            <div className="flex justify-center">
              <Badge className={`${colors.badge} text-white border-0`}>{badge}</Badge>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
