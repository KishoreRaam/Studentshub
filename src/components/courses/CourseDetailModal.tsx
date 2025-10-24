import { Calendar, Check, X, Gift, Bookmark } from "lucide-react";

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-gray-900 border-0 rounded-2xl shadow-2xl">
        <DialogTitle className="sr-only">{course.provider} - Free Courses</DialogTitle>
        <DialogDescription className="sr-only">{course.description}</DialogDescription>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-800 p-8 rounded-t-2xl border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
              <span className="text-5xl">{course.logo}</span>
            </div>

            {/* Title and Category */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{course.provider}</h2>
              <Badge className={`${categoryColors[course.category] || "bg-gray-600 text-white"} px-3 py-1 rounded-full text-sm font-medium`}>
                {course.category}
              </Badge>
              <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">{course.description}</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-6 bg-white dark:bg-gray-900">
          {/* Validity Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Validity</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{course.validity}</p>
          </div>

          {/* Courses Available */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Courses Available</h3>
            <div className="space-y-2.5">
              {course.courses.map((courseName) => (
                <div key={courseName} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{courseName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How to Get Started */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Get Started</h3>
            <div className="space-y-3">
              {course.verificationSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-green-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-md">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pt-1">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <a
              href={course.claimLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button
                onClick={onClaim}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl h-14 font-bold text-lg hover:scale-[1.02]"
                type="button"
              >
                <Gift className="mr-2 h-6 w-6" />
                Claim Now
              </Button>
            </a>
            <Button
              onClick={onSave}
              variant="outline"
              className="flex-1 bg-white dark:bg-gray-800 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-700 dark:hover:border-blue-400 transition-all duration-200 rounded-xl h-14 font-semibold text-lg hover:scale-[1.02]"
              type="button"
            >
              <Bookmark className="mr-2 h-5 w-5" />
              Save for Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
