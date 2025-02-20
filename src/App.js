import React, { useState } from "react";
import BookingModal from "./components/BookingModal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

  return (
  <>
    <h1 className="text-2xl font-bold text-center mt-8">Book a Service</h1>
    <button 
      onClick={() => setIsModalOpen(true)} 
      className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
    >
      Book Now
    </button>
    {/* 모달 창 표시 (isModalOpen이 true일 때만 렌더링됨) */}
    <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
  </>
  );
}
export default App;


// 데이터베이스 설계 가이드
// 현재 데이터를 하드코딩해서 사용하고 있지만, 궁극적으로 워드프레스에서 데이터를 관리할 수 있도록 설계하려면 데이터베이스를 활용하는 것이 필요해.

// 1. 워드프레스 기본 데이터베이스 (wp_posts, wp_postmeta 활용)
// 워드프레스의 기본 데이터베이스를 사용하면 별도의 MySQL 테이블을 만들지 않고도 플러그인 개발 가능.
// wp_posts 테이블을 활용하여 "Program", "Technician"을 커스텀 포스트 타입으로 저장.
// wp_postmeta 테이블을 사용하여 근무 요일, 예약 가능한 시간 등의 정보를 메타데이터로 저장.
// 예제: wp_postmeta 활용 (PHP 코드)
// php
// // 스태프의 근무일과 가능 시간 저장
// update_post_meta($technician_id, 'work_days', json_encode(["Monday", "Wednesday", "Friday"]));
// update_post_meta($technician_id, 'available_times', json_encode(["10:00 AM", "2:00 PM", "4:00 PM"]));

// // 불러오기
// $work_days = json_decode(get_post_meta($technician_id, 'work_days', true), true);
// $available_times = json_decode(get_post_meta($technician_id, 'available_times', true), true);
// 이런 방식으로 워드프레스 관리자가 wp-admin에서 스태프 정보(근무 요일, 시간)를 쉽게 수정할 수 있도록 할 수 있음.
