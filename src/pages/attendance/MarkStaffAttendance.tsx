
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
import { StaffTable } from './components/StaffTable';
import { StaffGrid } from './components/StaffGrid';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const [defaultDepartment] = useState<string>('Teaching');
  const [selectedDepartment, setSelectedDepartment] = useState<string>(defaultDepartment);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Load staff automatically on initial render
  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = () => {
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

  // Handle remove status
  const handleRemoveStatus = (staffId: number) => {
    setStaff(prev => 
      prev.map(member => 
        member.id === staffId ? { ...member, status: null } : member
      )
    );
    toast.info("Attendance status removed");
  };

  // Handle select all
  const handleSelectAll = (status: 'present' | 'absent' | 'late' | 'leave') => {
    setStaff(prev => 
      prev.map(member => ({ ...member, status }))
    );
    toast.success(`All staff marked as ${status}`);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSelectedDepartment(defaultDepartment);
    setSearchQuery('');
    setDate(new Date());
    setFiltersApplied(false);
    toast.info("All filters have been reset");
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

  // Handle apply filters
  const handleApplyFilters = () => {
    loadStaff();
    setFiltersApplied(true);
    setShowFilters(false);
    toast.success('Filters applied successfully');
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">
            {selectedDepartment === 'all' ? 'All Departments' : selectedDepartment} | {date ? format(date, 'MMMM d, yyyy') : 'Today'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div className="space-y-1">
                <Label htmlFor="department" className="text-xs font-medium">Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger id="department" className="h-8">
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
                placeholder="Search by name, ID, or designation..."
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
                  <TooltipContent>Mark all staff as present</TooltipContent>
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
                  <TooltipContent>Mark all staff as absent</TooltipContent>
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
                  <TooltipContent>Mark all staff as late</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-muted-foreground">Loading staff...</p>
              </div>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No staff members found. Try changing your filters.</p>
            </div>
          ) : (
            <>
              {viewMode === 'table' ? (
                <StaffTable 
                  staff={filteredStaff} 
                  onStatusChange={handleStatusChange}
                  onRemoveStatus={handleRemoveStatus}
                />
              ) : (
                <StaffGrid 
                  staff={filteredStaff} 
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
