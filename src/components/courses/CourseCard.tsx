import { type MouseEvent } from "react";
import { Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Course = {
  id: string;
  provider: string;
  logo: string;
  category: string;
  description: string;
  validity: string;
  verificationMethod: string;
  courses: string[];
  verificationSteps: string[];
};

type CourseCardProps = {
  course: Course;
  onClick: () => void;
};

const categoryColors: Record<string, string> = {
  Development: "bg-[#16a34a] text-white",
  Cloud: "bg-[#2563eb] text-white",
  "AI & ML": "bg-purple-600 text-white",
  Design: "bg-pink-600 text-white",
  Business: "bg-orange-600 text-white",
  "Data Science": "bg-teal-600 text-white",
  Productivity: "bg-indigo-600 text-white",
};

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-gray-100/80 dark:border-[color:var(--color-border)] bg-white/95 dark:bg-[color:var(--color-card)] dark:bg-opacity-95 backdrop-blur-md shadow-md hover:shadow-xl dark:shadow-[0_18px_48px_-28px_rgba(15,23,42,0.65)] dark:hover:shadow-[0_26px_60px_-34px_rgba(148,163,184,0.55)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-[#2563eb]/12 via-transparent to-[#16a34a]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Card Content */}
      <div className="relative p-6 flex flex-col h-full">
        {/* Header with Logo and Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 bg-white dark:bg-slate-900/70 rounded-xl shadow-lg dark:shadow-[0_10px_30px_-18px_rgba(59,130,246,0.75)] flex items-center justify-center p-2 border border-gray-100/80 dark:border-[rgba(148,163,184,0.25)]">
            <span className="text-2xl">{course.logo}</span>
          </div>
          <Badge className={`${categoryColors[course.category] || "bg-gray-600 text-white"} px-3 py-1 rounded-full`}>
            {course.category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-[#1e293b] dark:text-slate-100 mb-2">{course.provider}</h3>

        {/* Description */}
        <p className="text-[#475569] dark:text-slate-300 text-sm mb-4 line-clamp-2 flex-grow">{course.description}</p>

        {/* Validity */}
        <div className="mb-4">
          <p className="text-sm text-[#475569] dark:text-slate-300">{course.validity}</p>
        </div>

        {/* Verification Method */}
        <div className="flex items-center gap-2 mb-6">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 text-sm text-[#475569] dark:text-slate-200">
                  <Info className="h-4 w-4" />
                  <span>{course.verificationMethod}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-white text-[#1e293b] shadow-lg dark:bg-[color:var(--color-card)] dark:text-[color:var(--color-card-foreground)] dark:border dark:border-[color:var(--color-border)]">
                <div className="space-y-1">
                  {course.verificationSteps.map((step, index) => (
                    <p key={step} className="text-xs">
                      {index + 1}. {step}
                    </p>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Claim Button */}
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl py-6 group-hover:scale-[1.02]"
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            onClick();
          }}
        >
          Claim Courses
        </Button>
      </div>
    </div>
  );
}

export type { Course };
