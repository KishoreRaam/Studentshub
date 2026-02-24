import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail, CheckCircle } from 'lucide-react';
import { functions } from '../lib/appwrite';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      // Execute generic newsletter subscription endpoint
      // Ensure 'subscribeNewsletter' is the actual ID of your Appwrite function
      await functions.createExecution('subscribeNewsletter', JSON.stringify({ email }));

      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 5000);
    } catch (error) {
      console.error('Newsletter subscription failed', error);
      alert('Failed to subscribe. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-green-500 dark:from-blue-700 dark:to-green-600 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <div className="flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 mr-3" />
            <h3 className="text-3xl md:text-4xl">Stay Updated</h3>
          </div>

          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get notified about new student benefits, exclusive offers, and important updates
            directly to your inbox.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your student email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/90 backdrop-blur-sm border-0 text-gray-900 placeholder-gray-500"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center space-x-3 bg-white/20 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto"
            >
              <CheckCircle className="w-6 h-6 text-green-300" />
              <span className="text-lg">Thanks for subscribing!</span>
            </motion.div>
          )}

          <p className="text-sm text-blue-200 mt-4">
            No spam, unsubscribe at any time. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}