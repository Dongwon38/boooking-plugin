import { useState, useEffect } from "react";

export default function Step3DateTimeSelection({ tempDateTime, setTempDateTime, selectedTechnician, selectedProgram, onSelect }) {
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
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
    const dayOffs = selectedTechnician?.acf?.day_off_field?.map(({ day_off }) => day_off) || [];

    const today = new Date();
    console.log("today:", today);

    const nextWeek = [...Array(maxBookingDays)].map((_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return {
        date: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase(),
      };
    });
    console.log("nextWeek:", nextWeek);

    const filteredDates = nextWeek
      .filter(({ date, day }) => {
        // 1️⃣ 해당 날짜가 Day Off인지 체크
        if (dayOffs.includes(date)) return false;

        // 2️⃣ 근무 요일인지 체크
        return workDays.includes(day);
      }).map(({ date }) => ({
        date,
        times: availableTimes.filter((time) => isTimeAvailable(date, time)),
      }));
    setAvailableDates(filteredDates);
  }, [bookedSlots]);

    // 현재 월과 다음 월 가져오기
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0 (Jan) ~ 11 (Dec)
    const nextMonth = (currentMonth + 1) % 12;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    // 날짜 선택 시 실행
    const handleDateSelect = (date) => {
      setTempDateTime({ date, time: "" });
      setShowCalendar(false); // 달력 숨기기
    };

    // 선택된 날짜 클릭 시 다시 달력 표시
    const handleDateClick = () => {
      setShowCalendar(true);
    };


  return (
    <div className="w-full p-4 flex flex-col items-center overflow-y-scroll">
      {/* 날짜 선택된 상태 */}
      {!showCalendar && tempDateTime.date && (
        <div className="mb-4">
          <button onClick={() => setShowCalendar(true)} className="text-lg font-semibold underline text-blue-500">
            {tempDateTime.date} 📅
          </button>
        </div>
      )}

      {/* 달력 표시 */}
        {showCalendar && (
        <div className="grid grid-rows-2 gap-4 w-full">
          <Calendar month={currentMonth} year={currentYear} availableDates={availableDates} onSelect={handleDateSelect} />
          <Calendar month={nextMonth} year={nextYear} availableDates={availableDates} onSelect={handleDateSelect} />
      </div>
      )}
      
      {/* 시간 선택 (달력이 숨겨져 있을 때만 표시) */}
      {!showCalendar && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Available Times on {tempDateTime.date}:</h3>
          <ul className="flex flex-col space-y-2">
            {tempDateTime.date ? (
              availableDates.find(({ date }) => date === tempDateTime.date)?.times.length > 0 ? (
                availableDates.find(({ date }) => date === tempDateTime.date)?.times.map((time) => (
                  <button
                    key={time}
                    onClick={() => onSelect({ date: tempDateTime.date, time })}
                    className="w-32 py-2 text-sm font-medium bg-gray-100 hover:bg-blue-500 hover:text-white transition"
                  >
                    {time}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 w-32 py-2 text-center bg-gray-100">No available slots</p>
              )
            ) : (
              <p className="text-gray-500 w-32 py-2 text-center bg-gray-100">Select a date first</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// 단순한 캘린더 컴포넌트 (날짜 선택 기능)
function Calendar({ month, year, availableDates, onSelect }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  return (
    <div className="border rounded p-2 min-h-270 bg-white shadow">
      <h4 className="text-lg font-semibold mb-2">{new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" })}</h4>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-bold">{day}</div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <div key={i}></div>)}
        {Array.from({ length: daysInMonth }).map((_, day) => {
          const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day + 1).padStart(2, "0")}`;
          const availableDate = availableDates.find((d) => d.date === date);
          const isUnavailable = !availableDate || availableDate.times.length === 0;

          return (
            <button
              key={date}
              className={`p-1 rounded ${isUnavailable ? "bg-gray-500 text-gray-300 line-through cursor-not-allowed" : "bg-white hover:bg-blue-300"}`}
              onClick={() => !isUnavailable && onSelect(date)}
            >
              {day + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}