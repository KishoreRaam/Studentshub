import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { TestimonialsColumn } from "./ui/testimonials-columns-1";
import type { Testimonial } from "./ui/testimonials-columns-1";

const testimonials: Testimonial[] = [
  {
    text: "StudentsHub saved me over ₹40,000 this year! The GitHub Student Pack alone gave me access to tools I couldn't afford as a CS student.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah Chen",
    role: "CS · Stanford University",
    rating: 5,
  },
  {
    text: "The Adobe Creative Cloud discount made my design projects possible. Without StudentsHub, I wouldn't have access to professional tools.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Marcus Johnson",
    role: "Design · MIT",
    rating: 5,
  },
  {
    text: "Amazing platform! The dashboard helps me track all my benefits and renewal dates. I never miss out on savings anymore.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Emma Rodriguez",
    role: "Business · Harvard University",
    rating: 5,
  },
  {
    text: "The verification process was super quick — I got Spotify Premium and Office 365 access within minutes. Highly recommend!",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Alex Kim",
    role: "Data Science · UC Berkeley",
    rating: 5,
  },
  {
    text: "JetBrains IDEs for free changed my entire workflow. My code quality improved drastically thanks to tools I couldn't afford otherwise.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Priya Sharma",
    role: "Engineering · IIT Delhi",
    rating: 5,
  },
  {
    text: "Found AI tools here that I had no idea were free for students. My productivity for assignments doubled in the first week.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Rahul Verma",
    role: "CS · BITS Pilani",
    rating: 5,
  },
  {
    text: "Figma Education plan is a game changer. I now design professional UIs for my projects without paying a single rupee.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    name: "Ananya Gupta",
    role: "Design · NIT Trichy",
    rating: 5,
  },
  {
    text: "Cloud credits from AWS and Azure let me run my ML models without worrying about compute costs. Absolutely invaluable for research.",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Dev Patel",
    role: "Machine Learning · IIT Bombay",
    rating: 5,
  },
  {
    text: "I discovered over 20 free resources I didn't know existed. The saved items dashboard keeps everything organised in one place.",
    image: "https://randomuser.me/api/portraits/women/90.jpg",
    name: "Zara Ahmed",
    role: "CS · VIT Vellore",
    rating: 5,
  },
];

const firstColumn  = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn  = testimonials.slice(6, 9);

export function StudentTestimonials() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center max-w-xl mx-auto mb-14"
        >
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900">
            Testimonials
          </Badge>
          <h2 className="text-4xl md:text-5xl text-gray-900 dark:text-white mb-5">
            What Students Say
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            Join thousands of students who've unlocked premium tools, discounts,
            and resources — all with a single student email.
          </p>
        </motion.div>

        {/* Scrolling columns — mask fades top & bottom edges */}
        <div
          className="flex justify-center gap-6
                     [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]
                     max-h-[720px] overflow-hidden"
        >
          <TestimonialsColumn
            testimonials={firstColumn}
            duration={22}
          />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={28}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={25}
          />
        </div>
      </div>
    </section>
  );
}
