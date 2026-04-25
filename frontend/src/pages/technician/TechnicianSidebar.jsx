import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Wrench, Ticket, Activity, Settings, LogOut, 
  Home, Calendar, CheckCircle, AlertCircle
} from 'lucide-react';

function TechnicianSidebar({ handleLogout, sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const [technicianName, setTechnicianName] = useState('Technician');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setTechnicianName(user.name || user.email?.split('@')[0] || 'Technician');
    }
  }, []);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Home size={20} />,
      path: '/technician',
      description: 'Overview and stats'
    },
    {
      title: 'My Tickets',
      icon: <Ticket size={20} />,
      path: '/technician/tickets',
      description: 'Assigned tickets'
    },
    {
      title: 'In Progress',
      icon: <Activity size={20} />,
      path: '/technician/in-progress',
      description: 'Active work'
    },
    {
      title: 'Resolved',
      icon: <CheckCircle size={20} />,
      path: '/technician/resolved',
      description: 'Completed work'
    },
    {
      title: 'Close',
      icon: <AlertCircle size={20} />,
      path: '/technician/close',
      description: 'To be started'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0c5252] shadow-2xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-emerald-800/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">{technicianName}</h1>
                <p className="text-xs text-emerald-300/70">Support Portal</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-emerald-800/20 transition-colors"
            >
              <LogOut className="w-5 h-5 text-emerald-300" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive(item.path) 
                    ? 'bg-emerald-400/20 text-emerald-300 shadow-lg shadow-emerald-900/20' 
                    : 'text-emerald-200/70 hover:bg-emerald-800/30 hover:text-emerald-100'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${isActive(item.path) 
                    ? 'bg-emerald-400/30 text-emerald-200' 
                    : 'bg-emerald-800/20 text-emerald-300 group-hover:bg-emerald-700/30'
                  }
                `}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-white truncate">{item.title}</div>
                  <div className="text-xs text-emerald-300/60 truncate">{item.description}</div>
                </div>
              </NavLink>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-emerald-800/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl 
                         bg-red-500/10 text-red-300 hover:bg-red-500/20 
                         transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TechnicianSidebar;
