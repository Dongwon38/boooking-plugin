// BookingModal.js

import { useState, useEffect } from "react";
import ProgramSelection from "./Step1ProgramSelection";
import TechnicianSelection from "./Step2TechnicianSelection";
import DateTimeSelection from "./Step3DateTimeSelection";
import CustomerInfo from "./Step4CustomerInfo";
import Review from "./Step5Review";
import { sendBookingEmail } from "./Step6SendEmail";

export default function BookingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", email: "" });
  const [tempProgram, setTempProgram] = useState(null);
  const [tempTechnician, setTempTechnician] = useState(null);
  const [tempDateTime, setTempDateTime] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      resetBookingState();
    }
  }, [isOpen]);

  const resetBookingState = () => {
    setStep(1);
    setSelectedProgram(null);
    setSelectedTechnician(null);
    setSelectedDateTime(null);
    setCustomerInfo({ name: "", phone: "", email: "" });
    setTempProgram(null);
    setTempTechnician(null);
    setTempDateTime(null);
    setIsConfirmed(false);
  };
  

  const handleNext = () => {
    if (step === 1) setSelectedProgram(tempProgram);
    if (step === 2) setSelectedTechnician(tempTechnician);
    if (step === 3) setSelectedDateTime(tempDateTime);
    if (step === 4) {
      if (customerInfo.name && customerInfo.phone && customerInfo.email) {
        handleCustomerInfoSubmit(customerInfo)
      } else {
        alert("Please fill in all fields.");
      }
    }
    setStep((prev) => prev + 1);
  }
  
  const handleKeyDown = (e) => {
    if (step === 4 && e.key === "Enter") {
      handleNext();
    }
  };
  
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleClose = () => {
    resetBookingState();
    onClose();
  };

  const handleProgramSelect = (program) => {
    setTempProgram(program);
    console.log("Selected program:", program);
  };

  const handleTechnicianSelect = (technician) => {
    setTempTechnician(technician);
    console.log("Selected technician:", technician);
  };

  const handleDateTimeSelect = (dateTime) => {
    setTempDateTime(dateTime);
    console.log("Selected date/time:", dateTime);
  };

  const handleCustomerInfoSubmit = (customer) => {
    setCustomerInfo(customer);
    console.log("Customer info (Main):", customer);
  };

  // 예약 정보 저장 ================================================================= //
  const handleConfirmBooking = async () => {
    const bookingData = {
      title: `${customerInfo.name}`, 
      status: "publish",
      fields: {
        program_name: selectedProgram?.name,
        program_duration: selectedProgram?.duration,
        program_price: selectedProgram?.price,
        technician: selectedTechnician.title.rendered,
        date: selectedDateTime?.date,
        time: selectedDateTime?.time,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email,
        booking_status: "booked",
      },
    };
  
    try {
      const response = await fetch(`${window.wsBookingData.restUrl}booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
  
      if (!response.ok) throw new Error("Failed to save booking");
  
      const result = await response.json();
      console.log("Booking saved:", result);

      // ✅ 예약이 성공하면 이메일 전송
      await sendBookingEmail(customerInfo, selectedProgram, selectedTechnician, selectedDateTime);
      setIsConfirmed(true); // 예약 완료 상태 변경
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Failed to save your booking. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleClose} // 바깥 클릭 시 닫힘
    >
      <div
        className="bg-white grid grid-rows-[60px_1fr_54px] p-6 md:rounded-lg w-full h-full md:max-h-lg relative z-50 transition-transform transform scale-100 md:max-w-lg lg:max-w-xl"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫히지 않도록 설정
      >
        {/* 닫기 버튼 */}
        <button onClick={handleClose} className="absolute top-2 right-2 text-xl">&times;</button>

        {/* 진행 단계 표시 */}
        <div className="mb-4 flex justify-between text-sm font-bold">
          <span className={step >= 1 ? "text-blue-500" : "text-gray-400"}>Program</span>
          <span className={step >= 2 ? "text-blue-500" : "text-gray-400"}>By</span>
          <span className={step >= 3 ? "text-blue-500" : "text-gray-400"}>Date/Time</span>
          <span className={step >= 4 ? "text-blue-500" : "text-gray-400"}>Info</span>
          <span className={step >= 5 ? "text-blue-500" : "text-gray-400"}>Review</span>
        </div>

        {/* 예약 완료 메시지 */}
        {isConfirmed ? (
          <div className="text-center">
          <h2 className="text-xl font-semibold text-green-600 mb-4">Your booking has been confirmed!</h2>
          <p>Thank you, {customerInfo.name}! A confirmation email has been sent to {customerInfo.email}.</p>
          <button
            onClick={() => {
              handleClose();
              window.location.reload();
            }}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
        ) : (
          <>
            {/* 단계별 UI */}
            {step === 1 && <ProgramSelection onSelect={handleProgramSelect} />}
            {step === 2 && <TechnicianSelection tempTechnician={tempTechnician} selectedProgram={selectedProgram} onSelect={handleTechnicianSelect} />}
            {step === 3 && <DateTimeSelection tempDateTime={tempDateTime} setTempDateTime={setTempDateTime} selectedTechnician={selectedTechnician} selectedProgram={selectedProgram} onSelect={handleDateTimeSelect} />}
            {step === 4 && <CustomerInfo customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} handleKeyDown={handleKeyDown} />}
            {step === 5 && (
              <Review 
                selectedProgram={selectedProgram}
                selectedTechnician={selectedTechnician}
                selectedDateTime={selectedDateTime}
                customerInfo={customerInfo}
                onConfirm={handleConfirmBooking} 
              />
            )}
          </>
        )}

        {/* 단계 이동 버튼 */}
        {!isConfirmed && (
          <div className="mt-4 flex justify-between">
            <button className={step === 1 ? "text-gray-500" : "text-blue-500"} onClick={handlePrev} disabled={step === 1}>Back</button>
            {step < 5 ? (
              <button
                onClick={handleNext}
                className={`px-4 py-2 rounded ${
                  (step === 1 && !tempProgram) ||
                  (step === 2 && !tempTechnician) ||
                  (step === 3 && !tempDateTime) ||
                  (step === 4 && !customerInfo) ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
                }`}
                disabled={
                  (step === 1 && !tempProgram) ||
                  (step === 2 && !tempTechnician) ||
                  (step === 3 && !tempDateTime) ||
                  (step === 4 && !customerInfo) 
                }
              >
                Next
              </button>
            ) : (
              <button onClick={handleConfirmBooking} className="bg-green-500 text-white px-4 py-2 rounded">
                Confirm Booking
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
