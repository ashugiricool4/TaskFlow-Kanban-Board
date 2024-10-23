import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const PRIORITY_MAP = {
  4: { label: "Urgent", color: "#EB5757" },
  3: { label: "High", color: "#F2994A" },
  2: { label: "Medium", color: "#F2C94C" },
  1: { label: "Low", color: "#2EA44F" },
  0: { label: "No priority", color: "#808080" }
};

const STATUS_ICONS = {
  "Todo": "📋",
  "In progress": "⌛",
  "Backlog": "📝"
};

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState(() => 
    localStorage.getItem('groupBy') || 'status'
  );
  const [sortBy, setSortBy] = useState(() => 
    localStorage.getItem('sortBy') || 'priority'
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('groupBy', groupBy);
    localStorage.setItem('sortBy', sortBy);
  }, [groupBy, sortBy]);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
      const data = await response.json();
      setTickets(data.tickets);
      setUsers(data.users);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const sortTickets = useMemo(() => {
    return (ticketsToSort) => {
      return [...ticketsToSort].sort((a, b) => {
        if (sortBy === 'priority') {
          return b.priority - a.priority;
        }
        return a.title.localeCompare(b.title);
      });
    };
  }, [sortBy]);

  const getUserById = (userId) => {
    return users.find(user => user.id === userId) || { name: 'Unassigned' };
  };

  const groupedTickets = useMemo(() => {
    const sorted = sortTickets(tickets);
    
    switch(groupBy) {
      case 'status':
        return {
          'Todo': sorted.filter(t => t.status === 'Todo'),
          'In progress': sorted.filter(t => t.status === 'In progress'),
          'Backlog': sorted.filter(t => t.status === 'Backlog')
        };
      
      case 'user':
        return users.reduce((acc, user) => {
          acc[user.name] = sorted.filter(t => t.userId === user.id);
          return acc;
        }, {});
      
      case 'priority':
        return Object.entries(PRIORITY_MAP).reverse().reduce((acc, [priority, { label }]) => {
          acc[label] = sorted.filter(t => t.priority === Number(priority));
          return acc;
        }, {});

      default:
        return {};
    }
  }, [tickets, users, groupBy, sortTickets]);

  const getGroupIcon = (group) => {
    if (groupBy === 'status') {
      return (
        <span className="status-icon">
          {STATUS_ICONS[group]}
        </span>
      );
    }

    if (groupBy === 'priority') {
      const priorityKey = Object.keys(PRIORITY_MAP).find(
        k => PRIORITY_MAP[k].label === group
      );
      if (priorityKey) {
        return (
          <span 
            className="priority-dot"
            style={{ backgroundColor: PRIORITY_MAP[priorityKey].color }}
          />
        );
      }
    }

    if (groupBy === 'user') {
      return (
        <span className="user-icon">👤</span>
      );
    }

    return null;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Kanban Board</h1>
        <div className="controls">
          <select 
            className="select-control"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="status">Group by Status</option>
            <option value="user">Group by User</option>
            <option value="priority">Group by Priority</option>
          </select>
          
          <select 
            className="select-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </header>

      <div className="kanban-board">
        {Object.entries(groupedTickets).map(([group, groupTickets]) => (
          <div key={group} className="column">
            <div className="column-header">
              <div className="column-title">
                {getGroupIcon(group)}
                <span className="group-name">{group}</span>
                <span className="ticket-count">{groupTickets.length}</span>
              </div>
            </div>
            
            <div className="tickets-container">
              {groupTickets.map(ticket => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-header">
                    <span className="ticket-id">{ticket.id}</span>
                    <span 
                      className="user-avatar"
                      data-user={getUserById(ticket.userId).name.charAt(0)}
                    >
                      {getUserById(ticket.userId).name.charAt(0)}
                    </span>
                  </div>
                  <div className="ticket-title">
                    <span 
                      className="priority-dot"
                      style={{ backgroundColor: PRIORITY_MAP[ticket.priority].color }}
                    />
                    <span className="title-text">{ticket.title}</span>
                  </div>
                  <div className="feature-request">
                    Feature Request
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;