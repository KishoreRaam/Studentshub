import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { FAQ_ITEMS } from '../../types/collegePortal';

/**
 * FAQ Accordion component for College Portal page
 */
export function FAQAccordion() {
  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Find answers to common questions about our institutional email services
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-2">
        {FAQ_ITEMS.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-6"
          >
            <AccordionTrigger className="text-left hover:no-underline py-4">
              <span className="font-semibold text-gray-900 dark:text-white pr-4">
                {faq.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4 leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
