
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Grid3X3, List, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { StaffTable } from './components/StaffTable';
import { StaffGrid } from './components/StaffGrid';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock data
const departments = ['Administration', 'Teaching', 'Support Staff', 'Maintenance', 'IT'];

type Staff = {
  id: number;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  status: 'present' | 'absent' | 'late' | 'leave' | null;
};

// Mock staff data
const generateStaff = (count: number): Staff[] => {
  const designations = ['Teacher', 'Assistant Teacher', 'Administrator', 'Counselor', 'Librarian', 'IT Support'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Staff Member ${i + 1}`,
    employeeId: `EMP-${2000 + i}`,
    department: departments[Math.floor(Math.random() * departments.length)],
    designation: designations[Math.floor(Math.random() * designations.length)],
    status: null
  }));
};

export const MarkStaffAttendance = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isLoading, setIsLoading] = useState(false);

  // Load staff when department is selected
  const handleLoadStaff = () => {
    if (!selectedDepartment) {
      toast.error('Please select a department');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStaff(generateStaff(12));
      setIsLoading(false);
    }, 600);
  };

  // Filter staff based on search query
  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle staff status change
  const handleStatusChange = (staffId: number, status: 'present' | 'absent' | 'late' | 'leave') => {
    setStaff(prev => 
      prev.map(member => 
        member.id === staffId ? { ...member, status } : member
      )
    );
  };

  // Handle select all
  const handleSelectAll = (status: 'present' | 'absent' | 'late' | 'leave') => {
    setStaff(prev => 
      prev.map(member => ({ ...member, status }))
    );
  };

  // Handle save attendance
  const handleSaveAttendance = () => {
    // Check if all staff have a status
    const incomplete = staff.some(member => member.status === null);
    
    if (incomplete) {
      toast.warning('Some staff members do not have attendance marked');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Staff attendance saved successfully');
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
            <CardTitle className="text-lg">Select Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              className="mt-4 w-full"
              onClick={handleLoadStaff}
              disabled={!selectedDepartment || isLoading}
            >
              {isLoading ? 'Loading...' : 'Load Staff'}
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {staff.length > 0 && (
        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {selectedDepartment === 'all' ? 'All Departments' : selectedDepartment} Attendance for {date ? format(date, 'MMMM d, yyyy') : 'Today'}
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
                  placeholder="Search by name, ID, or designation..."
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
              <StaffTable 
                staff={filteredStaff} 
                onStatusChange={handleStatusChange} 
              />
            ) : (
              <StaffGrid 
                staff={filteredStaff} 
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
