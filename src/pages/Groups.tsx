import { useEffect, useState } from 'react';
import { Users, Briefcase, Building2 } from 'lucide-react'; // Требуется npm install lucide-react
import { api } from '../api/mockApi';
import type { Group, User } from '../types';

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getGroups(), api.getUsers()]).then(([groupsData, usersData]) => {
      setGroups(groupsData);
      setUsers(usersData);
      setLoading(false);
    });
  }, []);

  // Вспомогательная функция для подсчета сотрудников в группе
  const getUserCount = (groupId: string) => {
    return users.filter(user => user.groupId === groupId).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-blue-600" />
          Структура компании
        </h1>
        <p className="mt-2 text-gray-600">Управление отделами и рабочими группами организации</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => {
          const count = getUserCount(group.id);
          return (
            <div 
              key={group.id} 
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    <Users className="w-4 h-4" />
                    {count} {count === 1 ? 'сотрудник' : 'сотрудников'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {group.description}
                </p>

                <div className="pt-4 border-t border-gray-100">
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
                    Подробнее об отделе &rarr;
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Карточка-заглушка для пользователей без группы */}
        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-gray-400 transition-colors bg-gray-50">
          <div className="p-3 bg-gray-200 text-gray-500 rounded-full mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">Сотрудники вне штата</h3>
          <p className="text-gray-500 text-sm mb-3">Сотрудники, не привязанные к конкретному отделу</p>
          <span className="text-xl font-black text-gray-800">{users.filter(u => !u.groupId).length}</span>
        </div>
      </div>
    </div>
  );
}