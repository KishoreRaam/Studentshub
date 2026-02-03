import { BookOpen, FileText, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

type Resource = {
  provider: string;
  title: string;
  category: string;
  description: string;
  discountOfferINR: string;
  validity: string;
  verificationMethod: string;
  claimLink: string;
  badge?: string;
};

type DisplayResource = {
  id: number;
  icon: typeof BookOpen;
  name: string;
  description: string;
  category: string;
  claimLink?: string;
};

// Fallback data in case CSV fails to load
const fallbackResources: DisplayResource[] = [
  {
    id: 1,
    icon: BookOpen,
    name: "Complete Python Guide",
    description: "From basics to advanced concepts with real-world projects",
    category: "Programming"
  },
  {
    id: 2,
    icon: FileText,
    name: "Engineering Mathematics",
    description: "Comprehensive notes and solved problem sets",
    category: "Mathematics"
  },
  {
    id: 3,
    icon: GraduationCap,
    name: "Research Paper Templates",
    description: "IEEE & APA formatted templates for academic writing",
    category: "Academic"
  },
  {
    id: 4,
    icon: BookOpen,
    name: "Web Development Kit",
    description: "HTML, CSS, JavaScript essentials and frameworks guide",
    category: "Programming"
  },
  {
    id: 5,
    icon: FileText,
    name: "Data Structures eBook",
    description: "Visual explanations with code examples in C++ and Java",
    category: "Computer Science"
  },
  {
    id: 6,
    icon: GraduationCap,
    name: "Interview Prep Guide",
    description: "Technical questions, HR tips, and company insights",
    category: "Career"
  }
];

// Helper function to get icon based on category
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, typeof BookOpen> = {
    'Development': BookOpen,
    'Design': FileText,
    'Business': GraduationCap,
    'AI & ML': BookOpen,
    'Cloud': FileText,
    'Productivity': GraduationCap,
    'Data Science': BookOpen,
    'Marketing': FileText
  };
  return iconMap[category] || BookOpen;
};

export function FreeResourcesSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [resources, setResources] = useState<DisplayResource[]>(fallbackResources);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load top free courses from CSV
  useEffect(() => {
    const loadTopCourses = async () => {
      try {
        const response = await fetch('/assets/student_courses_resources.csv');
        const csvText = await response.text();

        Papa.parse<Resource>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Filter for 100% free courses and take top 6
            const freeCourses = results.data
              .filter(resource =>
                resource.discountOfferINR?.includes('100% Free') ||
                resource.discountOfferINR?.includes('Free')
              )
              .slice(0, 6)
              .map((resource, index) => ({
                id: index + 1,
                icon: getCategoryIcon(resource.category),
                name: resource.title || resource.provider,
                description: resource.description,
                category: resource.category,
                claimLink: resource.claimLink
              }));

            if (freeCourses.length > 0) {
              setResources(freeCourses);
            }
            setLoading(false);
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
            setResources(fallbackResources);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Failed to load CSV:', error);
        setResources(fallbackResources);
        setLoading(false);
      }
    };

    loadTopCourses();
  }, []);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate cards one by one
            resources.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
              }, index * 100);
            });
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
  }, [loading, resources]);

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-gradient-primary mb-4">
            Free Student Resources
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Access guides, eBooks, and learning materials free with your student email.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            const isVisible = visibleCards.includes(index);

            return (
              <div
                key={resource.id}
                className={`bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 card-hover transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className="mb-2 text-gray-900 dark:text-white">
                    {resource.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {resource.description}
                  </p>
                </div>

                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm">
                    {resource.category}
                  </span>
                  {resource.claimLink ? (
                    <a
                      href={resource.claimLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="ghost"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        Get Access
                      </Button>
                    </a>
                  ) : (
                    <Button
                      variant="ghost"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => navigate('/resources')}
                    >
                      Get Access
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore More Button */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/courses')}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold hover:scale-105"
          >
            Explore More Resources
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
