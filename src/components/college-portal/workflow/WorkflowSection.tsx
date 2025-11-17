import { motion } from "motion/react";
import { Search, FileCheck, Cloud, Rocket } from "lucide-react";
import { WorkflowCard } from "./WorkflowCard";
import { TimelineBar } from "./TimelineBar";
import { SuccessMetrics } from "./SuccessMetrics";
import { Button } from "../../ui/button";

export function WorkflowSection() {
  const steps = [
    {
      step: 1,
      title: "Initial Consultation",
      description:
        "We understand your institution's unique needs, student count, and technical requirements",
      details: [
        "Free 30-minute consultation call",
        "Requirement gathering questionnaire",
        "Technical infrastructure assessment",
        "Custom solution proposal",
      ],
      deliverable: "Detailed Proposal & Timeline",
      badge: "Free Consultation",
      icon: Search,
      timeline: "Day 1",
      color: "blue",
    },
    {
      step: 2,
      title: "Documentation & Setup",
      description:
        "We handle all paperwork and verification with ERNET India for your .edu.in domain",
      details: [
        "Domain registration with ERNET",
        "AICTE/UGC verification documents",
        "SSL certificate setup",
        "Security compliance check",
      ],
      deliverable: "Domain Registered & Verified",
      badge: "Secure & Verified",
      icon: FileCheck,
      timeline: "Day 2-5",
      color: "purple",
    },
    {
      step: 3,
      title: "System Configuration",
      description:
        "Professional email setup with Google Workspace or Microsoft 365, tailored to your needs",
      details: [
        "Google Workspace / Microsoft 365 setup",
        "Admin dashboard configuration",
        "Bulk user account creation",
        "Mobile device management (MDM)",
        "Anti-spam & security policies",
      ],
      deliverable: "Email System Live & Configured",
      badge: "Enterprise Grade",
      icon: Cloud,
      timeline: "Day 6-10",
      color: "green",
    },
    {
      step: 4,
      title: "Training & Launch",
      description:
        "Comprehensive training for admins and students, plus ongoing support to ensure smooth adoption",
      details: [
        "Admin training session (2 hours)",
        "Student onboarding guide & video tutorials",
        "Email distribution ceremony (optional)",
        "24/7 support for first month",
        "Troubleshooting & FAQ documentation",
      ],
      deliverable: "Students Using Institutional Emails",
      badge: "24/7 Support",
      icon: Rocket,
      timeline: "Day 11-14",
      color: "orange",
    },
  ];

  return (
    <section className="relative py-20 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="workflow-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#workflow-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-indigo-600 dark:text-indigo-400 uppercase tracking-wide text-sm font-semibold mb-3">
            How It Works
          </p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Journey to Digital Transformation
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            From registration to go-live in just 14 days. We handle the complexity, you focus
            on education.
          </p>
        </motion.div>

        {/* Workflow Steps */}
        <div className="relative mb-16">
          {/* Connecting Path - Desktop Only */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 pointer-events-none">
            <svg className="w-full h-full" style={{ marginTop: "-2px" }}>
              <motion.path
                d="M 140 0 L 520 0 M 660 0 L 1040 0 M 1180 0 L 1560 0"
                stroke="url(#gradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="10 5"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="33%" stopColor="#8B5CF6" />
                  <stop offset="66%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mt-8">
            {steps.map((step, index) => (
              <WorkflowCard key={index} {...step} delay={index * 0.2} />
            ))}
          </div>
        </div>

        {/* Timeline Bar */}
        <TimelineBar />

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto text-lg">
            Join 125+ institutions that have already transformed their digital identity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold shadow-lg"
              onClick={() => {
                document.getElementById("registration-form")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Start Your Free Consultation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 font-semibold"
            >
              Download Process Guide (PDF)
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Success Metrics */}
      <div className="mt-20">
        <SuccessMetrics />
      </div>
    </section>
  );
}
