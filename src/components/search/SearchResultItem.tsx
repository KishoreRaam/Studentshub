import { ExternalLink, Gift, Wrench, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { SearchableItem } from '@/types/search';
import { formatCategoryForDisplay, truncateText } from '@/utils/searchUtils';

interface SearchResultItemProps {
  item: SearchableItem;
  onClick?: () => void;
}

export function SearchResultItem({ item, onClick }: SearchResultItemProps) {
  // Get icon based on type
  const getTypeIcon = () => {
    switch (item.type) {
      case 'perk':
        return <Gift className="w-4 h-4" />;
      case 'tool':
        return <Wrench className="w-4 h-4" />;
      case 'resource':
        return <BookOpen className="w-4 h-4" />;
    }
  };

  // Get type label
  const getTypeLabel = () => {
    switch (item.type) {
      case 'perk':
        return 'Perk';
      case 'tool':
        return 'AI Tool';
      case 'resource':
        return 'Resource';
    }
  };

  // Get type color for badge
  const getTypeBadgeClass = () => {
    switch (item.type) {
      case 'perk':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'tool':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'resource':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: open link
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  const category = formatCategoryForDisplay(item.category);
  const description = truncateText(item.description, 120);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
    >
      <Card
        className="cursor-pointer border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-md"
        onClick={handleClick}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            {/* Logo */}
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center text-xl sm:text-2xl overflow-hidden">
              {item.logo_url ? (
                <img
                  src={item.logo_url}
                  alt={`${item.title} logo`}
                  className="w-full h-full object-contain p-1.5"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const emojiSpan = parent.querySelector('.logo-emoji');
                      emojiSpan?.classList.remove('hidden');
                    }
                  }}
                />
              ) : null}
              <span className={`logo-emoji ${item.logo_url ? 'hidden' : ''}`}>
                {item.logo || getTypeIcon()}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title and badges */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-1">
                  {item.title}
                </h3>
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                {description}
              </p>

              {/* Meta information */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <Badge className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 flex-shrink-0 ${getTypeBadgeClass()}`}>
                  <span className="hidden sm:inline">{getTypeIcon()}</span>
                  <span className={`${item.pricing || item.discount || item.isPopular || item.isNew ? 'sm:ml-1' : ''}`}>{getTypeLabel()}</span>
                </Badge>

                <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 max-w-[120px] sm:max-w-[150px] truncate" title={category}>
                  {category}
                </Badge>

                {item.pricing && (
                  <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 flex-shrink-0">
                    {item.pricing}
                  </Badge>
                )}

                {item.discount && (
                  <Badge className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 max-w-[100px] sm:max-w-[120px] truncate" title={item.discount}>
                    {item.discount}
                  </Badge>
                )}

                {item.isPopular && (
                  <Badge className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 flex-shrink-0">
                    Popular
                  </Badge>
                )}

                {item.isNew && (
                  <Badge className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-blue-500 text-white flex-shrink-0">
                    New
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
