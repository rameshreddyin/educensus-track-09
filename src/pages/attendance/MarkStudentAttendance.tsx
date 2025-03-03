
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Check, Grid3X3, List, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { StudentTable } from './components/StudentTable';
import { StudentGrid } from './components/StudentGrid';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock data
const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'];
const sections = ['Section A', 'Section B', 'Section C'];

type Student = {
  id: number;
  name: string;
  rollNumber: string;
  status: 'present' | 'absent' | 'late' | 'leave' | null;
};

// Mock students data
const generateStudents = (count: number): Student[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Student ${i + 1}`,
    rollNumber: `R-${1000 + i}`,
    status: null
  }));
};

export const MarkStudentAttendance = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isLoading, setIsLoading] = useState(false);

  // Load students when class and section are selected
  const handleLoadStudents = () => {
    if (!selectedClass || !selectedSection) {
      toast.error('Please select both class and section');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStudents(generateStudents(25));
      setIsLoading(false);
    }, 600);
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle student status change
  const handleStatusChange = (studentId: number, status: 'present' | 'absent' | 'late' | 'leave') => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  // Handle select all
  const handleSelectAll = (status: 'present' | 'absent' | 'late' | 'leave') => {
    setStudents(prev => 
      prev.map(student => ({ ...student, status }))
    );
    setSelectAll(true);
  };

  // Handle save attendance
  const handleSaveAttendance = () => {
    // Check if all students have a status
    const incomplete = students.some(student => student.status === null);
    
    if (incomplete) {
      toast.warning('Some students do not have attendance marked');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Attendance saved successfully');
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Select Class & Section</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger id="section">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              className="mt-4 w-full"
              onClick={handleLoadStudents}
              disabled={!selectedClass || !selectedSection || isLoading}
            >
              {isLoading ? 'Loading...' : 'Load Students'}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {students.length > 0 && (
        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {selectedClass} - {selectedSection} Attendance for {date ? format(date, 'MMMM d, yyyy') : 'Today'}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn("px-2", viewMode === 'table' && "bg-secondary")}
                onClick={() => setViewMode('table')}
              >
                <List size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn("px-2", viewMode === 'grid' && "bg-secondary")}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={16} />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or roll number..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 bg-green-50 text-attendance-present hover:bg-green-100 hover:text-attendance-present"
                  onClick={() => handleSelectAll('present')}
                >
                  <Check size={14} /> Mark All Present
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 bg-red-50 text-attendance-absent hover:bg-red-100 hover:text-attendance-absent"
                  onClick={() => handleSelectAll('absent')}
                >
                  <X size={14} /> Mark All Absent
                </Button>
              </div>
            </div>
            
            {viewMode === 'table' ? (
              <StudentTable 
                students={filteredStudents} 
                onStatusChange={handleStatusChange} 
              />
            ) : (
              <StudentGrid 
                students={filteredStudents} 
                onStatusChange={handleStatusChange} 
              />
            )}
            
            <div className="mt-6 flex justify-end">
              <Button 
                className="px-8"
                onClick={handleSaveAttendance}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Attendance'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
