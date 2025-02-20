// Step1ProgramSelection.js

import { useState } from "react";
import useFetch from "../hooks/useFetch";

export default function Step1ProgramSelection({ onSelect }) {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { data: programs, loading: programsLoading } = useFetch("program");
  const groupedPrograms = {};

  // 프로그램을 그룹별로 정리
  if (!programsLoading && programs) {
    programs.forEach((program) => {
      const groupName = program.acf.program_group || "Others";
      if (!groupedPrograms[groupName]) {
        groupedPrograms[groupName] = [];
      }
      groupedPrograms[groupName].push({
        id: program.id,
        name: program.title.rendered,
        price: `$${program.acf.program_price}`,
        duration: program.acf.program_duration,
        description: program.acf.program_description,
      });
    });
  }

  if (programsLoading) return <p>Loading...</p>;

  if (!programsLoading) return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Select Program</h3>

      {/* 프로그램 그룹 선택 */}
      <div className="space-y-2">
        {Object.keys(groupedPrograms).map((groupName) => (
          <div key={groupName} className="border p-3 rounded cursor-pointer">
            {/* 그룹명 클릭 시 세부 프로그램 표시 */}
            <p
              className="font-semibold text-blue-600"
              onClick={() =>
                setSelectedGroup(selectedGroup === groupName ? null : groupName)
              }
            >
              {groupName}
            </p>

            {/* 선택된 그룹의 세부 프로그램만 표시 */}
            {selectedGroup === groupName && (
              <div className="mt-2 space-y-2">
                {groupedPrograms[groupName].map((program) => (
                  <button
                    key={program.id}
                    onClick={() => onSelect(program)}
                    className="w-full p-3 border rounded bg-gray-100 hover:bg-gray-200"
                  >
                    <div className="flex justify-between">
                      <p className="font-semibold">{program.name}</p>
                      <p className="text-gray-600">{program.price}</p>
                    </div>
                    <p className="text-sm text-gray-500">{program.duration}</p>
                    <p className="text-xs text-gray-400">{program.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}