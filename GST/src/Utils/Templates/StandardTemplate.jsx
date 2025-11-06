// StandardTemplate.jsx
import { formatDate } from "../DateUtils";

/**
 * Generates the HTML for each product row in the table
 */
const generateProductRows = (products) => {
  let rows = "";
  let totalCase = 0;
  
  products.forEach((p, index) => {
    const sno = index + 1;
    const caseQty = parseFloat(p.caseQty) || 0;
    const price = parseFloat(p.price) || 0;
    const amount = (caseQty * price).toFixed(2);
    totalCase += caseQty;

    rows += `
      <tr class="product-row">
        <td class="text-center">${sno}</td>
        <td class="text-left">${p.name || ""}</td>
        <td class="text-center">${p.hsn || ""}</td>
        <td class="text-center">${p.per || ""} (${caseQty})</td>
        <td class="text-right">₹${price.toFixed(2)}</td>
        <td class="text-right">₹${amount}</td>
      </tr>
    `;
  });

  // Reduced padding rows to ensure single page
  const minRows = 10;
  if (products.length < minRows) {
    for (let i = 0; i < minRows - products.length; i++) {
      rows += `
        <tr class="empty-row">
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
      `;
    }
  }

  return { rows, totalCase };
};

/**
 * Generates the HTML for the tax rows (CGST/SGST or IGST)
 */
const generateTaxRows = (invoiceData) => {
  const { totals = {}, invoiceType } = invoiceData;
  
  // Add safe access to totals properties
  const subTotal = totals.subTotal || 0;
  const grandTotal = totals.grandTotal || 0;
  const cgst = totals.cgst || 0;
  const sgst = totals.sgst || 0;
  const igst = totals.igst || 0;
  
  if (invoiceType === "Inside TN") {
    return `
      <tr class="subtotal-row">
        <td colspan="4" rowspan="4" class="amount-words">
          <div class="amount-text">
            <strong>Amount in words:</strong><br>
            ${numberToWords(grandTotal)}
          </div>
        </td>
        <td class="total-label">Sub Total</td>
        <td class="total-value">₹${subTotal.toFixed(2)}</td>
      </tr>
      <tr class="tax-row">
        <td class="total-label">CGST 9%</td>
        <td class="total-value">₹${cgst.toFixed(2)}</td>
      </tr>
      <tr class="tax-row">
        <td class="total-label">SGST 9%</td>
        <td class="total-value">₹${sgst.toFixed(2)}</td>
      </tr>
      <tr class="grand-total-row">
        <td class="grand-total-label">Grand Total</td>
        <td class="grand-total-value">₹${grandTotal.toFixed(2)}</td>
      </tr>
    `;
  } else {
    return `
      <tr class="subtotal-row">
        <td colspan="4" rowspan="3" class="amount-words">
          <div class="amount-text">
            <strong>Amount in words:</strong><br>
            ${numberToWords(grandTotal)}
          </div>
        </td>
        <td class="total-label">Sub Total</td>
        <td class="total-value">₹${subTotal.toFixed(2)}</td>
      </tr>
      <tr class="tax-row">
        <td class="total-label">IGST 18%</td>
        <td class="total-value">₹${igst.toFixed(2)}</td>
      </tr>
      <tr class="grand-total-row">
        <td class="grand-total-label">Grand Total</td>
        <td class="grand-total-value">₹${grandTotal.toFixed(2)}</td>
      </tr>
    `;
  }
};

/**
 * Generates watermark CSS based on settings
 */
const generateWatermarkCSS = (watermarkEnabled, logoUrl) => {
  console.log("watermark : ", watermarkEnabled);
  
  if (!watermarkEnabled) {
    return `
      .table-watermark {
        display: none !important;
      }
    `;
  }
  
  return `
    .table-container {
      position: relative;
      margin: 15px 0;
      min-height: 200px;
    }
    
    .table-watermark {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('${logoUrl}') no-repeat center center;
      background-size: 200px 200px;
      opacity: 0.05;
      z-index: 0;
      pointer-events: none;
    }
    
    .products-table {
      position: relative;
      z-index: 1;
    }
  `;
};

