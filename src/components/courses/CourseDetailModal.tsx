import { Calendar, Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { Course } from "./CourseCard";

type CourseDetailModalProps = {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
  onSave: () => void;
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

export function CourseDetailModal({ course, isOpen, onClose, onClaim, onSave }: CourseDetailModalProps) {
  if (!course) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-[color:var(--color-card)] dark:text-[color:var(--color-card-foreground)] rounded-3xl border border-transparent dark:border-[color:var(--color-border)] shadow-2xl">
        <DialogTitle className="sr-only">{course.provider} - Free Courses</DialogTitle>
        <DialogDescription className="sr-only">{course.description}</DialogDescription>

        <div className="grid md:grid-cols-5 min-h-[600px]">
          {/* Left Side - Provider Logo & Gradient */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#2563eb] to-[#16a34a] dark:from-[#0f172a] dark:via-[#0f766e] dark:to-[#0b3b4c] p-8 flex flex-col items-center justify-center rounded-l-3xl relative">
            <div className="absolute top-4 right-4 md:hidden">
              <button
                type="button"
                onClick={onClose}
                className="p-2 bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-full hover:bg-white/30 dark:hover:bg-white/20 transition-all"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="w-32 h-32 bg-white dark:bg-slate-900/80 rounded-3xl shadow-2xl dark:shadow-[0_18px_45px_-30px_rgba(37,99,235,0.75)] flex items-center justify-center mb-6 border border-white/40 dark:border-[rgba(148,163,184,0.25)]">
              <span className="text-6xl">{course.logo}</span>
            </div>

            <h2 className="text-white text-center mb-2">{course.provider}</h2>

            <Badge className={`${categoryColors[course.category] || "bg-gray-600 text-white"} px-4 py-1 rounded-full`}>
              {course.category}
            </Badge>

            {/* Decorative elements */}
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 dark:bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 dark:bg-white/5 rounded-full blur-2xl"></div>
          </div>

          {/* Right Side - Course Details */}
          <div className="md:col-span-3 p-8 relative bg-white dark:bg-transparent">
            <div className="hidden md:block absolute top-4 right-4">
              <button
                type="button"
                onClick={onClose}
                className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
              >
                <X className="h-5 w-5 text-[#475569] dark:text-slate-400" />
              </button>
            </div>

            <div className="space-y-6 mt-8 md:mt-0">
              {/* Description */}
              <div>
                <p className="text-[#475569] dark:text-slate-300">{course.description}</p>
              </div>

              {/* Courses Available */}
              <div>
                <h3 className="text-[#1e293b] dark:text-white mb-3">Courses Available</h3>
                <div className="space-y-2">
                  {course.courses.map((courseName) => (
                    <div key={courseName} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-[#16a34a] dark:text-[#22c55e] flex-shrink-0 mt-0.5" />
                      <span className="text-[#475569] dark:text-slate-300 text-sm">{courseName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How to Verify */}
              <div>
                <h3 className="text-[#1e293b] dark:text-white mb-3">How to Verify</h3>
                <div className="space-y-3">
                  {course.verificationSteps.map((step, index) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#2563eb] to-[#16a34a] dark:from-[#1e40af] dark:to-[#15803d] text-white flex items-center justify-center flex-shrink-0 text-sm">
                        {index + 1}
                      </div>
                      <span className="text-[#475569] dark:text-slate-300 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validity */}
              <div className="bg-gradient-to-r from-[#f8fbff] to-[#e0f2fe] dark:from-slate-900/60 dark:to-slate-900/30 p-4 rounded-xl border border-[#2563eb]/20 dark:border-[color:var(--color-border)]">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-5 w-5 text-[#2563eb] dark:text-[#60a5fa]" />
                  <h4 className="text-[#1e293b] dark:text-slate-100">Validity</h4>
                </div>
                <p className="text-[#475569] dark:text-slate-300 text-sm">{course.validity}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={onClaim}
                  className="flex-1 bg-gradient-to-r from-[#2563eb] to-[#16a34a] dark:from-[#2563eb] dark:to-[#16a34a] text-white shadow-md hover:shadow-xl hover:shadow-[#2563eb]/30 dark:hover:shadow-[0_18px_35px_-18px_rgba(37,99,235,0.55)] transition-all duration-300 rounded-xl py-6"
                >
                  Claim Now
                </Button>
                <Button
                  onClick={onSave}
                  variant="outline"
                  className="flex-1 border-2 border-[#2563eb] dark:border-[#3b82f6] text-[#2563eb] dark:text-[#3b82f6] hover:bg-[#2563eb] dark:hover:bg-[#1e40af] hover:text-white dark:hover:text-white transition-all duration-300 rounded-xl py-6"
                >
                  Save for Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
