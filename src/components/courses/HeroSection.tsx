import { BookOpen, Bookmark } from "lucide-react";

import { Button } from "@/components/ui/button";

type HeroSectionProps = {
  onBrowseClick: () => void;
  onSavedClick: () => void;
};

export function HeroSection({ onBrowseClick, onSavedClick }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2563eb] via-[#1d4ed8] to-[#16a34a] dark:from-[#1e40af] dark:via-[#166534] dark:to-[#15803d] p-12 md:p-16 lg:p-20">
      {/* Decorative blur bubbles */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 dark:bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-10 right-10 w-80 h-80 bg-[#16a34a]/20 dark:bg-[#16a34a]/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-white mb-4">
          Unlock Free Courses & Certifications for Students
        </h1>
        <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
          Access premium learning platforms and skill-building programs at no cost.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onBrowseClick}
            className="bg-gradient-to-r from-white to-white/90 dark:from-slate-100 dark:to-slate-200 text-[#2563eb] dark:text-[#1e40af] hover:from-white/90 hover:to-white/80 dark:hover:from-slate-200 dark:hover:to-slate-300 transition-all duration-300 px-8 py-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Browse Courses
          </Button>

          <Button
            onClick={onSavedClick}
            variant="outline"
            className="bg-white/20 dark:bg-white/10 backdrop-blur-md text-white border-2 border-white/60 dark:border-white/30 hover:bg-white/30 dark:hover:bg-white/20 hover:border-white/80 dark:hover:border-white/40 transition-all duration-300 px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl"
          >
            <Bookmark className="mr-2 h-5 w-5" />
            Saved Courses
          </Button>
        </div>
      </div>
    </div>
  );
}
