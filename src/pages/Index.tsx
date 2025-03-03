
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <AppLayout title="Dashboard" subtitle="Welcome back, Super Admin!">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              4.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Teachers & Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              2.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12.4L</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              12.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Leads (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              8.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>School Performance</CardTitle>
              <div className="flex space-x-2">
                <Link 
                  to="/attendance" 
                  className="inline-flex items-center text-sm text-blue-600 hover:underline"
                >
                  View Attendance
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Attendance Overview</h3>
                <p className="text-sm text-muted-foreground">Weekly average attendance rate</p>
              </div>
              
              <div className="grid grid-cols-6 gap-2 mt-6">
                {[45, 40, 35, 42, 45, 38].map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-full bg-gray-600" style={{ height: `${value * 2}px` }}></div>
                    <div className="text-xs mt-1">Class {index + 1}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <div className="text-sm text-gray-500">
                  Overall Attendance: <span className="font-medium">87%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Admission Trends</CardTitle>
              <div className="flex space-x-2">
                <span className="text-sm text-gray-500">This Year</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Monthly Enrollments</h3>
                <p className="text-sm text-muted-foreground">New students per month</p>
              </div>
              
              <div className="h-48 relative">
                <svg viewBox="0 0 300 100" className="w-full h-full">
                  <polyline
                    points="0,90 40,70 80,50 120,35 160,20 200,30 240,45 280,40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle cx="0" cy="90" r="3" />
                  <circle cx="40" cy="70" r="3" />
                  <circle cx="80" cy="50" r="3" />
                  <circle cx="120" cy="35" r="3" />
                  <circle cx="160" cy="20" r="3" />
                  <circle cx="200" cy="30" r="3" />
                  <circle cx="240" cy="45" r="3" />
                  <circle cx="280" cy="40" r="3" />
                </svg>
                
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
