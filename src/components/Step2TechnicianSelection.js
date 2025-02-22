// Step2TechnicianSelection.js

import useFetch from "../hooks/useFetch";

export default function Step2TechnicianSelection({ tempTechnician, selectedProgram, onSelect }) {
  const { data: technicians, loading: techniciansLoading } = useFetch("technician");

  if (techniciansLoading) return <p>Loading...</p>;

  // 선택한 프로그램을 제공하는 테크니션만 필터링
  const filteredTechnicians = technicians?.filter(technician => 
    technician.acf.related_program?.some(program => program.ID === selectedProgram.id)
  );
  
  console.log("filteredTechnicians:", filteredTechnicians);

  return (
    <div>
      <h3 className="text-lg font-semibold">Select Technician</h3>
      <div className="grid grid-cols-2 gap-2">
        {filteredTechnicians.length > 0 ? (
          filteredTechnicians.map((technician) => (
            <div
            key={technician.id}
            className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all
              ${tempTechnician?.id === technician.id ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white hover:bg-gray-100"}
            `}
            onClick={() => onSelect(technician)}
            >
              {technician.featured_image_url && (
                <img
                  src={technician.featured_image_url}
                  alt={technician.title.rendered}
                  className="w-16 h-16 rounded-full mb-3 border"
                />
              )}
              <p className="text-base font-semibold">{technician.title.rendered}</p>
              <p className="text-sm text-gray-500">{technician.acf.position || "Position"}</p>
              <p className="text-xs text-gray-400 text-center">{technician.acf.comments || "No comments"}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-2">No available technicians for this program.</p>
        )}
      </div>
    </div>
  );
}
