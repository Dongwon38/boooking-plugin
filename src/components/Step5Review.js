// Step5Review.js

export default function Step5Review({ selectedProgram, selectedTechnician, selectedDateTime, customerInfo, onConfirm }) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Review your Booking</h2>
            <div className="mb-4">
                <h3 className="font-semibold">Program</h3>
                <p>{selectedProgram?.name} {selectedProgram?.price}</p>
            </div>
            <div className="mb-4">
                <h3 className="font-semibold">Technician</h3>
                <p>{selectedTechnician.title.rendered}</p>
            </div>
            <div className="mb-4">
                <h3 className="font-semibold">Date & Time</h3>
                <p>{selectedDateTime?.date}</p>
                <p>{selectedDateTime?.time}</p>
            </div>
            <div className="mb-4">
                <h3 className="font-semibold">Customer Info</h3>
                <p>Name: {customerInfo.name}</p>
                <p>Phone: {customerInfo.phone}</p>
                <p>Email: {customerInfo.email}</p>
            </div>
            {/* 예약 확정 버튼 */}
            {/* <button onClick={onConfirm} className="bg-green-500 text-white px-4 py-2 rounded mt-4">Confirm Booking</button> */}
        </div>
    );
}
