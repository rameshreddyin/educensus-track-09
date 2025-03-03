
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  BookOpenText,
  Calendar,
  ClipboardList,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  path: string;
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

const sidebarSections: SidebarSection[] = [
  {
    title: 'MAIN',
    items: [
      { title: 'Dashboard', icon: Home, path: '/' },
      { title: 'Leads & Enrollments', icon: Users, path: '/leads' },
      { title: 'Students', icon: Users, path: '/students' },
      { title: 'Staff', icon: Users, path: '/staff' }
    ]
  },
  {
    title: 'ACADEMIC',
    items: [
      { title: 'Classes', icon: BookOpenText, path: '/classes' },
      { title: 'Subjects', icon: ClipboardList, path: '/subjects' },
      { title: 'Attendance', icon: Calendar, path: '/attendance' },
      { title: 'Exams', icon: ClipboardList, path: '/exams' },
      { title: 'Timetable', icon: Calendar, path: '/timetable' }
    ]
  },
  {
    title: 'ADMINISTRATION',
    items: [
      { title: 'Finance', icon: Wallet, path: '/finance' },
      { title: 'Events', icon: Calendar, path: '/events' },
      { title: 'Messages', icon: MessageSquare, path: '/messages' }
    ]
  }
];

export const AppSidebar = () => {
  return (
    <div className="w-60 bg-sidebar text-sidebar-foreground min-h-screen border-r border-sidebar-border flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold">EduManager</h1>
      </div>
      
      <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
          <span className="text-sidebar-accent-foreground">S</span>
        </div>
        <div>
          <p className="font-medium">Super Admin</p>
          <p className="text-sm text-sidebar-foreground/70">Super Admin</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {sidebarSections.map((section, index) => (
          <div key={index} className="py-2">
            <p className="text-xs font-medium text-sidebar-foreground/70 px-4 py-2">{section.title}</p>
            <ul>
              {section.items.map((item, idx) => (
                <li key={idx}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative",
                      isActive 
                        ? "bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:bg-sidebar-primary" 
                        : "text-sidebar-foreground/90 hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon size={18} />
                    <span>{item.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <button className="flex items-center gap-3 text-sm text-sidebar-foreground/90 w-full px-4 py-2.5 hover:bg-sidebar-accent/50 transition-colors rounded-md">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
