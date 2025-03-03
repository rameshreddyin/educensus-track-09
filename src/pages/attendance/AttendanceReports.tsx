
import React, { useState, useCallback } from 'react';
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
  RefreshCw, X
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Popover, PopoverContent, PopoverTrigger 
} from '@/components/ui/popover';
import { format } from 'date-fns';
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

  // This is the correct way to handle the icon click
  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // This prevents the event from propagating up to the button
  };

  const resetFilters = () => {
    setReportType('class');
    setSelectedClass('');
    setStartDate(new Date());
    setEndDate(new Date());
    setActiveFilters(false);
    toast.success("Filters have been reset");
  };

  // Mock function to show class-specific data
  const showClassDetails = (className: string) => {
    // In a real application, this would fetch data for the specific class
    toast.info(`Loading detailed report for ${className}`);
    
    // For demo purposes, we'll just set some mock data
    const mockClassData = classAttendanceData.find(c => c.name === className) || null;
    setSelectedClassData(mockClassData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Attendance Analytics</h2>
        
        <div className="flex items-center gap-2">
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
      
      {/* Top Cards Row */}
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
      
      {/* Chart Section */}
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
                    onClick={(data) => data && showClassDetails(data.value)}
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                        onClick={() => toast.info(`Notification sent to ${reportScope === 'students' ? `${person.name}'s parents` : person.name}`)}
                      >
                        Send Alert
                      </Button>
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
    </div>
  );
};
