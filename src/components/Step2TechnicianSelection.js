// Step2TechnicianSelection.js

import useFetch from "../hooks/useFetch";

export default function Step2TechnicianSelection({ selectedProgram, onSelect }) {
  const { data: technicians, loading: techniciansLoading } = useFetch("technician");

  if (!selectedProgram) {
      return <p className="text-red-500">Please select a program first.</p>;
  }

  if (techniciansLoading) return <p>Loading...</p>;

  // 선택한 프로그램을 제공하는 테크니션만 필터링
  const filteredTechnicians = technicians?.filter(technician => 
    technician.acf.related_program?.some(program => program.ID === selectedProgram.id)
  );

  return (
    <div>
      <h3 className="text-lg font-semibold">Select Technician</h3>
      <div className="grid grid-cols-2 gap-2">
        <button
          className="p-3 border rounded-lg text-center bg-gray-200"
          onClick={() => onSelect("Anyone")}
        >
          No Preference
        </button>
        {filteredTechnicians.length > 0 ? (
          filteredTechnicians.map((technician) => (
            <button 
              key={technician.id} 
              className="p-3 border rounded-lg text-center bg-gray-200"
              onClick={() => onSelect(technician)}
            >
              {technician.title.rendered}
            </button>
          ))
        ) : (
          <p className="text-gray-500 mt-2">No available technicians for this program.</p>
        )}
      </div>
    </div>
  );
}
