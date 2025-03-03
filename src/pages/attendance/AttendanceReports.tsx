
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Download, FileSpreadsheet, FilePdf, AlertTriangle, User
} from 'lucide-react';
import { toast } from 'sonner';

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

// Colors for pie chart
const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'];

export const AttendanceReports = () => {
  const [reportType, setReportType] = useState('class');
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [selectedClass, setSelectedClass] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = (format: 'pdf' | 'excel' | 'csv') => {
    setIsGeneratingReport(true);
    
    // Simulate API call for report generation
    setTimeout(() => {
      toast.success(`${format.toUpperCase()} report generated successfully`);
      setIsGeneratingReport(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-attendance-present rounded-full"></span>
              Present Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">85%</div>
            <p className="text-sm text-muted-foreground">School-wide average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-attendance-absent rounded-full"></span>
              Absence Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">10%</div>
            <p className="text-sm text-muted-foreground">School-wide average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-attendance-late rounded-full"></span>
              Late Arrivals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5%</div>
            <p className="text-sm text-muted-foreground">School-wide average</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Class Attendance Overview</CardTitle>
            <CardDescription>Comparison of attendance across all classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={classAttendanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" stackId="a" fill="#22c55e" name="Present" />
                  <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" />
                  <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Attendance Trend</CardTitle>
            <CardDescription>Overall attendance percentage over the past months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyTrendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Attendance %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance Distribution</CardTitle>
            <CardDescription>School-wide attendance status breakdown</CardDescription>
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Frequently Absent Students
          </CardTitle>
          <CardDescription>Students with the highest absence rates this term</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
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
              <tbody className="divide-y divide-gray-200">
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
      
      <Card>
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
              </div>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handleGenerateReport('pdf')}
                  disabled={isGeneratingReport}
                >
                  <FilePdf className="h-4 w-4" />
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
                  <Download className="h-4 w-4" />
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
              </div>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handleGenerateReport('pdf')}
                  disabled={isGeneratingReport}
                >
                  <FilePdf className="h-4 w-4" />
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
                  <Download className="h-4 w-4" />
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
              </div>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => handleGenerateReport('pdf')}
                  disabled={isGeneratingReport}
                >
                  <FilePdf className="h-4 w-4" />
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
                  <Download className="h-4 w-4" />
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
