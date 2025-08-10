import jsPDF from 'jspdf';

// Enhanced Typography System
export const PDFTypography = {
  // Font sizes with proper hierarchy
  sizes: {
    title: 24,
    heading1: 20,
    heading2: 16,
    heading3: 14,
    body: 11,
    caption: 9,
    small: 8
  },
  
  // Line heights for better readability
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8
  },
  
  // Font weights
  weights: {
    normal: 'normal',
    bold: 'bold'
  }
};

// Professional Color Palettes
export const ColorPalettes = {
  corporate: {
    primary: { r: 31, g: 41, b: 55 },      // Dark blue-gray
    secondary: { r: 59, g: 130, b: 246 },   // Blue
    accent: { r: 16, g: 185, b: 129 },      // Green
    neutral: { r: 107, g: 114, b: 128 },    // Gray
    light: { r: 248, g: 250, b: 252 },     // Light gray
    success: { r: 34, g: 197, b: 94 },     // Success green
    warning: { r: 245, g: 158, b: 11 },    // Warning amber
    error: { r: 239, g: 68, b: 68 }        // Error red
  },
  
  creative: {
    primary: { r: 124, g: 58, b: 237 },    // Purple
    secondary: { r: 236, g: 72, b: 153 },   // Pink
    accent: { r: 59, g: 130, b: 246 },     // Blue
    neutral: { r: 75, g: 85, b: 99 },      // Dark gray
    light: { r: 250, g: 245, b: 255 },     // Light purple
    success: { r: 34, g: 197, b: 94 },
    warning: { r: 245, g: 158, b: 11 },
    error: { r: 239, g: 68, b: 68 }
  },
  
  modern: {
    primary: { r: 59, g: 130, b: 246 },    // Blue
    secondary: { r: 99, g: 102, b: 241 },   // Indigo
    accent: { r: 16, g: 185, b: 129 },     // Teal
    neutral: { r: 100, g: 116, b: 139 },   // Slate
    light: { r: 248, g: 250, b: 252 },     // Light blue-gray
    success: { r: 34, g: 197, b: 94 },
    warning: { r: 245, g: 158, b: 11 },
    error: { r: 239, g: 68, b: 68 }
  },
  
  minimal: {
    primary: { r: 0, g: 0, b: 0 },         // Black
    secondary: { r: 75, g: 85, b: 99 },     // Dark gray
    accent: { r: 156, g: 163, b: 175 },    // Light gray
    neutral: { r: 107, g: 114, b: 128 },   // Medium gray
    light: { r: 249, g: 250, b: 251 },     // Off-white
    success: { r: 34, g: 197, b: 94 },
    warning: { r: 245, g: 158, b: 11 },
    error: { r: 239, g: 68, b: 68 }
  }
};

// Advanced Design Elements
export class PDFDesigner {
  private doc: jsPDF;
  private palette: any;
  
  constructor(doc: jsPDF, template: string) {
    this.doc = doc;
    this.palette = ColorPalettes[template as keyof typeof ColorPalettes] || ColorPalettes.modern;
  }

  // Enhanced gradient backgrounds
  addGradientBackground(x: number, y: number, width: number, height: number, startColor: any, endColor: any): void {
    const steps = 20;
    const stepHeight = height / steps;
    
    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
      const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
      const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);
      
