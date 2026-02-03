import React, { useState } from 'react';
import { BookOpen, Shield, FileText, GraduationCap, Code, Search, CheckCircle, AlertCircle, Mail, MessageCircle, Lock, Database, Eye, UserCheck, Globe, ChevronDown, ChevronUp } from 'lucide-react';

type TabType = 'help-center' | 'privacy-policy' | 'terms-of-service' | 'student-guide' | 'api-documentation';

const ResourcesPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('help-center');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const tabs = [
    { id: 'help-center' as TabType, label: 'Help Center', icon: BookOpen },
    { id: 'privacy-policy' as TabType, label: 'Privacy Policy', icon: Shield },
    { id: 'terms-of-service' as TabType, label: 'Terms of Service', icon: FileText },
    { id: 'student-guide' as TabType, label: 'Student Guide', icon: GraduationCap },
    { id: 'api-documentation' as TabType, label: 'API Documentation', icon: Code },
  ];

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I verify my student status?',
          a: 'You can verify your student status by signing up with your university email address (.edu domain) or by uploading a photo of your valid student ID. Verification typically takes 1-2 business days.'
        },
        {
          q: 'What perks are available?',
          a: 'We offer thousands of exclusive student discounts across categories including Tech, Learning, Lifestyle, Entertainment, and more. Browse our perks section to see all available offers.'
        },
        {
          q: 'How do I claim a perk?',
          a: 'Click on any perk to see full details, then click "Claim Perk" to get your unique discount code. Use this code on the partner\'s website to redeem your discount.'
        }
      ]
    },
    {
      category: 'Account & Profile',
      questions: [
        {
          q: 'Can I save perks for later?',
          a: 'Yes! Click the bookmark icon on any perk, course, or tool to save it. Access your saved items from the "Saved" page in your dashboard.'
        },
        {
          q: 'How do I update my profile?',
          a: 'Go to your dashboard and click on your profile section. You can update your name, department, interests, and profile picture anytime.'
        }
      ]
    },
    {
      category: 'Troubleshooting',
      questions: [
        {
          q: 'A discount code isn\'t working',
          a: 'First, check that the code hasn\'t expired and that you meet all requirements. If the issue persists, contact us at studentperkss@gmail.com with the perk name and error details.'
        },
        {
          q: 'I didn\'t receive verification email',
          a: 'Check your spam folder. If you still don\'t see it, go to your profile settings and click "Resend Verification Email".'
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-10 h-10 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Resources
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                All important information, documentation, and support materials in one place.
              </p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
              Start Onboarding
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'help-center' && (
          <div className="space-y-8">
            {/* Help Center Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Help Center</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Find answers to common questions and get support.
              </p>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Popular Questions */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Popular Questions</h3>
              <div className="space-y-6">
                {filteredFaqs.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{category.category}</h4>
                    <div className="space-y-3">
                      {category.questions.map((faq, faqIndex) => {
                        const globalIndex = categoryIndex * 100 + faqIndex;
                        return (
                          <div key={faqIndex} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                            <button
                              onClick={() => setExpandedFaq(expandedFaq === globalIndex ? null : globalIndex)}
                              className="w-full flex items-center justify-between text-left py-2 hover:text-blue-600 transition-colors"
                            >
                              <span className="font-medium text-gray-900 dark:text-white">{faq.q}</span>
                              {expandedFaq === globalIndex ? (
                                <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              )}
                            </button>
                            {expandedFaq === globalIndex && (
                              <p className="mt-2 text-gray-600 dark:text-gray-300 pl-4">{faq.a}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                <Mail className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email Support</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Get help via email within 24 hours</p>
                <a href="mailto:studentperkss@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium">
                  studentperkss@gmail.com
                </a>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
                <MessageCircle className="w-8 h-8 text-purple-600 mb-3" />
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Live Chat</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Chat with our support team</p>
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  Start Chat →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy-policy' && (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-6 sticky top-28">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contents</h3>
                <ul className="space-y-2">
                  {['Overview', 'Data Collection', 'Data Usage', 'Data Sharing', 'Your Rights', 'Security', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: December 11, 2025</p>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Your Privacy Matters</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        We are committed to protecting your personal information and being transparent about our data practices.
                      </p>
                    </div>
                  </div>
                </div>

                <section id="overview" className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Overview</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    EduBuzz ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    By accessing or using EduBuzz, you agree to this Privacy Policy. If you do not agree, please discontinue use of our services.
                  </p>
                </section>

                <section id="data-collection" className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Information We Collect</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">We collect several types of information:</p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Account Information:</p>
                        <p className="text-gray-600 dark:text-gray-300">Name, email address, university affiliation, and student status verification.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Usage Data:</p>
                        <p className="text-gray-600 dark:text-gray-300">Pages visited, features used, perks accessed, and interaction patterns.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Device Information:</p>
                        <p className="text-gray-600 dark:text-gray-300">IP address, browser type, operating system, and device identifiers.</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="data-usage" className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. How We Use Your Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { icon: UserCheck, text: 'Verify student status' },
                      { icon: Globe, text: 'Provide personalized perks' },
                      { icon: MessageCircle, text: 'Send important updates' },
                      { icon: Lock, text: 'Improve platform security' },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Icon className="w-5 h-5 text-blue-600" />
                          <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section id="your-rights" className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Your Rights</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">You have the right to:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      'Access your data',
                      'Correct inaccuracies',
                      'Delete your account',
                      'Opt out of marketing',
                      'Export your data',
                      'Restrict processing',
                    ].map((right, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{right}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="security" className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Security</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
                  </p>
                </section>

                <section id="contact" className="bg-blue-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Contact Us</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">For privacy-related questions or requests, contact us at:</p>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p><strong>Email:</strong> privacy@edubuzz.com</p>
                    <p><strong>Address:</strong> 123 Education Street, Learning City, LC 12345</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'terms-of-service' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h2>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: December 11, 2025</p>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800 mb-8">
                <p className="text-gray-700 dark:text-gray-300">
                  Please read these Terms of Service carefully before using EduBuzz. By accessing or using our platform, you agree to be bound by these terms.
                </p>
              </div>

              <div className="space-y-8">
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Acceptance of Terms</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 ml-13">
                    By creating an account and using EduBuzz, you agree to comply with these Terms of Service and all applicable laws and regulations. If you do not agree, you may not use our services.
                  </p>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Eligibility</h3>
                  </div>
                  <div className="ml-13">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      EduBuzz is available exclusively to verified students. To use our platform, you must:
                    </p>
                    <ul className="space-y-2">
                      {[
                        'Be currently enrolled in an accredited educational institution',
                        'Provide accurate and truthful information during verification',
                        'Be at least 13 years of age (or age of digital consent in your country)',
                        'Maintain a valid student email address or provide proof of enrollment',
                      ].map((item, index) => (
                        <li key={index} className="flex gap-3">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Account Responsibilities</h3>
                  </div>
                  <div className="ml-13">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">You are responsible for:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-gray-700 dark:text-gray-300">✓ Maintain account security</p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-gray-700 dark:text-gray-300">✓ Keep information accurate</p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-gray-700 dark:text-gray-300">✓ Notify us of breaches</p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-gray-700 dark:text-gray-300">✓ Update expired information</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Perks and Benefits</h3>
                  </div>
                  <div className="ml-13">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      EduBuzz provides access to exclusive student perks from partner companies. Please note:
                    </p>
                    <ul className="space-y-2">
                      {[
                        'Perks are subject to availability and may change without notice',
                        'Partner companies set their own terms and conditions for perks',
                        'EduBuzz is not responsible for partner company products or services',
                        'You must comply with each partner\'s individual terms when redeeming perks',
                      ].map((item, index) => (
                        <li key={index} className="flex gap-3">
                          <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">5</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Prohibited Activities</h3>
                  </div>
                  <div className="ml-13">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      You agree not to engage in any of the following activities:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { text: 'Fraud or misrepresentation', icon: AlertCircle },
                        { text: 'Automated scraping or bots', icon: AlertCircle },
                        { text: 'Selling or transferring perks', icon: AlertCircle },
                        { text: 'Hacking or security breaches', icon: AlertCircle },
                        { text: 'Spam or harassment', icon: AlertCircle },
                        { text: 'Violating laws or regulations', icon: AlertCircle },
                      ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div key={index} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-center gap-2">
                              <Icon className="w-5 h-5 text-red-600" />
                              <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">6</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Termination</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 ml-13">
                    We reserve the right to suspend or terminate your account at any time for violations of these Terms, fraudulent activity, or if you no longer meet eligibility requirements.
                  </p>
                </section>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'student-guide' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm mb-8">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Student Guide</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Learn how to make the most of EduBuzz with our comprehensive guides and tutorials.
              </p>
            </div>

            {/* Guide Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Verify Student Status */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Verify Your Student Status</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Get verified to unlock exclusive perks and benefits.
                </p>
                <ol className="space-y-3">
                  {[
                    'Sign up with your university email address (.edu domain)',
                    'Alternatively, upload a photo of your student ID',
                    'Wait for verification (usually 1-2 business days)',
                    'Receive confirmation email and start exploring perks!',
                  ].map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* How Perks Work */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-8 border border-green-200 dark:border-green-800">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How Perks Work</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Access thousands of exclusive student discounts and offers.
                </p>
                <ol className="space-y-3">
                  {[
                    'Browse perks by category (Tech, Learning, Lifestyle, etc.)',
                    'Click on a perk to see full details and requirements',
                    'Click "Claim Perk" to get your unique discount code',
                    'Use the code on the partner\'s website to redeem',
                  ].map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Save Items for Later */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Save Items for Later</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Keep track of perks, courses, and tools you're interested in.
                </p>
                <ol className="space-y-3">
                  {[
                    'Click the bookmark icon on any perk, course, or tool',
                    'Access your saved items from the "Saved" page',
                    'Organize saved items by creating custom collections',
                    'Get notified when saved perks are about to expire',
                  ].map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Department-Based Matching */}
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-2xl p-8 border border-pink-200 dark:border-pink-800">
                <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Department-Based Matching</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Get personalized recommendations based on your field of study.
                </p>
                <ol className="space-y-3">
                  {[
                    'Complete your profile with your department/major',
                    'Receive AI-powered recommendations for relevant courses',
                    'Discover tools and resources specific to your field',
                    'Update your interests anytime to refine recommendations',
                  ].map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api-documentation' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-900 to-blue-900 dark:from-gray-800 dark:to-blue-800 rounded-2xl p-8 shadow-lg text-white">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-8 h-8 text-blue-400" />
                <h2 className="text-3xl font-bold">API Documentation</h2>
              </div>
              <p className="text-blue-200 mb-8">
                Developer resources for integrating with EduBuzz.
              </p>

              {/* Status Indicator */}
              <div className="bg-green-500/20 border border-green-500 rounded-xl p-4 flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-300 font-medium">All systems operational</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-lg text-white">
              <h3 className="text-2xl font-bold mb-6">Overview</h3>
              <p className="text-gray-300 mb-8">
                The EduBuzz API allows developers to access student perks, courses, AI tools, and user data programmatically. Our RESTful API uses JSON for requests and responses.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h4 className="text-sm text-gray-400 mb-2">Base URL</h4>
                  <code className="text-blue-400 text-sm">https://api.edubuzz.com/v1</code>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h4 className="text-sm text-gray-400 mb-2">Format</h4>
                  <code className="text-green-400 text-sm">JSON</code>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h4 className="text-sm text-gray-400 mb-2">Rate Limit</h4>
                  <code className="text-yellow-400 text-sm">1000 req/hour</code>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4">Authentication</h3>
              <p className="text-gray-300 mb-4">
                All API requests require authentication using an API key. Include your key in the request header:
              </p>
              <div className="bg-black/40 rounded-xl p-6 border border-gray-700 mb-8 relative">
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  <code>{`Authorization: Bearer YOUR_API_KEY_HERE
Content-Type: application/json`}</code>
                </pre>
              </div>

              <h3 className="text-2xl font-bold mb-4">Endpoints</h3>
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-mono">GET</span>
                    <code className="text-blue-400">/perks</code>
                  </div>
                  <p className="text-gray-400 text-sm">Get list of student perks and discounts.</p>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-mono">GET</span>
                    <code className="text-blue-400">/courses</code>
                  </div>
                  <p className="text-gray-400 text-sm">Filter by category, department, difficulty level.</p>
                  <div className="mt-4 text-sm">
                    <p className="text-gray-500 mb-2">Query Parameters:</p>
                    <ul className="space-y-1">
                      <li><code className="text-purple-400">category</code> <span className="text-gray-500">Filter by category</span></li>
                      <li><code className="text-purple-400">department</code> <span className="text-gray-500">Filter by department</span></li>
                      <li><code className="text-purple-400">level</code> <span className="text-gray-500">Filter by difficulty (beginner, intermediate, advanced)</span></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-mono">GET</span>
                    <code className="text-blue-400">/tools</code>
                  </div>
                  <p className="text-gray-400 text-sm">Get list of AI tools and resources.</p>
                  <div className="mt-4 text-sm">
                    <p className="text-gray-500 mb-2">Query Parameters:</p>
                    <ul className="space-y-1">
                      <li><code className="text-purple-400">category</code> <span className="text-gray-500">Filter by tool category</span></li>
                      <li><code className="text-purple-400">free</code> <span className="text-gray-500">Filter by free/paid (true/false)</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mt-8 mb-4">Error Codes</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { code: '400', desc: 'Bad Request - Invalid parameters' },
                  { code: '401', desc: 'Unauthorized - Invalid or missing API key' },
                  { code: '403', desc: 'Forbidden - Insufficient permissions' },
                  { code: '404', desc: 'Not Found - Resource does not exist' },
                  { code: '429', desc: 'Too Many Requests - Rate limit exceeded' },
                  { code: '500', desc: 'Server Error - Something went wrong' },
                ].map((error) => (
                  <div key={error.code} className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                    <code className="text-red-400 font-bold text-lg">{error.code}</code>
                    <p className="text-gray-300 text-sm mt-1">{error.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
