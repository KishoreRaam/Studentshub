import { useMemo, useState } from "react";
import { toast } from "sonner";

import { CourseCard, type Course } from "@/components/courses/CourseCard";
import { CourseDetailModal } from "@/components/courses/CourseDetailModal";
import { HeroSection } from "@/components/courses/HeroSection";
import { SearchAndFilter } from "@/components/courses/SearchAndFilter";
import { Toaster } from "@/components/ui/sonner";

const coursesData: Course[] = [
  {
    id: "1",
    provider: "Coursera",
    logo: "🎓",
    category: "Development",
    description:
      "Access 4,000+ courses from top universities including machine learning, web development, and data science.",
    validity: "Valid until June 30, 2026",
    verificationMethod: "Verify with Student Email",
    courses: [
      "Machine Learning by Stanford University",
      "Full-Stack Web Development with React",
      "Python for Everybody Specialization",
      "Google IT Support Professional Certificate",
      "Data Structures and Algorithms",
    ],
    verificationSteps: [
      "Sign up with your .edu email address",
      "Apply for Coursera for Campus program",
      "Get verified within 24-48 hours",
      "Start accessing free courses and certificates",
    ],
  },
  {
    id: "2",
    provider: "AWS Educate",
    logo: "☁️",
    category: "Cloud",
    description:
      "Learn cloud computing with AWS's free educational program featuring hands-on labs and career pathways.",
    validity: "Lifetime Access",
    verificationMethod: "Verify with Student Email",
    courses: [
      "AWS Cloud Foundations",
      "Machine Learning Foundations",
      "Cloud Computing 101",
      "Introduction to Cloud Security",
      "Getting Started with Storage",
    ],
    verificationSteps: [
      "Create an AWS Educate account",
      "Verify your student status with your institution email",
      "Receive $100 in AWS credits",
      "Access learning pathways and labs",
    ],
  },
  {
    id: "3",
    provider: "GitHub Education",
    logo: "💻",
    category: "Development",
    description:
      "Get free access to GitHub Pro, developer tools, and training resources through the Student Developer Pack.",
    validity: "Valid until graduation",
    verificationMethod: "Verify with Student ID",
    courses: [
      "GitHub Learning Lab Courses",
      "Free access to 50+ developer tools",
      "GitHub Copilot for Students",
      "Azure Credits ($100/year)",
      "Domain name & hosting credits",
    ],
    verificationSteps: [
      "Visit education.github.com/pack",
      "Sign in with your GitHub account",
      "Verify student status with ID or school email",
      "Get instant access to the Developer Pack",
    ],
  },
  {
    id: "4",
    provider: "LinkedIn Learning",
    logo: "💼",
    category: "Business",
    description:
      "Unlimited access to 16,000+ expert-led courses in business, technology, and creative skills.",
    validity: "Valid until December 31, 2025",
    verificationMethod: "Verify through University Portal",
    courses: [
      "Business Strategy Fundamentals",
      "Excel Essential Training",
      "Project Management Foundations",
      "Digital Marketing Strategies",
      "Leadership and Management",
    ],
    verificationSteps: [
      "Check if your university has LinkedIn Learning",
      "Access through your university's library portal",
      "Sign in with your university credentials",
      "Start learning with unlimited access",
    ],
  },
  {
    id: "5",
    provider: "IBM SkillsBuild",
    logo: "🔷",
    category: "AI & ML",
    description:
      "Free courses on AI, cloud computing, cybersecurity, and data science with IBM digital badges.",
    validity: "Lifetime Access",
    verificationMethod: "Verify with Student Email",
    courses: [
      "Artificial Intelligence Fundamentals",
      "Data Science Methodology",
      "Cybersecurity Fundamentals",
      "Cloud Computing Basics",
      "Design Thinking Practitioner",
    ],
    verificationSteps: [
      "Register at skillsbuild.org",
      "Select 'Student' as your role",
      "Verify with your student email",
      "Access courses and earn digital badges",
    ],
  },
  {
    id: "6",
    provider: "Udemy for Students",
    logo: "📚",
    category: "Design",
    description:
      "Discounted access to 150,000+ courses in design, development, marketing, and personal development.",
    validity: "Valid until August 31, 2026",
    verificationMethod: "Verify with Student Email",
    courses: [
      "Complete Web & Mobile Designer",
      "User Experience Design Fundamentals",
      "Graphic Design Masterclass",
      "Figma UI/UX Design Essentials",
      "Adobe Creative Cloud Complete Course",
    ],
    verificationSteps: [
      "Sign up for Udemy with student email",
      "Verify through Student Beans or UNiDAYS",
      "Get up to 50% discount on courses",
      "Access courses on any device",
    ],
  },
  {
    id: "7",
    provider: "Google Cloud Skills Boost",
    logo: "🌐",
    category: "Cloud",
    description:
      "Hands-on labs and courses to learn Google Cloud Platform with free credits for students.",
    validity: "Valid until December 31, 2025",
    verificationMethod: "Verify with Student Email",
    courses: [
      "Google Cloud Fundamentals",
      "Kubernetes in Google Cloud",
      "Data Engineering on Google Cloud",
      "Machine Learning with TensorFlow",
      "Cloud Architecture Design",
    ],
    verificationSteps: [
      "Sign up at cloudskillsboost.google",
      "Apply for student credits",
      "Verify your student status",
      "Receive $300 in free credits",
    ],
  },
  {
    id: "8",
    provider: "Microsoft Learn",
    logo: "🪟",
    category: "Productivity",
    description:
      "Free training modules for Microsoft products, Azure cloud, and software development certifications.",
    validity: "Lifetime Access",
    verificationMethod: "Verify with Student Email",
    courses: [
      "Azure Fundamentals (AZ-900)",
      "Microsoft 365 Fundamentals",
      "Power Platform Fundamentals",
      "Introduction to Python",
      "Build AI solutions with Azure",
    ],
    verificationSteps: [
      "Create a Microsoft Learn account",
      "Access free learning paths",
      "Apply for Azure for Students ($100 credit)",
      "Earn certifications at discounted rates",
    ],
  },
];

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [savedCourses, setSavedCourses] = useState<string[]>([]);

  const filteredCourses = useMemo(() => {
    return coursesData
      .filter((course) => {
        const matchesSearch =
          course.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
        const matchesSavedView = !showSaved || savedCourses.includes(course.id);
        return matchesSearch && matchesCategory && matchesSavedView;
      })
      .sort((a, b) => {
        if (sortBy === "category") {
          return a.category.localeCompare(b.category);
        }
        // Default: popularity or recent (mock sorting)
        return 0;
      });
  }, [savedCourses, searchTerm, selectedCategory, showSaved, sortBy]);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleClaimCourse = () => {
    if (!selectedCourse) {
      return;
    }
    toast.success(`Successfully claimed ${selectedCourse.provider}!`, {
      description: "Check your email for verification instructions.",
    });
    setIsModalOpen(false);
  };

  const handleSaveCourse = () => {
    if (!selectedCourse) {
      return;
    }

    setSavedCourses((prev) => {
      if (prev.includes(selectedCourse.id)) {
        return prev;
      }
      toast.success(`Saved ${selectedCourse.provider} for later!`);
      return [...prev, selectedCourse.id];
    });
    setIsModalOpen(false);
  };

  const handleBrowseClick = () => {
    setShowSaved(false);
    const coursesSection = document.getElementById("courses-section");
    coursesSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSavedClick = () => {
    setShowSaved(true);
    const coursesSection = document.getElementById("courses-section");
    coursesSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-white to-[#f0f9ff] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Toaster />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-12">
          <HeroSection onBrowseClick={handleBrowseClick} onSavedClick={handleSavedClick} />
        </div>

        <div className="mb-8" id="courses-section">
          <SearchAndFilter
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSortBy}
            selectedCategory={selectedCategory}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-[#1e293b] dark:text-slate-100">
            {showSaved ? "Saved Courses" : "Available Courses"}
          </h2>
          <p className="text-[#475569] dark:text-slate-300 mt-2">
            {showSaved
              ? `${filteredCourses.length} saved course${filteredCourses.length !== 1 ? "s" : ""}`
              : `${filteredCourses.length} course provider${filteredCourses.length !== 1 ? "s" : ""} available`}
          </p>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onClick={() => handleCourseClick(course)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-[#1e293b] dark:text-slate-100 mb-2">
              {showSaved ? "No saved courses yet" : "No courses found"}
            </h3>
            <p className="text-[#475569] dark:text-slate-300">
              {showSaved
                ? "Start exploring and save courses for later!"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        )}
      </div>

      <CourseDetailModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClaim={handleClaimCourse}
        onSave={handleSaveCourse}
      />
    </div>
  );
}
