
import React, { useState } from 'react';
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
  Calendar, ChevronDown, ArrowDownToLine, ArrowRight, Filter
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

// Mock data for class attendance
const classAttendanceData = [
  { name: 'Class 1', present: 42, absent: 5, late: 3 },
  { name: 'Class 2', present: 38, absent: 8, late: 4 },
  { name: 'Class 3', present: 35, absent: 11, late: 4 },
  { name: 'Class 4', present: 40, absent: 6, late: 4 },
  { name: 'Class 5', present: 43, absent: 4, late: 3 },
  { name: 'Class 6', present: 36, absent: 10, late: 4 }
];

// Mock data for monthly attendance trend
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

// Mock data for attendance distribution
const attendanceDistributionData = [
  { name: 'Present', value: 85 },
  { name: 'Absent', value: 10 },
  { name: 'Late', value: 5 }
];

// Mock data for most absent students
const frequentlyAbsentStudents = [
  { id: 1, name: 'John Smith', rollNumber: 'R-1023', absences: 8, class: 'Class 3' },
  { id: 2, name: 'Emily Johnson', rollNumber: 'R-1045', absences: 7, class: 'Class 2' },
  { id: 3, name: 'Michael Brown', rollNumber: 'R-1067', absences: 6, class: 'Class 4' },
  { id: 4, name: 'Sarah Davis', rollNumber: 'R-1089', absences: 6, class: 'Class 1' },
  { id: 5, name: 'David Wilson', rollNumber: 'R-1112', absences: 5, class: 'Class 5' }
];

// Colors for pie chart - using grayscale
const COLORS = ['#222222', '#666666', '#999999', '#cccccc'];

export const AttendanceReports = () => {
  const [reportType, setReportType] = useState('class');
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [selectedClass, setSelectedClass] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = (format: 'pdf' | 'excel' | 'csv') => {
    setIsGeneratingReport(true);
    
    // Simulate API call for report generation
    setTimeout(() => {
      // In a production environment, this would trigger a file download
      const fileName = `attendance_report_${format}_${Date.now()}`;
      
      // Create a dummy download for demonstration purposes
      if (format === 'pdf' || format === 'excel' || format === 'csv') {
        // Create element with download attribute
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white text-gray-900 shadow-sm hover:shadow transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <div className="w-3 h-3 bg-attendance-present rounded-full"></div>
              Present Rate
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
              <div className="w-3 h-3 bg-attendance-absent rounded-full"></div>
              Absence Rate
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
              <div className="w-3 h-3 bg-attendance-late rounded-full"></div>
              Late Arrivals
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
                <CardTitle>Class Attendance Overview</CardTitle>
                <CardDescription>Comparison of attendance across all classes</CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
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
                  <XAxis dataKey="name" tick={{ fill: '#666' }} />
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
                  <Bar dataKey="present" stackId="a" fill="#22c55e" name="Present" />
                  <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" />
                  <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Monthly Attendance Trend</CardTitle>
                <CardDescription>Overall attendance percentage over time</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8">
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
                <CardDescription>School-wide attendance status breakdown</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8">
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
                <CardTitle>Frequently Absent Students</CardTitle>
                <CardDescription>Students with the highest absence rates this term</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8">
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
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roll #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
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
                {frequentlyAbsentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {student.rollNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {student.class}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        {student.absences} days
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                        onClick={() => toast.info(`Notification sent to ${student.name}'s parents`)}
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
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class Attendance</SelectItem>
                      <SelectItem value="staff">Staff Attendance</SelectItem>
                      <SelectItem value="individual">Individual Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {reportType === 'class' && (
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
                
                <div className="space-y-2 md:col-span-2">
                  <Label>Date</Label>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
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
                  <Label htmlFor="report-type-weekly">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger id="report-type-weekly">
                      <SelectValue placeholder="Select Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class Attendance</SelectItem>
                      <SelectItem value="staff">Staff Attendance</SelectItem>
                      <SelectItem value="individual">Individual Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {reportType === 'class' && (
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
                
                <div className="space-y-2 md:col-span-2">
                  <Label>Date Range</Label>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[180px] justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "MMM d, yyyy") : "Start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
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
                          <Calendar className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "MMM d, yyyy") : "End date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
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
                  <Label htmlFor="report-type-monthly">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger id="report-type-monthly">
                      <SelectValue placeholder="Select Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class Attendance</SelectItem>
                      <SelectItem value="staff">Staff Attendance</SelectItem>
                      <SelectItem value="individual">Individual Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {reportType === 'class' && (
                  <div className="space-y-2">
                    <Label htmlFor="class-monthly">Class</Label>
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger id="class-monthly">
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
                
                <div className="space-y-2 md:col-span-2">
                  <Label>Month & Year</Label>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "MMMM yyyy") : "Select month"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
