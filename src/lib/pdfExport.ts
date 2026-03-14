import jsPDF from 'jspdf';
import { Comic } from '@/types';

export async function exportComicToPDF(comic: Comic): Promise<void> {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pw = pdf.internal.pageSize.getWidth();
  const ph = pdf.internal.pageSize.getHeight();

  // Cover page
  pdf.setFillColor(comic.coverColor);
  pdf.rect(0, 0, pw, ph, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(40);
  pdf.setFont('helvetica', 'bold');
  pdf.text(comic.title, pw / 2, ph / 2 - 10, { align: 'center' });
  pdf.setFontSize(16);
  pdf.text(`by ${comic.authorName}`, pw / 2, ph / 2 + 10, { align: 'center' });
  pdf.setFontSize(12);
  pdf.text(`${comic.pageCount} pages`, pw / 2, ph / 2 + 22, { align: 'center' });

  // Pages
  for (const page of comic.pages) {
    pdf.addPage();
    pdf.setFillColor(page.backgroundColor || '#ffffff');
    pdf.rect(0, 0, pw, ph, 'F');

    if (page.drawingData) {
      try {
        pdf.addImage(page.drawingData, 'PNG', 10, 10, pw - 20, ph - 20);
      } catch { /* skip if invalid */ }
    }

    // Text bubbles
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    page.textBubbles?.forEach(bubble => {
      const x = (bubble.x / 100) * pw + 10;
      const y = (bubble.y / 100) * ph + 10;
      pdf.setDrawColor(0);
      pdf.setFillColor(255, 255, 255);
      const textW = Math.min(bubble.width / 100 * pw, 80);
      pdf.roundedRect(x, y, textW, 12, 3, 3, 'FD');
      pdf.text(bubble.text.substring(0, 50), x + 3, y + 8);
    });

    // Sound effects
    pdf.setFontSize(18);
    pdf.setTextColor(255, 50, 0);
    page.soundEffects?.forEach(sfx => {
      const x = (sfx.x / 100) * pw;
      const y = (sfx.y / 100) * ph;
      pdf.text(sfx.text, x, y);
    });

    // Page number
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Page ${page.pageNumber}`, pw - 15, ph - 5);
  }

  pdf.save(`${comic.title.replace(/\s+/g, '_')}_comic.pdf`);
}