      this.doc.setFillColor(r, g, b);
      this.doc.rect(x, y + (i * stepHeight), width, stepHeight + 1, 'F');
    }
  }

  // Professional section headers with enhanced styling
  addSectionHeader(title: string, yPosition: number, margin: number, pageWidth: number, options: {
    style?: 'gradient' | 'solid' | 'minimal';
    icon?: string;
    subtitle?: string;
  } = {}): number {
    const { style = 'gradient', icon, subtitle } = options;
    const headerHeight = subtitle ? 20 : 15;
    
    if (style === 'gradient') {
      this.addGradientBackground(
        margin, yPosition, pageWidth - 2 * margin, headerHeight,
        this.palette.primary, this.palette.secondary
      );
    } else if (style === 'solid') {
      this.doc.setFillColor(this.palette.primary.r, this.palette.primary.g, this.palette.primary.b);
      this.doc.rect(margin, yPosition, pageWidth - 2 * margin, headerHeight, 'F');
    } else {
      // Minimal style - just underline
      this.doc.setDrawColor(this.palette.primary.r, this.palette.primary.g, this.palette.primary.b);
      this.doc.setLineWidth(2);
      this.doc.line(margin, yPosition + 12, pageWidth - margin, yPosition + 12);
    }

    // Header text
    this.doc.setTextColor(style === 'minimal' ? this.palette.primary.r : 255, 
                         style === 'minimal' ? this.palette.primary.g : 255, 
                         style === 'minimal' ? this.palette.primary.b : 255);
    this.doc.setFontSize(PDFTypography.sizes.heading2);
    this.doc.setFont('helvetica', 'bold');
    
    const headerText = icon ? `${icon} ${title}` : title;
    this.doc.text(headerText, margin + 10, yPosition + (style === 'minimal' ? 8 : 10));

    if (subtitle && style !== 'minimal') {
      this.doc.setFontSize(PDFTypography.sizes.caption);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(subtitle, margin + 10, yPosition + 16);
    }

    return yPosition + headerHeight + 5;
  }

  // Enhanced card layouts with shadows and borders
  addCard(x: number, y: number, width: number, height: number, options: {
    shadow?: boolean;
    border?: boolean;
    borderColor?: any;
    backgroundColor?: any;
    borderRadius?: number;
  } = {}): void {
    const { 
      shadow = true, 
      border = true, 
      borderColor = this.palette.neutral,
      backgroundColor = { r: 255, g: 255, b: 255 },
      borderRadius = 4
    } = options;

    // Shadow effect
    if (shadow) {
      this.doc.setFillColor(0, 0, 0, 0.1);
      this.doc.roundedRect(x + 2, y + 2, width, height, borderRadius, borderRadius, 'F');
    }

    // Card background
    this.doc.setFillColor(backgroundColor.r, backgroundColor.g, backgroundColor.b);
    this.doc.roundedRect(x, y, width, height, borderRadius, borderRadius, 'F');

    // Border
    if (border) {
      this.doc.setDrawColor(borderColor.r, borderColor.g, borderColor.b);
      this.doc.setLineWidth(0.5);
      this.doc.roundedRect(x, y, width, height, borderRadius, borderRadius, 'S');
    }
  }

  // Professional metric cards
  addMetricCard(x: number, y: number, width: number, height: number, metric: {
    icon: string;
    label: string;
    value: string;
    color?: any;
  }): void {
    const cardColor = metric.color || this.palette.light;
    
    this.addCard(x, y, width, height, {
      backgroundColor: cardColor,
      borderColor: this.palette.neutral
    });

    // Icon circle
    const iconSize = 8;
    this.doc.setFillColor(this.palette.primary.r, this.palette.primary.g, this.palette.primary.b);
    this.doc.ellipse(x + 12, y + 12, iconSize, iconSize, 'F');
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(PDFTypography.sizes.small);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(metric.icon, x + 12, y + 14, { align: 'center' });

    // Label
    this.doc.setTextColor(this.palette.neutral.r, this.palette.neutral.g, this.palette.neutral.b);
    this.doc.setFontSize(PDFTypography.sizes.caption);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(metric.label, x + 22, y + 10);

    // Value
    this.doc.setTextColor(this.palette.primary.r, this.palette.primary.g, this.palette.primary.b);
    this.doc.setFontSize(PDFTypography.sizes.heading3);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(metric.value, x + 22, y + 18);
  }

  // Enhanced table styling
  addStyledTable(data: any[][], x: number, y: number, columnWidths: number[], options: {
    headerStyle?: 'gradient' | 'solid' | 'minimal';
    alternatingRows?: boolean;
    borderStyle?: 'full' | 'horizontal' | 'none';
  } = {}): number {
    const { headerStyle = 'gradient', alternatingRows = true, borderStyle = 'horizontal' } = options;
    const rowHeight = 12;
    let currentY = y;

    // Header row
    if (data.length > 0) {
      if (headerStyle === 'gradient') {
        this.addGradientBackground(x, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight,
          this.palette.primary, this.palette.secondary);
      } else if (headerStyle === 'solid') {
        this.doc.setFillColor(this.palette.primary.r, this.palette.primary.g, this.palette.primary.b);
        this.doc.rect(x, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
      }

      // Header text
      this.doc.setTextColor(headerStyle === 'minimal' ? this.palette.primary.r : 255,
                           headerStyle === 'minimal' ? this.palette.primary.g : 255,
                           headerStyle === 'minimal' ? this.palette.primary.b : 255);
      this.doc.setFontSize(PDFTypography.sizes.body);
      this.doc.setFont('helvetica', 'bold');

      let currentX = x;
      data[0].forEach((header, index) => {
        this.doc.text(header, currentX + 5, currentY + 8);
        currentX += columnWidths[index];
      });

      currentY += rowHeight;
    }

    // Data rows
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Alternating row backgrounds
      if (alternatingRows && i % 2 === 0) {
        this.doc.setFillColor(this.palette.light.r, this.palette.light.g, this.palette.light.b);
        this.doc.rect(x, currentY, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
      }

      // Row borders
      if (borderStyle === 'full' || borderStyle === 'horizontal') {
        this.doc.setDrawColor(this.palette.neutral.r, this.palette.neutral.g, this.palette.neutral.b);
        this.doc.setLineWidth(0.3);
        this.doc.line(x, currentY + rowHeight, x + columnWidths.reduce((a, b) => a + b, 0), currentY + rowHeight);
      }

      // Cell content
      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontSize(PDFTypography.sizes.body);
      this.doc.setFont('helvetica', 'normal');

      let currentX = x;
      row.forEach((cell, index) => {
        this.doc.text(cell.toString(), currentX + 5, currentY + 8);
        currentX += columnWidths[index];
      });

      currentY += rowHeight;
    }

    return currentY + 5;
  }

  // Professional quote/testimonial boxes
  addQuoteBox(text: string, author: string, x: number, y: number, width: number): number {
    const padding = 15;
    const quoteHeight = 50;
    
    // Quote background with subtle gradient
    this.addGradientBackground(x, y, width, quoteHeight, 
      { r: 255, g: 255, b: 255 }, this.palette.light);
    
    // Left border accent
    this.doc.setFillColor(this.palette.accent.r, this.palette.accent.g, this.palette.accent.b);
    this.doc.rect(x, y, 4, quoteHeight, 'F');

    // Quote mark
    this.doc.setTextColor(this.palette.accent.r, this.palette.accent.g, this.palette.accent.b);
    this.doc.setFontSize(32);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('"', x + 15, y + 20);

    // Quote text
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(PDFTypography.sizes.body);
    this.doc.setFont('helvetica', 'italic');
    const textLines = this.doc.splitTextToSize(text, width - 40);
    
    for (let i = 0; i < Math.min(textLines.length, 3); i++) {
      this.doc.text(textLines[i], x + 25, y + 15 + (i * 6));
    }

    // Author
    this.doc.setTextColor(this.palette.neutral.r, this.palette.neutral.g, this.palette.neutral.b);
    this.doc.setFontSize(PDFTypography.sizes.caption);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`— ${author}`, x + width - 15, y + quoteHeight - 8, { align: 'right' });

    return y + quoteHeight + 10;
  }

  // Enhanced progress bars
  addProgressBar(x: number, y: number, width: number, percentage: number, options: {
    height?: number;
    showPercentage?: boolean;
    color?: any;
    backgroundColor?: any;
  } = {}): void {
    const { 
      height = 6, 
      showPercentage = true, 
      color = this.palette.accent,
      backgroundColor = this.palette.light
    } = options;

    // Background
    this.doc.setFillColor(backgroundColor.r, backgroundColor.g, backgroundColor.b);
    this.doc.roundedRect(x, y, width, height, height/2, height/2, 'F');

    // Progress
    const progressWidth = (width * percentage) / 100;
    this.doc.setFillColor(color.r, color.g, color.b);
    this.doc.roundedRect(x, y, progressWidth, height, height/2, height/2, 'F');

    // Percentage text
    if (showPercentage) {
      this.doc.setTextColor(this.palette.neutral.r, this.palette.neutral.g, this.palette.neutral.b);
      this.doc.setFontSize(PDFTypography.sizes.caption);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${percentage}%`, x + width + 5, y + 4);
    }
  }

  // Professional icons with backgrounds
  addIconBadge(x: number, y: number, icon: string, options: {
    size?: number;
    backgroundColor?: any;
    textColor?: any;
    borderColor?: any;
  } = {}): void {
    const { 
      size = 12, 
      backgroundColor = this.palette.primary,
      textColor = { r: 255, g: 255, b: 255 },
      borderColor = this.palette.primary
    } = options;

    // Background circle
    this.doc.setFillColor(backgroundColor.r, backgroundColor.g, backgroundColor.b);
    this.doc.ellipse(x, y, size, size, 'F');

    // Border
    this.doc.setDrawColor(borderColor.r, borderColor.g, borderColor.b);
    this.doc.setLineWidth(1);
    this.doc.ellipse(x, y, size, size, 'S');

    // Icon
    this.doc.setTextColor(textColor.r, textColor.g, textColor.b);
    this.doc.setFontSize(PDFTypography.sizes.body);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(icon, x, y + 2, { align: 'center' });
  }

  // Enhanced dividers and separators
  addDivider(x: number, y: number, width: number, style: 'solid' | 'thick' | 'thin' | 'gradient' = 'solid'): void {
    if (style === 'gradient') {
      this.addGradientBackground(x, y, width, 2, this.palette.primary, this.palette.light);
    } else {
      this.doc.setDrawColor(this.palette.neutral.r, this.palette.neutral.g, this.palette.neutral.b);
      
      if (style === 'thick') {
        this.doc.setLineWidth(2);
      } else if (style === 'thin') {
        this.doc.setLineWidth(0.3);
      } else {
        this.doc.setLineWidth(1);
      }
      
      this.doc.line(x, y, x + width, y);
    }
  }

  // Professional callout boxes
  addCalloutBox(x: number, y: number, width: number, content: {
    title: string;
    text: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    icon?: string;
  }): number {
    const { title, text, type = 'info', icon } = content;
    const padding = 12;
    const titleHeight = 15;
    
    // Determine colors based on type
    let accentColor, backgroundColor;
    switch (type) {
      case 'success':
        accentColor = this.palette.success;
        backgroundColor = { r: 240, g: 253, b: 244 };
        break;
      case 'warning':
        accentColor = this.palette.warning;
        backgroundColor = { r: 255, g: 251, b: 235 };
        break;
      case 'error':
        accentColor = this.palette.error;
        backgroundColor = { r: 254, g: 242, b: 242 };
        break;
      default:
        accentColor = this.palette.accent;
        backgroundColor = { r: 239, g: 246, b: 255 };
    }

    // Calculate content height
    const textLines = this.doc.splitTextToSize(text, width - 2 * padding - 20);
    const contentHeight = titleHeight + (textLines.length * 6) + padding;

    // Background
    this.doc.setFillColor(backgroundColor.r, backgroundColor.g, backgroundColor.b);
    this.doc.roundedRect(x, y, width, contentHeight, 6, 6, 'F');

    // Left accent border
    this.doc.setFillColor(accentColor.r, accentColor.g, accentColor.b);
    this.doc.rect(x, y, 4, contentHeight, 'F');

    // Icon (if provided)
    if (icon) {
      this.addIconBadge(x + 15, y + 12, icon, {
        size: 8,
        backgroundColor: accentColor,
        textColor: { r: 255, g: 255, b: 255 }
      });
    }

    // Title
    this.doc.setTextColor(accentColor.r, accentColor.g, accentColor.b);
    this.doc.setFontSize(PDFTypography.sizes.heading3);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, x + (icon ? 30 : padding), y + 12);

    // Content
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(PDFTypography.sizes.body);
    this.doc.setFont('helvetica', 'normal');
    
    for (let i = 0; i < textLines.length; i++) {
      this.doc.text(textLines[i], x + padding, y + titleHeight + 5 + (i * 6));
    }

    return y + contentHeight + 10;
  }

  // Professional timeline with enhanced styling
  addTimeline(x: number, y: number, width: number, items: Array<{
    title: string;
    description: string;
    duration: string;
    status?: 'upcoming' | 'current' | 'completed';
  }>): number {
    const itemHeight = 35;
    const lineX = x + 20;
    let currentY = y;

    // Timeline line
    this.doc.setDrawColor(this.palette.neutral.r, this.palette.neutral.g, this.palette.neutral.b);
    this.doc.setLineWidth(2);
    this.doc.line(lineX, y, lineX, y + (items.length * itemHeight));

    items.forEach((item, index) => {
      const itemY = currentY + (index * itemHeight);
      
      // Timeline dot
      const dotColor = item.status === 'completed' ? this.palette.success :
                      item.status === 'current' ? this.palette.accent :
                      this.palette.neutral;
      
      this.doc.setFillColor(dotColor.r, dotColor.g, dotColor.b);
      this.doc.ellipse(lineX, itemY + 15, 6, 6, 'F');
      
      // White center for upcoming items
      if (item.status === 'upcoming') {
        this.doc.setFillColor(255, 255, 255);
        this.doc.ellipse(lineX, itemY + 15, 3, 3, 'F');
      }

      // Content card
      this.addCard(x + 35, itemY + 5, width - 45, 25, {
        backgroundColor: this.palette.light,
        borderColor: this.palette.neutral
      });

      // Title
      this.doc.setTextColor(this.palette.primary.r, this.palette.primary.g, this.palette.primary.b);
      this.doc.setFontSize(PDFTypography.sizes.body);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(item.title, x + 42, itemY + 13);

      // Duration badge
      this.doc.setFillColor(this.palette.accent.r, this.palette.accent.g, this.palette.accent.b);
      this.doc.roundedRect(x + width - 35, itemY + 8, 30, 8, 4, 4, 'F');
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(PDFTypography.sizes.small);
      this.doc.text(item.duration, x + width - 20, itemY + 13, { align: 'center' });

      // Description
      this.doc.setTextColor(this.palette.neutral.r, this.palette.neutral.g, this.palette.neutral.b);
      this.doc.setFontSize(PDFTypography.sizes.caption);
      this.doc.setFont('helvetica', 'normal');
      const descLines = this.doc.splitTextToSize(item.description, width - 60);
      this.doc.text(descLines[0], x + 42, itemY + 20);
    });

    return y + (items.length * itemHeight) + 10;
  }

  // Enhanced pricing tables
  addPricingBreakdown(x: number, y: number, width: number, items: Array<{
    category: string;
    amount: number;
    percentage: number;
    description: string;
  }>, currency: string): number {
    const headerHeight = 15;
    const rowHeight = 25;
    let currentY = y;

    // Header with gradient
    this.addGradientBackground(x, currentY, width, headerHeight,
      this.palette.primary, this.palette.secondary);
    
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(PDFTypography.sizes.heading3);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('💰 INVESTMENT BREAKDOWN', x + 10, currentY + 10);

    currentY += headerHeight + 5;

    // Items
    items.forEach((item, index) => {
      const itemY = currentY + (index * rowHeight);
      
      // Alternating backgrounds
      if (index % 2 === 0) {
        this.doc.setFillColor(this.palette.light.r, this.palette.light.g, this.palette.light.b);
        this.doc.rect(x, itemY, width, rowHeight, 'F');
      }

      // Category
      this.doc.setTextColor(this.palette.primary.r, this.palette.primary.g, this.palette.primary.b);
      this.doc.setFontSize(PDFTypography.sizes.body);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(item.category, x + 10, itemY + 10);

      // Description
      this.doc.setTextColor(this.palette.neutral.r, this.palette.neutral.g, this.palette.neutral.b);
      this.doc.setFontSize(PDFTypography.sizes.caption);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(item.description, x + 10, itemY + 17);

      // Progress bar
      this.addProgressBar(x + 10, itemY + 20, 60, item.percentage, {
        height: 4,
        showPercentage: false,
        color: this.palette.accent
      });

      // Percentage and amount
      this.doc.setTextColor(this.palette.accent.r, this.palette.accent.g, this.palette.accent.b);
      this.doc.setFontSize(PDFTypography.sizes.body);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${item.percentage}%`, x + 75, itemY + 12);
      
      this.doc.setTextColor(this.palette.primary.r, this.palette.primary.g, this.palette.primary.b);
      this.doc.setFontSize(PDFTypography.sizes.heading3);
      this.doc.text(this.formatCurrency(item.amount, currency), x + width - 10, itemY + 12, { align: 'right' });
    });

    return currentY + (items.length * rowHeight) + 10;
  }

  // Utility methods
  private formatCurrency(amount: number, currency: string): string {
    const symbols: { [key: string]: string } = {
      USD: '$', EUR: '€', GBP: '£', CAD: '$'
    };
    return `${symbols[currency] || '$'}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

// Enhanced layout utilities
export const LayoutUtils = {
  // Calculate optimal spacing
  getOptimalSpacing(contentHeight: number, pageHeight: number, sections: number): number {
    const availableSpace = pageHeight - contentHeight - 50; // 50px margins
    return Math.max(10, availableSpace / (sections + 1));
  },

  // Two-column layout helper
  getTwoColumnLayout(pageWidth: number, margin: number, gap: number = 15): {
    leftColumn: { x: number; width: number };
    rightColumn: { x: number; width: number };
  } {
    const availableWidth = pageWidth - 2 * margin;
    const columnWidth = (availableWidth - gap) / 2;
    
    return {
      leftColumn: { x: margin, width: columnWidth },
      rightColumn: { x: margin + columnWidth + gap, width: columnWidth }
    };
  },

  // Three-column layout helper
  getThreeColumnLayout(pageWidth: number, margin: number, gap: number = 10): Array<{
    x: number; width: number;
  }> {
    const availableWidth = pageWidth - 2 * margin;
    const columnWidth = (availableWidth - 2 * gap) / 3;
    
    return [
      { x: margin, width: columnWidth },
      { x: margin + columnWidth + gap, width: columnWidth },
      { x: margin + 2 * (columnWidth + gap), width: columnWidth }
    ];
  }
};

// Professional spacing system
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
};