// Number to Words Helper Function
function numberToWords(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return "Zero Rupees Only";
  }
  
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", 
    "Seventeen", "Eighteen", "Nineteen"
  ];
  
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const numToWords = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " and " + numToWords(n % 100) : "");
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numToWords(n % 1000) : "");
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + numToWords(n % 100000) : "");
    return numToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + numToWords(n % 10000000) : "");
  };

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let words = numToWords(rupees) + " Rupees";
  if (paise > 0) words += " and " + numToWords(paise) + " Paise";
  return words + " Only";
}

/**
 * Main function to generate the complete HTML invoice
 */
export const generateInvoiceHTML = (invoiceData) => {
  // Add safe defaults for all properties
  const { 
    customer = {}, 
    totals = {}, 
    products = [], 
    settings = {},
    invoiceNumber = "N/A",
    date = new Date(),
    invoiceType = "Inside TN"
  } = invoiceData;
  
  const { rows: productRows, totalCase } = generateProductRows(products);
  const taxRows = generateTaxRows(invoiceData);
  const logoUrl = "https://anucrackers.com/anucrackersog.png";
  
  // Get watermark setting, default to true if not provided
  const watermarkEnabled = settings.invoiceWatermark !== false;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice - ANU CRACKERS</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
          background: #f5f5f5;
          padding: 10px;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        

        /* Header Section - Very Light Colors */
        .invoice-header {
          background: #fafafa;
          padding: 20px 30px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .company-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .logo {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 6px;
          padding: 5px;
          border: 1px solid #e0e0e0;
          position: relative;
          overflow: hidden;
        }

        .logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .company-details h1 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 4px;
          color: #333;
        }
        
        .company-details p {
          font-size: 10px;
          color: #666;
          margin-bottom: 2px;
        }
        
        .gst-badge {
          background: #f0f0f0;
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 9px;
          font-weight: 600;
          color: #666;
          display: inline-block;
          margin-top: 5px;
          border: 1px solid #ddd;
        }
        
        /* Invoice Title */
        .invoice-title-section {
          background: #f5f5f5;
          padding: 10px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .invoice-title {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        
        .invoice-badge {
          background: #e8e8e8;
          color: #666;
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 500;
          border: 1px solid #ddd;
        }
        
        /* Main Content */
        .invoice-content {
          padding: 20px 30px;
          background: white;
        }
        
        /* Customer Section */
        .customer-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
          padding: 15px;
          background: #fafafa;
          border-radius: 4px;
          border: 1px solid #e8e8e8;
        }
        
        .bill-to, .invoice-meta {
          padding: 10px;
        }
        
        .bill-to {
          border-right: 1px dashed #d0d0d0;
        }
        
        .section-label {
          font-size: 10px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }
        
        .customer-name {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 6px;
        }
        
        .customer-details {
          color: #666;
          font-size: 11px;
          line-height: 1.4;
        }
        
        .invoice-meta {
          background: white;
          border-radius: 4px;
          padding: 12px;
          border: 1px solid #e8e8e8;
        }
        
        .meta-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .meta-item:last-child {
          border-bottom: none;
        }
        
        .meta-label {
          font-weight: 500;
          color: #666;
          font-size: 10px;
        }
        
        .meta-value {
          font-weight: 600;
          color: #333;
          font-size: 11px;
        }
                /* Background Watermark on Products Table */
        ${generateWatermarkCSS(watermarkEnabled, logoUrl)}
        
        /* Products Table - Fixed opacity issue */
        .products-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #000000;
          font-size: 10px;
          position: relative;
          z-index: 1;
        }
        
        .products-table thead {
          background: #f5f5f5;
        }
        
        .products-table th {
          padding: 8px 6px;
          text-align: left;
          font-weight: 600;
          color: #333;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          border: none;
          font-size: 9px;
          border-right: 1px solid #000;
        }
        
        .products-table th:last-child {
          
          border-right: none;
        }
        
        .products-table th.text-center {
          text-align: center;
        }
        
        .products-table th.text-right {
          text-align: right;
        }
        
        .products-table td {
          padding: 6px;
          color: #000000;
          font-size: 10px;
          border-right: 1px solid #000000;
        }
        
        .products-table td:last-child {
          border-right: none;
          border-bottom: none;
        }
        
        .products-table tr:last-child td {
          border-bottom: 1px solid #000000;
        }

        .product-row {
            border-top: 1px solid #000000;
            border-bottom: 1px solid #000000;
        }
        
        .product-row:hover {
          background: #fafafa;
        }
        
        .empty-row td {
          padding: 4px;
        }
        
        .text-center { text-align: center; }
        .text-left { text-align: left; }
        .text-right { text-align: right; }
        
        /* Totals Section - Very Light */
        .totals-section {
          background: #fafafa;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin: 15px 0;
        }
        
        .totals-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }
        
        .totals-table td {
          border: 1px solid #e0e0e0;
        }
        
        .amount-words {
          padding: 12px;
          background: white;
        }
        
        .amount-text {
          font-size: 9px;
          color: #666;
          line-height: 1.3;
        }
        
        .total-label{
          padding: 8px 10px;
          font-weight: 600;
          color: #333;
          background: white;
          font-size: 10px;
        }
        .grand-total-label{
          padding: 8px 10px;
          font-weight: 900;
          color: #000;
          background: white;
          font-size: 10px;        
        }
        
        .total-value{
          padding: 8px 10px;
          font-weight: 600;
          text-align: right;
          background: white;
          font-size: 10px;
        }
        .grand-total-value{
          padding: 8px 10px;
          font-weight: 900;
          text-align: right;
          color: #000;
          background: white;
          font-size: 10px;        
        }
        .subtotal-row td {
          border-bottom: 1px solid #e0e0e0;
        }
        
        .tax-row .total-label,
        .tax-row .total-value {
          background: #fafafa;
        }
        
        .grand-total-row .grand-total-label,
        .grand-total-row .grand-total-value {
          background: #f0f0f0;
          color: #333;
          font-size: 11px;
          border: 1px solid #e0e0e0;
        }
        
        /* Bottom CTA Section */
        .bottom-cta-section {
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px dashed #d0d0d0;
        }
        
        /* Signature Section */
        .signature-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .signature-box {
          text-align: center;
        }
        
        .signature-line {
          margin-top: 40px;
          padding-top: 8px;
          border-top: 1px solid #d0d0d0;
          color: #666;
          font-weight: 600;
          font-size: 11px;
        }
        
        /* Contact Info */
        .contact-info {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 10px 0;
          flex-wrap: wrap;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          color: #666;
        }
        
        .contact-icon {
          width: 12px;
          height: 12px;
          color: #666;
        }
        
        /* Footer Note */
        .footer-note {
          text-align: center;
          padding: 15px;
          background: #fafafa;
          border-radius: 4px;
          margin: 20px 0 15px;
          color: #666;
          border: 1px solid #e8e8e8;
        }
        
        .footer-note h3 {
          font-size: 12px;
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
        }
        
        .footer-note p {
          font-size: 10px;
          color: #666;
          line-height: 1.4;
          margin-bottom: 5px;
        }
        
        .footer-brand {
          text-align: center;
          padding: 12px;
          color: #999;
          font-size: 9px;
          border-top: 1px solid #e8e8e8;
          margin-top: 15px;
        }
        
        /* Print Optimization */
        @media print {
          body {
            padding: 0;
            margin: 0;
            background: white !important;
          }
          
          .invoice-container {
            border: none;
            border-radius: 0;
            box-shadow: none;
            max-width: 100%;
            background: white !important;
          }
          
          .invoice-content {
            padding: 15px 20px;
          }
          
          .invoice-header {
            background: #fafafa !important;
            -webkit-print-color-adjust: exact;
          }
          
          .invoice-title-section {
            background: #f5f5f5 !important;
            -webkit-print-color-adjust: exact;
          }
          
          .products-table thead {
            background: #f5f5f5 !important;
            -webkit-print-color-adjust: exact;
          }
          
          .table-watermark {
            display: ${watermarkEnabled ? 'block' : 'none'} !important;
            -webkit-print-color-adjust: exact;
          }
        }
        
        /* Single Page Optimization */
        .page-break {
          page-break-inside: avoid;
        }
        
        /* Responsive for Mobile */
        @media (max-width: 768px) {
          .customer-section {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .bill-to {
            border-right: none;
            border-bottom: 1px dashed #d0d0d0;
            padding-bottom: 15px;
          }
          
          .company-info {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }
          
          .signature-section {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .products-table {
            font-size: 9px;
          }
          
          .products-table th,
          .products-table td {
            padding: 4px 3px;
          }
          
          .table-watermark {
            background-size: 200px 200px;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
      
        <!-- Header Section -->
        <div class="invoice-header">
          <div class="company-info">
            <div class="logo-section">
              <div class="logo">
                <img src="${logoUrl}" alt="ANU CRACKERS">
              </div>
              <div class="company-details">
                <h1>ANU CRACKERS</h1>
                <p>3/44, Naduvapatti Mein Road, Guhanparai, Sivakasi-626160</p>
                <div class="gst-badge">GST: 33ABZFA3528P1ZQ</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Invoice Title -->
        <div class="invoice-title-section">
          <div class="invoice-title">TAX INVOICE</div>
          <div class="invoice-badge">ORIGINAL</div>
        </div>
        
        <!-- Main Content -->
        <div class="invoice-content">
          <!-- Customer & Invoice Details -->
          <div class="customer-section">
            <div class="bill-to">
              <span class="section-label">Bill To</span>
              <div class="customer-name">${customer?.name || "N/A"}</div>
              <div class="customer-details">
                ${customer?.address ? `<div>${customer.address}</div>` : ""}
                ${customer?.phone ? `<div>Phone: ${customer.phone}</div>` : ""}
                ${customer?.aadhar ? `<div>Aadhar: ${customer.aadhar}</div>` : ""}
                ${customer?.gst ? `<div>GSTIN: ${customer.gst}</div>` : ""}
              </div>
            </div>
            
            <div class="invoice-meta">
              <span class="section-label">Invoice Details</span>
              <div class="meta-item">
                <span class="meta-label">Invoice No</span>
                <span class="meta-value">${invoiceNumber}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Date</span>
                <span class="meta-value">${formatDate(date)}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Items</span>
                <span class="meta-value">${products.length}</span>
              </div>
            </div>
          </div>
          
          <!-- Products Table with Watermark Background -->
          <div class="table-container">
            
            <table class="products-table">
              <thead>
                <tr>
                  <th class="text-center">S.No</th>
                  <th class="text-left">Product Description</th>
                  <th class="text-center">HSN Code</th>
                  <th class="text-center">Quantity</th>
                  <th class="text-right">Rate (₹)</th>
                  <th class="text-right">Amount (₹)</th>
                </tr>
              </thead>

              <tbody>
                ${productRows}
              </tbody>
            </table>
          </div>
          
          <!-- Totals Section with Very Light Borders -->
          <div class="totals-section">
            <table class="totals-table">
              <tbody>
                ${taxRows}
              </tbody>
            </table>
          </div>
          
          <!-- Bottom CTA Section -->
          <div class="bottom-cta-section">
            <!-- Signature Section -->
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line">
                  Receiver's Signature
                </div>
              </div>
              <div class="signature-box">
                <div class="signature-line">
                  For ANU CRACKERS<br>
                  Authorised Signatory
                </div>
              </div>
            </div>
            
            <!-- Contact Information -->
            <div class="contact-info">
              <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                devafireworks@gmail.com
              </div>
              <div class="contact-item">
                <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                +91 99949 71990
              </div>
            </div>
            
            <!-- Footer Brand -->
            <div class="footer-brand">
              ANU CRACKERS • Quality Fireworks Since 1995 • www.anucrackers.com
            </div>
          </div>
        </div>
      </div>
                    <div class="table-watermark"/>
    </body>
    </html>
  `;
};