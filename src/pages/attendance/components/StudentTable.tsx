
import React from 'react';
import { Check, Clock, UserX, UserRoundX, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type Student = {
  id: number;
  name: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late' | 'leave' | null;
};

interface StudentTableProps {
  students: Student[];
  onStatusChange: (studentId: number, status: 'present' | 'absent' | 'late' | 'leave') => void;
  onRemoveStatus: (studentId: number) => void;
}

export const StudentTable = ({ students, onStatusChange, onRemoveStatus }: StudentTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Roll #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id} className="transition-colors hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {student.rollNumber}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {student.name}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full inline-flex items-center justify-center gap-1",
                    student.status === "present" && "bg-green-100 text-attendance-present",
                    student.status === "absent" && "bg-red-100 text-attendance-absent",
                    student.status === "late" && "bg-amber-100 text-attendance-late",
                    student.status === "leave" && "bg-purple-100 text-attendance-leave",
                    !student.status && "bg-gray-100 text-gray-500"
                  )}
                >
                  {student.status === "present" && (
                    <>
                      <Check size={12} />
                      <span>Present</span>
                    </>
                  )}
                  {student.status === "absent" && (
                    <>
                      <UserX size={12} />
                      <span>Absent</span>
                    </>
                  )}
                  {student.status === "late" && (
                    <>
                      <Clock size={12} />
                      <span>Late</span>
                    </>
                  )}
                  {student.status === "leave" && (
                    <>
                      <UserRoundX size={12} />
                      <span>Leave</span>
                    </>
                  )}
                  {!student.status && <span>Not Marked</span>}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-center">
                <TooltipProvider>
                  <div className="flex justify-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            "p-1.5 rounded-full transition-colors",
                            student.status === "present"
                              ? "bg-green-500 text-white"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          )}
                          onClick={() => onStatusChange(student.id, "present")}
                        >
                          <Check size={14} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as Present</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            "p-1.5 rounded-full transition-colors",
                            student.status === "absent"
                              ? "bg-red-500 text-white"
                              : "bg-red-100 text-red-600 hover:bg-red-200"
                          )}
                          onClick={() => onStatusChange(student.id, "absent")}
                        >
                          <UserX size={14} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as Absent</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            "p-1.5 rounded-full transition-colors",
                            student.status === "late"
                              ? "bg-amber-500 text-white"
                              : "bg-amber-100 text-amber-600 hover:bg-amber-200"
                          )}
                          onClick={() => onStatusChange(student.id, "late")}
                        >
                          <Clock size={14} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as Late</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            "p-1.5 rounded-full transition-colors",
                            student.status === "leave"
                              ? "bg-purple-500 text-white"
                              : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                          )}
                          onClick={() => onStatusChange(student.id, "leave")}
                        >
                          <UserRoundX size={14} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as Leave</p>
                      </TooltipContent>
                    </Tooltip>

                    {student.status && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            onClick={() => onRemoveStatus(student.id)}
                          >
                            <X size={14} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove Status</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TooltipProvider>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
