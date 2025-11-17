import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Testimonial } from '../../types/collegePortal';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

/**
 * Testimonial card component for displaying college reviews
 */
export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Quote Icon */}
        <Quote className="w-8 h-8 text-blue-500/20 mb-3" />

        {/* Rating Stars */}
        <div className="flex items-center space-x-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          "{testimonial.content}"
        </p>

        {/* Author Info */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">
            {testimonial.name}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {testimonial.role}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {testimonial.institution}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
