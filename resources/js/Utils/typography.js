/**
 * Typography Utility Constants for SMAN 1 Baleendah Website
 * 
 * This file contains standardized typography classes to ensure consistent
 * text sizing, spacing, and hierarchy across all pages.
 * 
 * Usage: Import and use these constants instead of hardcoding classes
 * Example: import { TYPOGRAPHY } from '@/Utils/typography';
 *          <h1 className={TYPOGRAPHY.pageTitle}>Page Title</h1>
 */

export const TYPOGRAPHY = {
  // Page Titles (H1) - Main page headings
  pageTitle: "text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-4",
  
  // Section Headings (H2) - Major section titles
  sectionHeading: "text-2xl sm:text-3xl font-bold text-gray-800 mb-2",
  
  // Subsection Headings (H3) - Subsection titles
  subsectionHeading: "text-xl sm:text-2xl font-semibold text-gray-800 mb-3",
  
  // Card Titles - Titles within cards and components
  cardTitle: "text-lg sm:text-xl font-semibold text-primary mb-2",
  
  // Body Text - Main content paragraphs
  bodyText: "text-sm sm:text-base leading-relaxed text-gray-700 mb-4",
  
  // Secondary Text - Supporting information, metadata
  secondaryText: "text-sm leading-relaxed text-gray-600 mb-2",
  
  // Small Text - Labels, captions, fine print
  smallText: "text-sm font-medium text-gray-500",
  
  // Navigation Text - For navbar and menu items
  navText: "text-sm font-medium text-gray-700 hover:text-primary",
  
  // Button Text - For button labels
  buttonText: "text-sm font-medium",
  
  // Form Labels - For form field labels
  formLabel: "text-sm font-medium text-gray-700 mb-2",
  
  // Footer Text - For footer content
  footerText: "text-sm sm:text-base leading-relaxed text-gray-600",
  
  // Footer Heading - For footer section headings
  footerHeading: "text-lg sm:text-xl font-semibold text-gray-800 mb-4",
  
  // Hero Text - For large hero section text
  heroTitle: "text-4xl sm:text-5xl md:text-6xl font-bold text-white",
  heroSubtitle: "text-3xl sm:text-3xl md:text-5xl font-bold text-white"
};

/**
 * Responsive Breakpoints Reference
 * 
 * Mobile: Default (no prefix) - up to 640px
 * Small: sm: - 640px and up
 * Medium: md: - 768px and up  
 * Large: lg: - 1024px and up
 */

/**
 * Typography Hierarchy Guide
 * 
 * 1. Page Title (H1): 30px → 36px → 48px
 * 2. Section Heading (H2): 24px → 30px
 * 3. Subsection Heading (H3): 20px → 24px
 * 4. Card Title: 18px → 20px
 * 5. Body Text: 14px → 16px
 * 6. Secondary Text: 14px
 * 7. Small Text: 12px
 */

/**
 * Color Usage Guide
 * 
 * - text-primary: For page titles, card titles, emphasis
 * - text-gray-800: For section headings, important text
 * - text-gray-700: For body text, main content
 * - text-gray-600: For secondary text, metadata
 * - text-gray-500: For small text, labels
 * - text-white: For text on dark backgrounds
 */

/**
 * Spacing Guidelines
 * 
 * - mb-4: Standard spacing for body text paragraphs
 * - mb-2: Tight spacing for headings
 * - mb-3: Medium spacing for subsections
 * - leading-relaxed: Standard line height (1.625) for readability
 */