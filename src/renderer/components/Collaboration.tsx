import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface User {
  id: string;
  name: string;
  color: string;
}

const Collaboration: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join', {
        name: `User${Math.floor(Math.random() * 1000)}`,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      });
    });

    newSocket.on('users', (connectedUsers: User[]) => {
      setUsers(connectedUsers);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-[#d4d4d4]">
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {/* Connection Status */}
          <div className="flex items-center mb-4">
            <div className="text-xs uppercase tracking-wider font-medium">Status</div>
            <div className={`ml-2 w-2 h-2 rounded-full ${isConnected ? 'bg-[#2ea043]' : 'bg-[#f85149]'}`} />
            <div className="ml-2 text-sm text-[#858585]">
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
          </div>

          {/* Connected Users */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="text-xs uppercase tracking-wider font-medium">
                Connected Users
              </div>
              <div className="ml-2 px-2 py-0.5 text-xs bg-[#2ea043] text-black rounded-full">
                {users.length}
              </div>
            </div>
            <div className="space-y-1">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center px-3 py-2 rounded hover:bg-[#2a2d2e]"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: user.color }}
                  />
                  <div className="ml-2 text-sm">{user.name}</div>
                  {user.id === socket?.id && (
                    <div className="ml-2 text-xs text-[#858585]">(you)</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-4">
            <div className="text-xs uppercase tracking-wider font-medium mb-2">
              Quick Actions
            </div>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 text-sm bg-[#2a2d2e] hover:bg-[#37373d] rounded text-left">
                Share Current File
              </button>
              <button className="w-full px-3 py-2 text-sm bg-[#2a2d2e] hover:bg-[#37373d] rounded text-left">
                Start Voice Call
              </button>
              <button className="w-full px-3 py-2 text-sm bg-[#2a2d2e] hover:bg-[#37373d] rounded text-left">
                Share Terminal Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaboration; 