
import React from 'react';
import { Check, Clock, UserX, UserRoundX } from 'lucide-react';
import { cn } from '@/lib/utils';

type Student = {
  id: number;
  name: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late' | 'leave' | null;
};

interface StudentGridProps {
  students: Student[];
  onStatusChange: (studentId: number, status: 'present' | 'absent' | 'late' | 'leave') => void;
}

export const StudentGrid = ({ students, onStatusChange }: StudentGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {students.map((student) => (
        <div
          key={student.id}
          className={cn(
            "p-4 rounded-lg border transition-all hover:shadow-md",
            student.status === "present" && "border-green-200 bg-green-50",
            student.status === "absent" && "border-red-200 bg-red-50",
            student.status === "late" && "border-amber-200 bg-amber-50",
            student.status === "leave" && "border-purple-200 bg-purple-50",
            !student.status && "border-gray-200"
          )}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 font-semibold">{student.name}</div>
            <div className="text-sm text-gray-500 mb-4">Roll # {student.rollNumber}</div>
            
            <div className="grid grid-cols-4 gap-2 w-full">
              <button
                className={cn(
                  "p-2 rounded transition-colors flex items-center justify-center",
                  student.status === "present"
                    ? "bg-green-500 text-white"
                    : "bg-green-100 text-green-600 hover:bg-green-200"
                )}
                onClick={() => onStatusChange(student.id, "present")}
                title="Mark as Present"
              >
                <Check size={16} />
              </button>
              
              <button
                className={cn(
                  "p-2 rounded transition-colors flex items-center justify-center",
                  student.status === "absent"
                    ? "bg-red-500 text-white"
                    : "bg-red-100 text-red-600 hover:bg-red-200"
                )}
                onClick={() => onStatusChange(student.id, "absent")}
                title="Mark as Absent"
              >
                <UserX size={16} />
              </button>
              
              <button
                className={cn(
                  "p-2 rounded transition-colors flex items-center justify-center",
                  student.status === "late"
                    ? "bg-amber-500 text-white"
                    : "bg-amber-100 text-amber-600 hover:bg-amber-200"
                )}
                onClick={() => onStatusChange(student.id, "late")}
                title="Mark as Late"
              >
                <Clock size={16} />
              </button>
              
              <button
                className={cn(
                  "p-2 rounded transition-colors flex items-center justify-center",
                  student.status === "leave"
                    ? "bg-purple-500 text-white"
                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                )}
                onClick={() => onStatusChange(student.id, "leave")}
                title="Mark as Leave"
              >
                <UserRoundX size={16} />
              </button>
            </div>
            
            <div className="mt-3 w-full text-sm text-center">
              <span
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full inline-flex items-center justify-center",
                  student.status === "present" && "bg-green-100 text-attendance-present",
                  student.status === "absent" && "bg-red-100 text-attendance-absent",
                  student.status === "late" && "bg-amber-100 text-attendance-late",
                  student.status === "leave" && "bg-purple-100 text-attendance-leave",
                  !student.status && "bg-gray-100 text-gray-500"
                )}
              >
                {student.status ? (
                  student.status.charAt(0).toUpperCase() + student.status.slice(1)
                ) : (
                  "Not Marked"
                )}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
