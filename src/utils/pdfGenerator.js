import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Helper function to format date in Arabic
const formatArabicDate = (dateString) => {
  const date = new Date(dateString)
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    calendar: 'islamic'
  }
  try {
    return date.toLocaleDateString('ar-IQ', options)
  } catch {
    return date.toLocaleDateString('ar-SA')
  }
}

// Generate PDF using HTML template
export const generateInsurancePDF = async (doc) => {
  // Create a temporary HTML element
  const tempDiv = window.document.createElement('div')
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  tempDiv.style.width = '210mm'
  tempDiv.style.padding = '20mm'
  tempDiv.style.backgroundColor = '#ffffff'
  tempDiv.style.fontFamily = 'Arial, sans-serif'
  tempDiv.style.direction = 'rtl'
  tempDiv.style.textAlign = 'right'
  
  tempDiv.innerHTML = `
    <div style="
      width: 100%;
      max-width: 170mm;
      margin: 0 auto;
      padding: 20px;
      background: white;
      color: #000;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      direction: rtl;
      text-align: right;
    ">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #5FBF50; padding-bottom: 20px;">
        <h1 style="
          font-size: 28px;
          font-weight: bold;
          color: #3F7F34;
          margin: 0;
          padding: 0;
        ">وثيقة تأمين سفر</h1>
      </div>

      <!-- Document Info -->
      <div style="margin-bottom: 25px;">
        <div style="margin-bottom: 10px;">
          <strong style="font-size: 14px; color: #333;">رقم الوثيقة:</strong>
          <span style="font-size: 14px; margin-right: 10px;">${doc.documentNumber}</span>
        </div>
        <div style="margin-bottom: 10px;">
          <strong style="font-size: 14px; color: #333;">تاريخ الإصدار:</strong>
          <span style="font-size: 14px; margin-right: 10px;">${formatArabicDate(doc.createdAt)}</span>
        </div>
      </div>

      <!-- Traveler Information -->
      <div style="margin-bottom: 25px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="
          font-size: 18px;
          font-weight: bold;
          color: #3F7F34;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #5FBF50;
        ">معلومات المسافر</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
              <strong style="color: #555; width: 150px; display: inline-block;">الاسم الكامل:</strong>
              <span>${doc.travelerName}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
              <strong style="color: #555; width: 150px; display: inline-block;">تاريخ الميلاد:</strong>
              <span>${doc.travelerBirthDate}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
              <strong style="color: #555; width: 150px; display: inline-block;">الجنس:</strong>
              <span>${doc.travelerGender}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">
              <strong style="color: #555; width: 150px; display: inline-block;">رقم جواز السفر:</strong>
              <span>${doc.passportNumber}</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Trip Information -->
      <div style="margin-bottom: 25px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="
          font-size: 18px;
          font-weight: bold;
          color: #3F7F34;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #5FBF50;
        ">معلومات الرحلة</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
              <strong style="color: #555; width: 150px; display: inline-block;">بلد الوجهة:</strong>
              <span>${doc.destination}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
              <strong style="color: #555; width: 150px; display: inline-block;">تاريخ البداية:</strong>
              <span>${formatArabicDate(doc.startDate)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
              <strong style="color: #555; width: 150px; display: inline-block;">تاريخ النهاية:</strong>
              <span>${formatArabicDate(doc.endDate)}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0;">
              <strong style="color: #555; width: 150px; display: inline-block;">مدة السفر:</strong>
              <span>${doc.duration} يوم</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Price Information -->
      <div style="
        margin-bottom: 25px;
        padding: 20px;
        background: linear-gradient(135deg, rgba(95, 191, 80, 0.1) 0%, rgba(63, 127, 52, 0.1) 100%);
        border: 2px solid #5FBF50;
        border-radius: 8px;
        text-align: center;
      ">
        <h2 style="
          font-size: 18px;
          font-weight: bold;
          color: #3F7F34;
          margin-bottom: 15px;
        ">معلومات السعر</h2>
        <div style="font-size: 24px; font-weight: bold; color: #5FBF50;">
          قيمة القسط: ${doc.price} دينار عراقي
        </div>
        <div style="margin-top: 10px; font-size: 14px; color: #555;">
          الحالة: <strong style="color: ${doc.status === 'active' ? '#10B981' : '#6B7280'}">${doc.status === 'active' ? 'نشط' : 'منتهي'}</strong>
        </div>
      </div>

      <!-- Footer -->
      <div style="
        margin-top: 40px;
        padding-top: 20px;
        border-top: 2px solid #e0e0e0;
        text-align: center;
        font-size: 12px;
        color: #666;
      ">
        <p style="margin: 5px 0;">هذه الوثيقة صادرة إلكترونياً وهي صالحة للاستخدام</p>
        <p style="margin: 5px 0;">للمزيد من المعلومات يرجى التواصل معنا</p>
      </div>
    </div>
  `
  
  window.document.body.appendChild(tempDiv)
  
  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: tempDiv.scrollWidth,
      height: tempDiv.scrollHeight,
    })
    
    // Remove temporary element
    window.document.body.removeChild(tempDiv)
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    return pdf
  } catch (error) {
    if (tempDiv.parentNode) {
      window.document.body.removeChild(tempDiv)
    }
    console.error('Error generating PDF:', error)
    throw error
  }
}

