import { Brain, Code, FileText, Presentation, Cpu, Wrench, Construction, Calculator } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";

type Category = "All" | "AIML" | "ECE" | "Mechanical" | "Civil" | "CS";

interface AITool {
  id: number;
  icon: any;
  name: string;
  tagline: string;
  categories: Category[];
  gradient: string;
}

const aiTools: AITool[] = [
  {
    id: 1,
    icon: Brain,
    name: "NoteSummarizer AI",
    tagline: "Summarize notes instantly",
    categories: ["All", "AIML", "CS"],
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    icon: Code,
    name: "CodeGenius",
    tagline: "Generate code snippets",
    categories: ["All", "CS", "AIML"],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    icon: Presentation,
    name: "SlideCreator Pro",
    tagline: "Create presentations instantly",
    categories: ["All", "AIML", "ECE", "Mechanical", "Civil", "CS"],
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: 4,
    icon: FileText,
    name: "EssayHelper AI",
    tagline: "Write better essays faster",
    categories: ["All", "AIML", "CS"],
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: 5,
    icon: Cpu,
    name: "CircuitSim AI",
    tagline: "Design & simulate circuits",
    categories: ["All", "ECE"],
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: 6,
    icon: Calculator,
    name: "MathSolver Plus",
    tagline: "Solve complex equations",
    categories: ["All", "AIML", "ECE", "Mechanical", "Civil", "CS"],
    gradient: "from-pink-500 to-rose-500"
  },
  {
    id: 7,
    icon: Wrench,
    name: "CAD Assistant",
    tagline: "AI-powered 3D modeling",
    categories: ["All", "Mechanical", "Civil"],
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    id: 8,
    icon: Construction,
    name: "StructureAnalyzer",
    tagline: "Analyze structural designs",
    categories: ["All", "Civil"],
    gradient: "from-teal-500 to-green-500"
  },
  {
    id: 9,
    icon: Brain,
    name: "ML ModelBuilder",
    tagline: "Build ML models visually",
    categories: ["All", "AIML", "CS"],
    gradient: "from-violet-500 to-purple-500"
  }
];

const categories: Category[] = ["All", "AIML", "ECE", "Mechanical", "Civil", "CS"];

export function AIToolsSection() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredTools = selectedCategory === "All" 
    ? aiTools 
    : aiTools.filter(tool => tool.categories.includes(selectedCategory));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll to start when category changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [selectedCategory]);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-gradient-primary mb-4">
            AI Tools for Smarter Study
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover AI tools tailored for your field.
          </p>
        </div>

        {/* Category Filters */}
        <div
          className={`flex flex-wrap justify-center gap-3 mb-8 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Scrollable Carousel */}
        <div
          ref={scrollContainerRef}
          className={`overflow-x-auto pb-4 transition-all duration-700 delay-200 scrollbar-thin ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex gap-6 min-w-max px-4">
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              
              return (
                <div
                  key={tool.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 w-80 flex-shrink-0 card-hover transition-all duration-500"
                >
                  {/* Icon with gradient background */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <h3 className="mb-2 text-gray-900 dark:text-white">
                      {tool.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {tool.tagline}
                    </p>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Try Now
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll Hint */}
        {filteredTools.length > 3 && (
          <div className="text-center mt-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              ← Scroll to explore more tools →
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
