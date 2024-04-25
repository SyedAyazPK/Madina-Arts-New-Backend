const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
// Pdf  Library

module.exports.pdfGenerator = async (data) => {
  try {
    const {
      fname,
      lname,
      email,
      phone,
      sumOfSellPrice,
      method,
      status,
      totalQty,
    } = data;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([550, 750]);
    // Set font and font size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.setFont(font);
    page.setFontSize(12);
    // Set body text style
    const bodyTextStyle = { x: 50, y: 650, color: rgb(0.2, 0.2, 0.2) };
    const lineHeight = 18;
    //Put the text into the page
    const dataDetail = `
    Dear Customer ${fname} ${lname},

    Thank you for choosing our products! Your order details are given below:


    First Name: ${fname} ${lname}
    Email: ${email}
    Phone: ${phone}
    Total Sell Price: ${sumOfSellPrice}
    Payment Method: ${method}
    Status : ${status}
    Total Quantity: ${totalQty}


    We truly value your business and look forward to serving you again in the future.

    Warm regards,
    The Madina Arts Team
  `;
    // Draw the data text with multiple lines
    const lines = dataDetail.split("\n");
    lines.forEach((line, index) => {
      page.drawText(line, { ...bodyTextStyle, y: 650 - index * lineHeight });
    });

    // Draw footer text
    const footerText = "For any inquiries, please contact support@example.com";
    page.drawText(footerText, { x: 50, y: 50 });
    // Save the PDF to a buffer
    const pdfBytes = await pdfDoc.save();
    const filePath = path.join(__dirname, "..", "pdf", "new.pdf");
    fs.writeFileSync(filePath, pdfBytes);
    return pdfBytes;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};