// Legacy function for simple text-based PDF (fallback)
export const generateSimplePDF = (document) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  let y = 20
  const margin = 20
  const pageWidth = 210
  const pageHeight = 297

  // Title
  doc.setFontSize(20)
  doc.text('وثيقة تأمين سفر', pageWidth / 2, y, { align: 'center' })
  y += 15

  // Document Number
  doc.setFontSize(12)
  doc.text(`رقم الوثيقة: ${document.documentNumber}`, margin, y)
  y += 8
  doc.text(`تاريخ الإصدار: ${formatArabicDate(document.createdAt)}`, margin, y)
  y += 15

  // Traveler Information
  doc.setFontSize(14)
  doc.text('معلومات المسافر', margin, y)
  y += 10
  doc.setFontSize(10)
  doc.text(`الاسم: ${document.travelerName}`, margin, y)
  y += 7
  doc.text(`تاريخ الميلاد: ${document.travelerBirthDate}`, margin, y)
  y += 7
  doc.text(`الجنس: ${document.travelerGender}`, margin, y)
  y += 7
  doc.text(`رقم جواز السفر: ${document.passportNumber}`, margin, y)
  y += 15

  // Trip Information
  doc.setFontSize(14)
  doc.text('معلومات الرحلة', margin, y)
  y += 10
  doc.setFontSize(10)
  doc.text(`بلد الوجهة: ${document.destination}`, margin, y)
  y += 7
  doc.text(`تاريخ البداية: ${formatArabicDate(document.startDate)}`, margin, y)
  y += 7
  doc.text(`تاريخ النهاية: ${formatArabicDate(document.endDate)}`, margin, y)
  y += 7
  doc.text(`مدة السفر: ${document.duration} يوم`, margin, y)
  y += 15

  // Price Information
  doc.setFontSize(14)
  doc.text('معلومات السعر', margin, y)
  y += 10
  doc.setFontSize(12)
  doc.text(`قيمة القسط: ${document.price} دينار عراقي`, margin, y)
  y += 8
  doc.setFontSize(10)
  doc.text(`الحالة: ${document.status === 'active' ? 'نشط' : 'منتهي'}`, margin, y)
  y += 20

  // Footer
  doc.setFontSize(8)
  const footerY = pageHeight - 20
  doc.text('هذه الوثيقة صادرة إلكترونياً وهي صالحة للاستخدام', pageWidth / 2, footerY, { align: 'center' })
  doc.text('للمزيد من المعلومات يرجى التواصل معنا', pageWidth / 2, footerY + 7, { align: 'center' })

  return doc
}

export const downloadPDF = async (document) => {
  try {
    const pdfDoc = await generateInsurancePDF(document)
    pdfDoc.save(`وثيقة-تأمين-${document.documentNumber}.pdf`)
  } catch (error) {
    console.error('Error generating PDF with HTML, falling back to simple PDF:', error)
    // Fallback to simple PDF if HTML conversion fails
    const pdfDoc = generateSimplePDF(document)
    pdfDoc.save(`وثيقة-تأمين-${document.documentNumber}.pdf`)
  }
}
