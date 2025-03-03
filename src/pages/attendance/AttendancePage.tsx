
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppLayout } from '@/components/layout/AppLayout';
import { MarkStudentAttendance } from './MarkStudentAttendance';
import { MarkStaffAttendance } from './MarkStaffAttendance';
import { AttendanceReports } from './AttendanceReports';

const AttendancePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(
    location.pathname.includes("/reports") ? "reports" : 
    location.pathname.includes("/staff") ? "staff" : "students"
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    switch (value) {
      case "students":
        navigate("/attendance");
        break;
      case "staff":
        navigate("/attendance/staff");
        break;
      case "reports":
        navigate("/attendance/reports");
        break;
    }
  };

  return (
    <AppLayout 
      title="Attendance Management" 
      subtitle="Track and manage attendance records for students and staff"
    >
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="students" className="text-sm">Student Attendance</TabsTrigger>
          <TabsTrigger value="staff" className="text-sm">Staff Attendance</TabsTrigger>
          <TabsTrigger value="reports" className="text-sm">Reports & Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="students" className="animate-fade-in">
          <MarkStudentAttendance />
        </TabsContent>
        <TabsContent value="staff" className="animate-fade-in">
          <MarkStaffAttendance />
        </TabsContent>
        <TabsContent value="reports" className="animate-fade-in">
          <AttendanceReports />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default AttendancePage;
