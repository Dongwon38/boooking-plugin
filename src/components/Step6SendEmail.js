
export const sendBookingEmail = async (customerInfo, selectedProgram, selectedTechnician, selectedDateTime) => {
  const companyName = "Company Name"; // 회사명
  // const companyLogo = "https://example.com/logo.png"; // ✅ 회사 로고 (URL로 추가)
  const companyAddress = "555 Seymour St, Vancouver, BC V6B 3H6"; // 회사 주소
  const companyBusinessHour = "Mon-Fri 9:00-17:00"; // 영업시간
  const supportEmail = "admin@example.com"; // 관리자 이메일
  const supportPhone = "234-567-8900"; // 관리자 전화번호

  // 메일 본문 내용 (줄 바꿈 및 공백을 인코딩하여 안전하게 처리)
  const mailtoBody = `
Hello,

I would like to request a change or cancellation for the following booking:

Booking Information:
- Customer Name: ${customerInfo.name}
- Phone Number: ${customerInfo.phone}
- Booking Date and Time: ${selectedDateTime.date} at ${selectedDateTime.time}
- Program: ${selectedProgram.name}
- Technician: ${selectedTechnician.title.rendered}

Request : Change / Cancellation (Please select one)

(Please provide additional details here if necessary.)

Thank you.
`;

  const mailtoLink = `mailto:${supportEmail}?subject=Booking Cancellation/Change Request&body=${encodeURIComponent(mailtoBody)}`;

  // ✅ HTML 형식으로 이메일 작성
  const emailData = {
    to: customerInfo.email,
    subject: "Your Booking Confirmation",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
        <h2 style="color: #333;">Dear ${customerInfo.name},</h2>
        <p style="font-size: 16px; color: #555;">We are pleased to confirm your booking.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Service:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${selectedProgram.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Technician:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${selectedTechnician.title.rendered}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${selectedDateTime.date}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Time:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${selectedDateTime.time}</td>
          </tr>
        </table>
  
        <p style="margin-top: 20px; font-size: 14px; color: #555;">
          If you need to <strong>reschedule or cancel</strong> your appointment, please contact us at 
          <a href="tel:${supportPhone}" style="color: #007bff; text-decoration: none;">${supportPhone}</a> 
          or email us at <a href="mailto:${supportEmail}" style="color: #007bff; text-decoration: none;">${supportEmail}</a>.
        </p>
  
        <p>
          <a href="${mailtoLink}" style="display:inline-block; padding:10px 15px; background:#ff4d4d; color:#fff; text-decoration:none; border-radius:5px;">
            Request Change or Cancellation
          </a>
        </p>
          
        <p style="font-size: 14px; color: red;">
          (A 40% cancellation fee applies for cancellations made within 12 hours of the appointment. 
          No-shows will be charged the full amount.)
        </p>
  
        <hr style="margin: 20px 0;">
        
        <p style="text-align: center; font-size: 14px; color: #666;">
          ${companyName} <br>
          ${companyAddress} <br>
          <strong>Business Hours:</strong> ${companyBusinessHour}
          <p><strong>Find us:</strong> <a href="https://www.google.com/maps/search/?api=1&query=${companyAddress}" style="color: #007bff;">View on Google Maps</a></p>
        </p>
      </div>
    `,
  };
  


  try {
    const response = await fetch(`${window.wsBookingData.restUrl}send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) throw new Error("Failed to send email");

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

