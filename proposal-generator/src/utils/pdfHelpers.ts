import jsPDF from 'jspdf';

export const addPageNumbers = (doc: jsPDF): void => {
  const pageCount = (doc as any).internal.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Page number styling
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    doc.text(
      `Page ${i} of ${pageCount}`, 
      pageWidth - 20, 
      pageHeight - 8, 
      { align: 'right' }
    );
  }
};

export const addCoverPage = (
  doc: jsPDF, 
  data: any, 
  template: string,
  color: { r: number; g: number; b: number }
): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Full-page background
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Logo if available
  if (data.branding.logoUrl) {
    try {
      doc.addImage(data.branding.logoUrl, 'JPEG', pageWidth / 2 - 25, 60, 50, 40);
    } catch (error) {
      console.warn('Could not add logo to cover:', error);
    }
  }

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(data.branding.companyName, pageWidth / 2, 120, { align: 'center' });

  // Title
  doc.setFontSize(36);
  doc.text('PROJECT PROPOSAL', pageWidth / 2, 150, { align: 'center' });

  // Project name
  doc.setFontSize(20);
  doc.setFont('helvetica', 'normal');
  doc.text(data.project.title, pageWidth / 2, 170, { align: 'center' });

  // Client info
  doc.setFontSize(16);
  doc.text(`Prepared for ${data.client.company || data.client.name}`, pageWidth / 2, 200, { align: 'center' });

  // Date
  doc.setFontSize(12);
  doc.text(new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), pageWidth / 2, 220, { align: 'center' });

  // Template badge
  doc.setFillColor(255, 255, 255, 0.2);
  doc.roundedRect(pageWidth / 2 - 30, 240, 60, 15, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(`${template.toUpperCase()} TEMPLATE`, pageWidth / 2, 250, { align: 'center' });

  // Contact info at bottom
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(data.branding.yourName, pageWidth / 2, pageHeight - 40, { align: 'center' });
  doc.text(data.branding.yourEmail, pageWidth / 2, pageHeight - 30, { align: 'center' });
  if (data.branding.yourPhone) {
    doc.text(data.branding.yourPhone, pageWidth / 2, pageHeight - 20, { align: 'center' });
  }
};

export const addTableOfContents = (
  doc: jsPDF, 
  yPosition: number, 
  margin: number, 
  pageWidth: number,
  color: { r: number; g: number; b: number }
): number => {
  // Table of Contents header
  doc.setFillColor(color.r, color.g, color.b);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 15, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('📑 TABLE OF CONTENTS', margin + 8, yPosition + 10);
  
  yPosition += 25;

  const contents = [
    { title: 'Executive Summary', page: 2 },
    { title: 'Client Information', page: 2 },
    { title: 'Project Specifications', page: 2 },
    { title: 'Project Timeline', page: 3 },
    { title: 'Investment Breakdown', page: 3 },
    { title: 'Value Proposition', page: 4 },
    { title: 'Risk Mitigation', page: 4 },
    { title: 'Terms & Conditions', page: 4 }
  ];

  contents.forEach((item, index) => {
    const itemY = yPosition + (index * 10);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(item.title, margin + 10, itemY);
    
    // Dotted line
    const dotsStart = margin + 10 + doc.getTextWidth(item.title) + 5;
    const dotsEnd = pageWidth - margin - 20;
    const dotCount = Math.floor((dotsEnd - dotsStart) / 3);
    
         for (let i = 0; i < dotCount; i++) {
       doc.ellipse(dotsStart + (i * 3), itemY - 2, 0.3, 0.3, 'F');
     }
    
    doc.text(item.page.toString(), pageWidth - margin - 10, itemY, { align: 'right' });
  });

  return yPosition + (contents.length * 10) + 20;
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 59, g: 130, b: 246 };
};