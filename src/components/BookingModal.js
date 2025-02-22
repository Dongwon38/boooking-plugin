// BookingModal.js

import { useState } from "react";
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
  const STATUS = {
    DRAFT: "draft",            // 예약이 임시 저장된 상태
    BOOKED: "booked",          // 고객이 예약을 완료했지만, 관리자가 확인하지 않은 상태
    CHECKED: "checked",        // 관리자가 예약을 확인한 상태
    COMPLETED: "completed",    // 고객이 방문하여 예약을 완료한 상태
    SURVEY_SENT: "survey_sent", // 설문 요청 이메일을 보낸 상태
    CANCELLED: "cancelled",    // 고객이 예약을 취소한 상태
    NO_SHOW: "no_show",        // 고객이 노쇼한 상태
  };

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
        booking_status: STATUS.BOOKED,
      },
    };
  
    try {
      const response = await fetch(`${window.wsBookingData.restUrl}booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
  // 예약 정보 저장 ================================================================= //


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative z-50">
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">&times;</button>

        {/* 진행 단계 표시 */}
        <div className="mb-4 flex justify-between text-sm font-bold">
          <span className={step >= 1 ? "text-blue-500" : "text-gray-400"}>Program</span>
          <span className={step >= 2 ? "text-blue-500" : "text-gray-400"}>Technician</span>
          <span className={step >= 3 ? "text-blue-500" : "text-gray-400"}>Date/Time</span>
          <span className={step >= 4 ? "text-blue-500" : "text-gray-400"}>Info</span>
          <span className={step >= 5 ? "text-blue-500" : "text-gray-400"}>Review</span>
        </div>

        {/* 예약 완료 메시지 */}
        {isConfirmed ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-green-600 mb-4">Your booking has been confirmed!</h2>
            <p>Thank you, {customerInfo.name}! A confirmation email has been sent to {customerInfo.email}.</p>
            <p><strong>Program:</strong> {selectedProgram?.name} ({selectedProgram?.price})</p>
            <p><strong>Technician:</strong> {selectedTechnician?.title.rendered}</p>
            <p><strong>Date & Time:</strong> {selectedDateTime?.date} at {selectedDateTime?.time}</p>
            <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        ) : (
          <>
            {/* 단계별 UI */}
            {step === 1 && <ProgramSelection onSelect={handleProgramSelect} />}
            {step === 2 && <TechnicianSelection tempTechnician={tempTechnician} selectedProgram={selectedProgram} onSelect={handleTechnicianSelect} />}
            {step === 3 && <DateTimeSelection selectedTechnician={selectedTechnician} selectedProgram={selectedProgram} onSelect={handleDateTimeSelect} />}
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
            <button className="text-blue-500" onClick={handlePrev} disabled={step === 1}>Back</button>
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
