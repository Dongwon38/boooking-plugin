export const sendBookingEmail = async (customerInfo, selectedProgram, selectedTechnician, selectedDateTime) => {
    const emailData = {
      to: customerInfo.email,
      subject: "Your Booking Confirmation",
      body: `
        Hello ${customerInfo.name},
  
        Your booking has been confirmed.
  
        - Program: ${selectedProgram.name}
        - Technician: ${selectedTechnician.title.rendered}
        - Date: ${selectedDateTime.date}
        - Time: ${selectedDateTime.time}
  
        Thank you for booking with us!
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
  