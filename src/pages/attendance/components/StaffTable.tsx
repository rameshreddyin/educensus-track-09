
import React from 'react';
import { Check, Clock, UserX, UserRoundX, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type Staff = {
  id: number;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  status: 'present' | 'absent' | 'late' | 'leave' | null;
};

interface StaffTableProps {
  staff: Staff[];
  onStatusChange: (staffId: number, status: 'present' | 'absent' | 'late' | 'leave') => void;
  onRemoveStatus: (staffId: number) => void;
}

export const StaffTable = ({ staff, onStatusChange, onRemoveStatus }: StaffTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Designation
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
          {staff.map((member) => (
            <tr key={member.id} className="transition-colors hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {member.employeeId}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {member.name}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {member.designation}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                <span
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full inline-flex items-center justify-center gap-1",
                    member.status === "present" && "bg-green-100 text-attendance-present",
                    member.status === "absent" && "bg-red-100 text-attendance-absent",
                    member.status === "late" && "bg-amber-100 text-attendance-late",
                    member.status === "leave" && "bg-purple-100 text-attendance-leave",
                    !member.status && "bg-gray-100 text-gray-500"
                  )}
                >
                  {member.status === "present" && (
                    <>
                      <Check size={12} />
                      <span>Present</span>
                    </>
                  )}
                  {member.status === "absent" && (
                    <>
                      <UserX size={12} />
                      <span>Absent</span>
                    </>
                  )}
                  {member.status === "late" && (
                    <>
                      <Clock size={12} />
                      <span>Late</span>
                    </>
                  )}
                  {member.status === "leave" && (
                    <>
                      <UserRoundX size={12} />
                      <span>Leave</span>
                    </>
                  )}
                  {!member.status && <span>Not Marked</span>}
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
                            member.status === "present"
                              ? "bg-green-500 text-white"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          )}
                          onClick={() => onStatusChange(member.id, "present")}
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
                            member.status === "absent"
                              ? "bg-red-500 text-white"
                              : "bg-red-100 text-red-600 hover:bg-red-200"
                          )}
                          onClick={() => onStatusChange(member.id, "absent")}
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
                            member.status === "late"
                              ? "bg-amber-500 text-white"
                              : "bg-amber-100 text-amber-600 hover:bg-amber-200"
                          )}
                          onClick={() => onStatusChange(member.id, "late")}
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
                            member.status === "leave"
                              ? "bg-purple-500 text-white"
                              : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                          )}
                          onClick={() => onStatusChange(member.id, "leave")}
                        >
                          <UserRoundX size={14} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as Leave</p>
                      </TooltipContent>
                    </Tooltip>

                    {member.status && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            onClick={() => onRemoveStatus(member.id)}
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
