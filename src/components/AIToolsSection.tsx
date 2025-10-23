import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Sparkles, Star } from 'lucide-react';
import { parseAIToolsCSV } from '@/utils/csvParser';
import type { AITool } from '@/types/ai-tools';

export function AIToolsSection() {
  const [tools, setTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTools = async () => {
      try {
        setLoading(true);
        const loadedTools = await parseAIToolsCSV('/assets/ai-tools-complete.csv');
        // Get top 5 most popular tools
        const popularTools = loadedTools
          .filter(tool => tool.isPopular)
          .slice(0, 5);
        setTools(popularTools);
      } catch (err) {
        console.error('Failed to load AI tools preview:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse text-gray-400 dark:text-gray-600">
              Loading AI Tools...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (tools.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            variant="secondary"
            className="mb-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-800 dark:text-purple-200 border-0"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Tools
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Top AI Tools for Students
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover powerful AI tools to boost your productivity, enhance learning,
            and accelerate your academic success.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  {/* Top badges and pricing */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {tool.isPopular && (
                        <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Popular</span>
                        </div>
                      )}
                      {tool.isNew && !tool.isPopular && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>

                    {/* Pricing badge - matching benefits value style */}
                    <span className="text-green-600 font-semibold text-sm">
                      {tool.pricing}
                    </span>
                  </div>

                  {/* Logo */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                      {tool.logo}
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-xl text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {tool.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Learn more link - matching benefits style */}
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                    <span className="text-sm mr-2">Learn more</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Discover More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/tools">
            <button className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden bg-gradient-to-r from-blue-600 to-green-500 rounded-xl text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
              <span className="relative z-10 flex items-center space-x-2">
                <span className="font-medium">Discover More AI Tools</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
