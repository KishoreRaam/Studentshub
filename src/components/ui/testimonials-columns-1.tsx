"use client";
import React from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
  rating?: number;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={`overflow-hidden ${props.className ?? ""}`}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration ?? 15,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...Array(2)].map((_, dupIndex) => (
          <React.Fragment key={dupIndex}>
            {props.testimonials.map(({ text, image, name, role, rating = 5 }, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl border border-gray-200 dark:border-gray-700/60
                           bg-white dark:bg-gray-800/70
                           shadow-lg shadow-blue-500/5 dark:shadow-blue-900/10
                           max-w-xs w-full backdrop-blur-sm"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(rating)].map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {text}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-5">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900/50"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-5 text-gray-900 dark:text-white tracking-tight">
                      {name}
                    </span>
                    <span className="text-xs leading-5 text-gray-500 dark:text-gray-400 tracking-tight">
                      {role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
