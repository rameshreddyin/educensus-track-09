
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Check, CalendarIcon, Grid3X3, List, Search, X, Filter, 
  RefreshCw, Ban, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { StudentTable } from './components/StudentTable';
import { StudentGrid } from './components/StudentGrid';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [defaultClass] = useState<string>('Class 1');
  const [defaultSection] = useState<string>('Section A');
  const [selectedClass, setSelectedClass] = useState<string>(defaultClass);
  const [selectedSection, setSelectedSection] = useState<string>(defaultSection);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Load students automatically on initial render
  useEffect(() => {
    loadStudents();
  }, []);

  // Load students when class and section change
  useEffect(() => {
    if (selectedClass && selectedSection) {
      loadStudents();
    }
  }, [selectedClass, selectedSection]);

  const loadStudents = () => {
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

  // Handle remove status
  const handleRemoveStatus = (studentId: number) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId ? { ...student, status: null } : student
      )
    );
    toast.info("Attendance status removed");
  };

  // Handle select all
  const handleSelectAll = (status: 'present' | 'absent' | 'late' | 'leave') => {
    setStudents(prev => 
      prev.map(student => ({ ...student, status }))
    );
    toast.success(`All students marked as ${status}`);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedClass(defaultClass);
    setSelectedSection(defaultSection);
    setSearchQuery('');
    setDate(new Date());
    setFiltersApplied(false);
    toast.info("All filters have been reset");
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

  // Handle filter apply
  const handleApplyFilters = () => {
    loadStudents();
    setFiltersApplied(true);
    setShowFilters(false);
    toast.success('Filters applied successfully');
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">
            {selectedClass} - {selectedSection} | {date ? format(date, 'MMMM d, yyyy') : 'Today'}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </TooltipTrigger>
                <TooltipContent>Select Date</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn("h-8 gap-1", showFilters && "bg-secondary")}
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {filtersApplied && <Badge variant="secondary" className="ml-1 h-5 px-1">•</Badge>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle Filters</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {filtersApplied && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetFilters}
                      className="h-8 w-8 p-0"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset Filters</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn("h-8 w-8 p-0", viewMode === 'table' && "bg-secondary")}
                      onClick={() => setViewMode('table')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Table View</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn("h-8 w-8 p-0", viewMode === 'grid' && "bg-secondary")}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Grid View</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        
        {showFilters && (
          <CardContent className="pb-3 pt-0 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
              <div className="space-y-1">
                <Label htmlFor="class" className="text-xs font-medium">Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class" className="h-8">
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
              
              <div className="space-y-1">
                <Label htmlFor="section" className="text-xs font-medium">Section</Label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger id="section" className="h-8">
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
              
              <div className="flex items-end">
                <Button 
                  size="sm" 
                  className="h-8"
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        )}
        
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or roll number..."
                className="pl-8 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1 h-7 w-7 p-0" 
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1 bg-green-50 text-attendance-present hover:bg-green-100 hover:text-attendance-present h-9"
                      onClick={() => handleSelectAll('present')}
                    >
                      <Check size={14} /> Mark All Present
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mark all students as present</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1 bg-red-50 text-attendance-absent hover:bg-red-100 hover:text-attendance-absent h-9"
                      onClick={() => handleSelectAll('absent')}
                    >
                      <X size={14} /> Mark All Absent
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mark all students as absent</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1 bg-yellow-50 text-attendance-late hover:bg-yellow-100 hover:text-attendance-late h-9"
                      onClick={() => handleSelectAll('late')}
                    >
                      <Clock size={14} /> Mark All Late
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mark all students as late</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No students found. Try changing your filters.</p>
            </div>
          ) : (
            <>
              {viewMode === 'table' ? (
                <StudentTable 
                  students={filteredStudents} 
                  onStatusChange={handleStatusChange} 
                  onRemoveStatus={handleRemoveStatus}
                />
              ) : (
                <StudentGrid 
                  students={filteredStudents} 
                  onStatusChange={handleStatusChange} 
                  onRemoveStatus={handleRemoveStatus}
                />
              )}
            </>
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
    </div>
  );
};
