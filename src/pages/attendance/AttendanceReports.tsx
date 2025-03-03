
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Download, FileText, FileSpreadsheet, AlertTriangle, User,
  Calendar, ChevronDown, ArrowDownToLine, ArrowRight, Filter,
  RefreshCw, X, CalendarDays, BarChart3, Clock, TrendingUp,
  BookOpen, Landmark, School, Map, Users, PieChart as PieChartIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Popover, PopoverContent, PopoverTrigger 
} from '@/components/ui/popover';
import { format, isToday, addDays, subDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const classAttendanceData = [
  { name: 'Class 1', present: 42, absent: 5, late: 3 },
  { name: 'Class 2', present: 38, absent: 8, late: 4 },
  { name: 'Class 3', present: 35, absent: 11, late: 4 },
  { name: 'Class 4', present: 40, absent: 6, late: 4 },
  { name: 'Class 5', present: 43, absent: 4, late: 3 },
  { name: 'Class 6', present: 36, absent: 10, late: 4 }
];

const monthlyTrendData = [
  { name: 'Jan', attendance: 92 },
  { name: 'Feb', attendance: 94 },
  { name: 'Mar', attendance: 91 },
  { name: 'Apr', attendance: 89 },
  { name: 'May', attendance: 85 },
  { name: 'Jun', attendance: 88 },
  { name: 'Jul', attendance: 90 },
  { name: 'Aug', attendance: 93 },
  { name: 'Sep', attendance: 92 }
];

const attendanceDistributionData = [
  { name: 'Present', value: 85 },
  { name: 'Absent', value: 10 },
  { name: 'Late', value: 5 }
];

const frequentlyAbsentStudents = [
  { id: 1, name: 'John Smith', rollNumber: 'R-1023', absences: 8, class: 'Class 3' },
  { id: 2, name: 'Emily Johnson', rollNumber: 'R-1045', absences: 7, class: 'Class 2' },
  { id: 3, name: 'Michael Brown', rollNumber: 'R-1067', absences: 6, class: 'Class 4' },
  { id: 4, name: 'Sarah Davis', rollNumber: 'R-1089', absences: 6, class: 'Class 1' },
  { id: 5, name: 'David Wilson', rollNumber: 'R-1112', absences: 5, class: 'Class 5' }
];

// Indian holidays for academic calendar reference
const indianHolidays = [
  { date: '2024-01-26', name: 'Republic Day' },
  { date: '2024-03-25', name: 'Holi' },
  { date: '2024-08-15', name: 'Independence Day' },
  { date: '2024-10-02', name: 'Gandhi Jayanti' },
  { date: '2024-10-12', name: 'Dussehra' },
  { date: '2024-11-01', name: 'Diwali' },
  { date: '2024-12-25', name: 'Christmas' }
];

// Section-wise attendance data for detailed analysis
const sectionWiseData = [
  { section: 'Class 1-A', present: 28, absent: 2, total: 30, percentage: 93.3 },
  { section: 'Class 1-B', present: 26, absent: 4, total: 30, percentage: 86.7 },
  { section: 'Class 2-A', present: 29, absent: 1, total: 30, percentage: 96.7 },
  { section: 'Class 2-B', present: 25, absent: 5, total: 30, percentage: 83.3 }
];

// Attendance data by gender (for diversity reporting)
const genderWiseData = [
  { gender: 'Male', present: 165, absent: 15, total: 180, percentage: 91.7 },
  { gender: 'Female', present: 155, absent: 10, total: 165, percentage: 93.9 }
];

// Transport-wise attendance data
const transportWiseData = [
  { mode: 'School Bus', present: 120, absent: 10, total: 130, percentage: 92.3 },
  { mode: 'Private Vehicle', present: 80, absent: 5, total: 85, percentage: 94.1 },
  { mode: 'Public Transport', present: 70, absent: 8, total: 78, percentage: 89.7 },
  { mode: 'Walk/Bicycle', present: 50, absent: 2, total: 52, percentage: 96.2 }
];

const COLORS = ['#222222', '#666666', '#999999', '#cccccc'];

export const AttendanceReports = () => {
  const [reportType, setReportType] = useState('class');
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [selectedClass, setSelectedClass] = useState('');
  const [reportScope, setReportScope] = useState('students'); // 'students' or 'staff'
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [activeFilters, setActiveFilters] = useState(false);
  const [selectedClassData, setSelectedClassData] = useState(null);
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard', 'today', 'analysis', 'comparison'
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedDateData, setSelectedDateData] = useState(null);

  // Set today's date by default when component mounts
  useEffect(() => {
    setStartDate(new Date());
    setEndDate(new Date());
  }, []);

  const handleGenerateReport = (format: 'pdf' | 'excel' | 'csv') => {
    setIsGeneratingReport(true);
    
    setTimeout(() => {
      const reportName = reportScope === 'students' ? 'student_attendance' : 'staff_attendance';
      const fileName = `${reportName}_report_${format}_${Date.now()}`;
      
      if (format === 'pdf' || format === 'excel' || format === 'csv') {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Sample attendance report content'));
        element.setAttribute('download', `${fileName}.${format}`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
      
      toast.success(`${format.toUpperCase()} report generated and downloaded successfully`);
      setIsGeneratingReport(false);
    }, 1500);
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const resetFilters = () => {
    setReportType('class');
    setSelectedClass('');
    setStartDate(new Date());
    setEndDate(new Date());
    setActiveFilters(false);
    toast.success("Filters have been reset");
  };

  const showClassDetails = (className: string) => {
    toast.info(`Loading detailed report for ${className}`);
    
    const mockClassData = classAttendanceData.find(c => c.name === className) || null;
    setSelectedClassData(mockClassData);
  };

  const showTodayAttendance = () => {
    setViewMode('today');
    setStartDate(new Date());
    toast.info("Loading today's attendance data");
    
    // Simulate loading today's data
    setTimeout(() => {
      setSelectedDateData({
        date: new Date(),
        presentPercent: 92,
        absentPercent: 5,
        latePercent: 3,
        classSummary: classAttendanceData
      });
    }, 500);
  };

  const setDefaultDate = (days: number) => {
    const newDate = days < 0 ? subDays(new Date(), Math.abs(days)) : addDays(new Date(), days);
    setStartDate(newDate);
    
    if (viewMode === 'today') {
      // Simulate loading data for the selected date
      setTimeout(() => {
        const randomPresent = 85 + Math.floor(Math.random() * 10);
        setSelectedDateData({
          date: newDate,
          presentPercent: randomPresent,
          absentPercent: Math.floor((100 - randomPresent) * 0.6),
          latePercent: Math.floor((100 - randomPresent) * 0.4),
          classSummary: classAttendanceData.map(c => ({
            ...c,
            present: c.present - Math.floor(Math.random() * 3),
            absent: c.absent + Math.floor(Math.random() * 2)
          }))
        });
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Attendance Analytics</h2>
        
        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={setViewMode} className="mr-2">
            <TabsList>
              <TabsTrigger value="dashboard" className="text-xs sm:text-sm">
                <BarChart3 className="h-4 w-4 mr-1 hidden sm:inline" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="today" className="text-xs sm:text-sm" onClick={showTodayAttendance}>
                <CalendarDays className="h-4 w-4 mr-1 hidden sm:inline" />
                Today
              </TabsTrigger>
              <TabsTrigger value="analysis" className="text-xs sm:text-sm">
                <TrendingUp className="h-4 w-4 mr-1 hidden sm:inline" />
                Analysis
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select 
            value={reportScope} 
            onValueChange={setReportScope}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report Scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="students">Student Reports</SelectItem>
              <SelectItem value="staff">Staff Reports</SelectItem>
            </SelectContent>
          </Select>
          
          {activeFilters && (
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={resetFilters}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset filters</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      
      {viewMode === 'today' && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                Attendance for {startDate ? format(startDate, "dd MMMM yyyy") : "Today"}
              </h3>
              <p className="text-sm text-gray-500">
                {isToday(startDate) ? "Today's" : "Selected date"} summary report
              </p>
            </div>
            
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDefaultDate(-1)}
              >
                Previous Day
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-1" onClick={handleIconClick} />
                    Select Date
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDefaultDate(1)}
                disabled={isToday(startDate)}
              >
                Next Day
              </Button>
            </div>
          </div>
          
          {selectedDateData && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                  <div className="text-sm text-green-700 mb-1">Present</div>
                  <div className="text-3xl font-bold text-green-700">{selectedDateData.presentPercent}%</div>
                  <div className="text-xs text-gray-500 mt-1">School average</div>
                </div>
                
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                  <div className="text-sm text-red-700 mb-1">Absent</div>
                  <div className="text-3xl font-bold text-red-700">{selectedDateData.absentPercent}%</div>
                  <div className="text-xs text-gray-500 mt-1">School average</div>
                </div>
                
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="text-sm text-amber-700 mb-1">Late</div>
                  <div className="text-3xl font-bold text-amber-700">{selectedDateData.latePercent}%</div>
                  <div className="text-xs text-gray-500 mt-1">School average</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="text-md font-medium mb-3">Class-wise Breakdown</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Present
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Absent
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Late
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedDateData.classSummary.map((cls, index) => {
                        const total = cls.present + cls.absent + cls.late;
                        const percentage = ((cls.present / total) * 100).toFixed(1);
                        
                        return (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {cls.name}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-green-700">
                              {cls.present}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-red-700">
                              {cls.absent}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-amber-700">
                              {cls.late}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-center">
                              <Badge className={
                                Number(percentage) > 90 ? "bg-green-100 text-green-800" :
                                Number(percentage) > 80 ? "bg-amber-100 text-amber-800" :
                                "bg-red-100 text-red-800"
                              }>
                                {percentage}%
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => handleGenerateReport('pdf')}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Generate Daily Report
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {viewMode === 'analysis' && (
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Detailed Attendance Analysis</CardTitle>
              <CardDescription>Comprehensive breakdown of attendance patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="section" className="w-full">
                <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
                  <TabsTrigger value="section">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">Section</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="gender">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="hidden sm:inline">Gender</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="transport">
                    <div className="flex items-center gap-1">
                      <School className="h-4 w-4" />
                      <span className="hidden sm:inline">Transport</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="calendar">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span className="hidden sm:inline">Calendar</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="section">
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Attendance breakdown by class sections:</div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={sectionWiseData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="section" tick={{ fill: '#666' }} />
                            <YAxis tick={{ fill: '#666' }} />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              dataKey="present" 
                              fill="#22c55e" 
                              name="Present" 
                            />
                            <Bar 
                              dataKey="absent" 
                              fill="#ef4444" 
                              name="Absent" 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Section
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Present
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Absent
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Percentage
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {sectionWiseData.map((section, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {section.section}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-green-700">
                                  {section.present}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-red-700">
                                  {section.absent}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                  <Badge className={
                                    section.percentage > 90 ? "bg-green-100 text-green-800" :
                                    section.percentage > 80 ? "bg-amber-100 text-amber-800" :
                                    "bg-red-100 text-red-800"
                                  }>
                                    {section.percentage}%
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="gender">
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Gender-wise attendance breakdown:</div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={genderWiseData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="gender" tick={{ fill: '#666' }} />
                            <YAxis tick={{ fill: '#666' }} />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              dataKey="present" 
                              fill="#22c55e" 
                              name="Present" 
                            />
                            <Bar 
                              dataKey="absent" 
                              fill="#ef4444" 
                              name="Absent" 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gender
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Present
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Absent
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Percentage
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {genderWiseData.map((gender, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {gender.gender}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-green-700">
                                  {gender.present}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-red-700">
                                  {gender.absent}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                  <Badge className={
                                    gender.percentage > 90 ? "bg-green-100 text-green-800" :
                                    gender.percentage > 80 ? "bg-amber-100 text-amber-800" :
                                    "bg-red-100 text-red-800"
                                  }>
                                    {gender.percentage}%
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="transport">
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Transport mode attendance breakdown:</div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={transportWiseData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="mode" tick={{ fill: '#666' }} />
                            <YAxis tick={{ fill: '#666' }} />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              dataKey="present" 
                              fill="#22c55e" 
                              name="Present" 
                            />
                            <Bar 
                              dataKey="absent" 
                              fill="#ef4444" 
                              name="Absent" 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Transport Mode
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Present
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Absent
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Percentage
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {transportWiseData.map((transport, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {transport.mode}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-green-700">
                                  {transport.present}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-red-700">
                                  {transport.absent}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                  <Badge className={
                                    transport.percentage > 90 ? "bg-green-100 text-green-800" :
                                    transport.percentage > 80 ? "bg-amber-100 text-amber-800" :
                                    "bg-red-100 text-red-800"
                                  }>
                                    {transport.percentage}%
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="calendar">
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Academic calendar with holidays and attendance trends:</div>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-md font-medium mb-3">Indian Academic Calendar Holidays</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Holiday
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {indianHolidays.map((holiday, index) => {
                                const holidayDate = new Date(holiday.date);
                                const isPast = holidayDate < new Date();
                                
                                return (
                                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {holiday.name}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                      {format(holidayDate, "dd MMMM yyyy")}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                      <Badge variant={isPast ? "outline" : "secondary"}>
                                        {isPast ? "Past" : "Upcoming"}
                                      </Badge>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          onClick={() => handleGenerateReport('pdf')}
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Generate Academic Calendar
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
      
      {viewMode === 'dashboard' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white text-gray-900 shadow-sm hover:shadow transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  {reportScope === 'students' ? 'Present Rate' : 'Staff Present Rate'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">85%</div>
                <p className="text-sm text-gray-500">School-wide average</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white text-gray-900 shadow-sm hover:shadow transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  {reportScope === 'students' ? 'Absence Rate' : 'Staff Absence Rate'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">10%</div>
                <p className="text-sm text-gray-500">School-wide average</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white text-gray-900 shadow-sm hover:shadow transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  {reportScope === 'students' ? 'Late Arrivals' : 'Staff Late Arrivals'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5%</div>
                <p className="text-sm text-gray-500">School-wide average</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2 shadow-sm hover:shadow transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {reportScope === 'students' ? 'Class Attendance Overview' : 'Department Attendance Overview'}
                    </CardTitle>
                    <CardDescription>
                      {reportScope === 'students' 
                        ? 'Comparison of attendance across all classes' 
                        : 'Comparison of attendance across all departments'}
                    </CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8"
                            onClick={() => setActiveFilters(!activeFilters)}
                          >
                            <Filter className="h-4 w-4 mr-1" /> 
                            <span className="hidden sm:inline">Filter</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Filter data</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Download className="h-4 w-4 mr-1" /> 
                          <span className="hidden sm:inline">Export</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleGenerateReport('pdf')}
                        >
                          <FileText className="h-4 w-4 mr-2" /> Export as PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleGenerateReport('excel')}
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-2" /> Export as Excel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={classAttendanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#666' }}
                        onClick={(event) => {
                          const target = event.target as SVGElement;
                          if (target && target.textContent) {
                            showClassDetails(target.textContent);
                          }
                        }}
                        className="cursor-pointer"
                      />
                      <YAxis tick={{ fill: '#666' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="present" 
                        stackId="a" 
                        fill="#22c55e" 
                        name="Present" 
                        cursor="pointer"
                        onClick={(data) => showClassDetails(data.name)}
                      />
                      <Bar 
                        dataKey="absent" 
                        stackId="a" 
                        fill="#ef4444" 
                        name="Absent" 
                        cursor="pointer"
                        onClick={(data) => showClassDetails(data.name)}
                      />
                      <Bar 
                        dataKey="late" 
                        stackId="a" 
                        fill="#f59e0b" 
                        name="Late" 
                        cursor="pointer"
                        onClick={(data) => showClassDetails(data.name)}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {selectedClassData && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-lg">{selectedClassData.name} Detailed Report</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedClassData(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <div className="text-sm text-gray-500">Present</div>
                        <div className="text-2xl font-bold text-green-600">{selectedClassData.present}</div>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <div className="text-sm text-gray-500">Absent</div>
                        <div className="text-2xl font-bold text-red-600">{selectedClassData.absent}</div>
                      </div>
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <div className="text-sm text-gray-500">Late</div>
                        <div className="text-2xl font-bold text-amber-600">{selectedClassData.late}</div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGenerateReport('pdf')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export Class Report
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Monthly Attendance Trend</CardTitle>
                    <CardDescription>Overall attendance percentage over time</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8"
                    onClick={() => handleGenerateReport('pdf')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyTrendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="name" tick={{ fill: '#666' }} />
                      <YAxis domain={[80, 100]} tick={{ fill: '#666' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="attendance" 
                        stroke="#222222" 
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#222222' }}
                        activeDot={{ r: 6, fill: '#222222' }}
                        name="Attendance %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm hover:shadow transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Attendance Distribution</CardTitle>
                    <CardDescription>
                      {reportScope === 'students' 
                        ? 'School-wide attendance status breakdown' 
                        : 'Staff attendance status breakdown'}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8"
                    onClick={() => handleGenerateReport('pdf')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {attendanceDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#22c55e" : index === 1 ? "#ef4444" : "#f59e0b"} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="shadow-sm hover:shadow transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <CardTitle>
                      {reportScope === 'students' 
                        ? 'Frequently Absent Students' 
                        : 'Frequently Absent Staff'
                      }
                    </CardTitle>
                    <CardDescription>
                      {reportScope === 'students'
                        ? 'Students with the highest absence rates this term'
                        : 'Staff members with the highest absence rates this term'
                      }
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                  onClick={() => handleGenerateReport('excel')}
                >
                  <Download className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {reportScope === 'students' ? 'Student' : 'Staff Member'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {reportScope === 'students' ? 'Roll #' : 'ID'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {reportScope === 'students' ? 'Class' : 'Department'}
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Absences
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {frequentlyAbsentStudents.map((person) => (
                      <tr key={person.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">{person.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {person.rollNumber}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {person.class}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            {person.absences} days
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                          <div className="flex justify-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-xs"
                              onClick={() => toast.info(`Notification sent to ${reportScope === 'students' ? `${person.name}'s parents` : person.name}`)}
                            >
                              Send Alert
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-xs"
                              onClick={() => toast.info(`Generating attendance report for ${person.name}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow transition-shadow">
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription>Download attendance reports in various formats</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="daily" className="w-full">
                <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                
                <TabsContent value="daily" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-scope-daily">Report Scope</Label>
                      <Select value={reportScope} onValueChange={setReportScope}>
                        <SelectTrigger id="report-scope-daily">
                          <SelectValue placeholder="Select Report Scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="students">Students Attendance</SelectItem>
                          <SelectItem value="staff">Staff Attendance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="report-type">Report Type</Label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger id="report-type">
                          <SelectValue placeholder="Select Report Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="class">Class Attendance</SelectItem>
                          <SelectItem value="individual">Individual Student</SelectItem>
                          {reportScope === 'staff' && (
                            <SelectItem value="department">Department</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {reportType === 'class' && reportScope === 'students' && (
                      <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                          <SelectTrigger id="class">
                            <SelectValue placeholder="Select Class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="class1">Class 1</SelectItem>
                            <SelectItem value="class2">Class 2</SelectItem>
                            <SelectItem value="class3">Class 3</SelectItem>
                            <SelectItem value="class4">Class 4</SelectItem>
                            <SelectItem value="class5">Class 5</SelectItem>
                            <SelectItem value="class6">Class 6</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {reportType === 'department' && reportScope === 'staff' && (
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                          <SelectTrigger id="department">
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dept1">English</SelectItem>
                            <SelectItem value="dept2">Mathematics</SelectItem>
                            <SelectItem value="dept3">Science</SelectItem>
                            <SelectItem value="dept4">Social Studies</SelectItem>
                            <SelectItem value="dept5">Physical Education</SelectItem>
                            <SelectItem value="dept6">Administration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label>Date</Label>
                      <div className="flex items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <Calendar className="mr-2 h-4 w-4" onClick={handleIconClick} />
                              {startDate ? format(startDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => handleGenerateReport('pdf')}
                      disabled={isGeneratingReport}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Export as PDF</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleGenerateReport('excel')}
                      disabled={isGeneratingReport}
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Export as Excel</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleGenerateReport('csv')}
                      disabled={isGeneratingReport}
                    >
                      <ArrowDownToLine className="h-4 w-4" />
                      <span>Export as CSV</span>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="weekly" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-scope-weekly">Report Scope</Label>
                      <Select value={reportScope} onValueChange={setReportScope}>
                        <SelectTrigger id="report-scope-weekly">
                          <SelectValue placeholder="Select Report Scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="students">Students Attendance</SelectItem>
                          <SelectItem value="staff">Staff Attendance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="report-type-weekly">Report Type</Label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger id="report-type-weekly">
                          <SelectValue placeholder="Select Report Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="class">Class Attendance</SelectItem>
                          <SelectItem value="individual">Individual Student</SelectItem>
                          {reportScope === 'staff' && (
                            <SelectItem value="department">Department</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {reportType === 'class' && reportScope === 'students' && (
                      <div className="space-y-2">
                        <Label htmlFor="class-weekly">Class</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                          <SelectTrigger id="class-weekly">
                            <SelectValue placeholder="Select Class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="class1">Class 1</SelectItem>
                            <SelectItem value="class2">Class 2</SelectItem>
                            <SelectItem value="class3">Class 3</SelectItem>
                            <SelectItem value="class4">Class 4</SelectItem>
                            <SelectItem value="class5">Class 5</SelectItem>
                            <SelectItem value="class6">Class 6</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {reportType === 'department' && reportScope === 'staff' && (
                      <div className="space-y-2">
                        <Label htmlFor="department-weekly">Department</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                          <SelectTrigger id="department-weekly">
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dept1">English</SelectItem>
                            <SelectItem value="dept2">Mathematics</SelectItem>
                            <SelectItem value="dept3">Science</SelectItem>
                            <SelectItem value="dept4">Social Studies</SelectItem>
                            <SelectItem value="dept5">Physical Education</SelectItem>
                            <SelectItem value="dept6">Administration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label>Date Range</Label>
                      <div className="flex items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-[180px] justify-start text-left font-normal"
                            >
                              <Calendar className="mr-2 h-4 w-4" onClick={handleIconClick} />
                              {startDate ? format(startDate, "MMM d, yyyy") : "Start date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-[180px] justify-start text-left font-normal"
                            >
                              <Calendar className="mr-2 h-4 w-4" onClick={handleIconClick} />
                              {endDate ? format(endDate, "MMM d, yyyy") : "End date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => handleGenerateReport('pdf')}
                      disabled={isGeneratingReport}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Export as PDF</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleGenerateReport('excel')}
                      disabled={isGeneratingReport}
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Export as Excel</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleGenerateReport('csv')}
                      disabled={isGeneratingReport}
                    >
                      <ArrowDownToLine className="h-4 w-4" />
                      <span>Export as CSV</span>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="monthly" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-scope-monthly">Report Scope</Label>
                      <Select value={reportScope} onValueChange={setReportScope}>
                        <SelectTrigger id="report-scope-monthly">
                          <SelectValue placeholder="Select Report Scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="students">Students Attendance</SelectItem>
                          <SelectItem value="staff">Staff Attendance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="month">Month</Label>
                      <Select defaultValue="current">
                        <SelectTrigger id="month">
                          <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="current">Current Month</SelectItem>
                          <SelectItem value="january">January</SelectItem>
                          <SelectItem value="february">February</SelectItem>
                          <SelectItem value="march">March</SelectItem>
                          <SelectItem value="april">April</SelectItem>
                          <SelectItem value="may">May</SelectItem>
                          <SelectItem value="june">June</SelectItem>
                          <SelectItem value="july">July</SelectItem>
                          <SelectItem value="august">August</SelectItem>
                          <SelectItem value="september">September</SelectItem>
                          <SelectItem value="october">October</SelectItem>
                          <SelectItem value="november">November</SelectItem>
                          <SelectItem value="december">December</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Select defaultValue="current">
                        <SelectTrigger id="year">
                          <SelectValue placeholder="Select Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="current">Current Year</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                          <SelectItem value="2021">2021</SelectItem>
                          <SelectItem value="2020">2020</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {reportScope === 'students' && (
                      <div className="space-y-2">
                        <Label htmlFor="class-monthly">Class</Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                          <SelectTrigger id="class-monthly">
                            <SelectValue placeholder="Select Class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Classes</SelectItem>
                            <SelectItem value="class1">Class 1</SelectItem>
                            <SelectItem value="class2">Class 2</SelectItem>
                            <SelectItem value="class3">Class 3</SelectItem>
                            <SelectItem value="class4">Class 4</SelectItem>
                            <SelectItem value="class5">Class 5</SelectItem>
                            <SelectItem value="class6">Class 6</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {reportScope === 'staff' && (
                      <div className="space-y-2">
                        <Label htmlFor="department-monthly">Department</Label>
                        <Select>
                          <SelectTrigger id="department-monthly">
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Departments</SelectItem>
                            <SelectItem value="dept1">English</SelectItem>
                            <SelectItem value="dept2">Mathematics</SelectItem>
                            <SelectItem value="dept3">Science</SelectItem>
                            <SelectItem value="dept4">Social Studies</SelectItem>
                            <SelectItem value="dept5">Physical Education</SelectItem>
                            <SelectItem value="dept6">Administration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button 
                      className="flex items-center gap-2"
                      onClick={() => handleGenerateReport('pdf')}
                      disabled={isGeneratingReport}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Export as PDF</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleGenerateReport('excel')}
                      disabled={isGeneratingReport}
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Export as Excel</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleGenerateReport('csv')}
                      disabled={isGeneratingReport}
                    >
                      <ArrowDownToLine className="h-4 w-4" />
                      <span>Export as CSV</span>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
