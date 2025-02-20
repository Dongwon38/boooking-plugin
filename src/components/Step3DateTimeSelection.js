import { useState, useEffect } from "react";

export default function Step3DateTimeSelection({ selectedTechnician, selectedProgram, onSelect }) {
  const [availableDates, setAvailableDates] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const workDays = selectedTechnician?.acf?.work_days || [];
  let availableTimes = selectedTechnician?.acf?.available_times || [];

  useEffect(() => {
    if (!selectedTechnician) return;

    fetch(`${window.wsBookingData.restUrl}bookings?technician=${selectedTechnician.title.rendered}`)
      .then((res) => res.json())
      .then((data) => setBookedSlots(data))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, [selectedTechnician]);

  // 프로그램의 예약 시간(서비스 시간 + 준비시간 + 정리시간)
  const programDuration = Number(selectedProgram?.duration) || 60;
  const bufferTime = 15;            // ===> 프로그램 종료 후 블록해야 하는 시간 (정리 시간)
  const minAdvanceBookingTime = 60; // ===> 현재 시각 기준 최소 예약 가능 시간 (ex. 60분 후부터 예약 가능)
  const maxBookingDays = 30;        // ===> 오늘로부터 최대 예약 가능 일수
  const closingTime = "17:00";      // ===> 마감 시간
  const totalBlockTime = programDuration + bufferTime;

  // 현재 시각을 기준으로 60분 이후만 예약 가능하도록 설정
  const getCurrentTimeWithBuffer = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minAdvanceBookingTime); 
    return now.getHours() * 60 + now.getMinutes(); 
  };

  // 예약된 시간과 겹치는지 확인하는 함수
  const isTimeAvailable = (date, time) => {
    const [hour, minute] = time.split(":").map(Number);
    const newBookingStart = hour * 60 + minute;
    const newBookingEnd = newBookingStart + totalBlockTime;
    const newBookingLastCall = newBookingEnd - bufferTime;


    // 현재 날짜면 현재 시간 + 60분 이후만 가능하도록 체크
    const today = new Date().toISOString().split("T")[0];
    if (date === today && newBookingStart < getCurrentTimeWithBuffer()) {
      return false;
    }

    // 클로징 시간을 초과하면 예약 불가능
    const [closingHour, closingMinute] = closingTime.split(":").map(Number);
    const closingTimeInMinutes = closingHour * 60 + closingMinute;
    if (newBookingStart >= closingTimeInMinutes || newBookingLastCall > closingTimeInMinutes) {
      return false;
    }

    return !bookedSlots.some((booking) => {
      if (booking.date !== date) return false;
      const [bookedHour, bookedMinute] = booking.time.split(":").map(Number);
      const bookedStart = bookedHour * 60 + bookedMinute;
      const bookedEnd = bookedStart + (Number(booking.duration) + bufferTime);
      return !(newBookingEnd <= bookedStart || newBookingStart >= bookedEnd);
    });
  };

  // 사용 가능한 날짜 생성
  useEffect(() => {
    const today = new Date();
    const nextWeek = [...Array(maxBookingDays)].map((_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return {
        date: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase(),
      };
    });

    const filteredDates = nextWeek
      .filter(({ day }) => workDays.includes(day))
      .map(({ date }) => ({
        date,
        times: availableTimes.filter((time) => isTimeAvailable(date, time)),
      }));
    setAvailableDates(filteredDates);
  }, [bookedSlots]);

  return (
    <div>
      <h3 className="text-lg font-semibold">Select Date & Time</h3>
      {availableDates.map(({ date, times }) => (
        <div key={date} className="mb-4">
          <p className="font-bold">{date}</p>
          <div className="grid grid-cols-4 gap-2">
            {times.length > 0 ? (
              times.map((time) => (
                <button
                  key={time}
                  onClick={() => onSelect({ date, time })}
                  className="p-2 border rounded bg-gray-200 hover:bg-gray-300"
                >
                  {time}
                </button>
              ))
            ) : (
              <p className="text-gray-500">No available slots</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
