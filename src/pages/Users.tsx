import { useState, useEffect } from 'react';
import { api } from '../api/mockApi';
import type { User, Group } from '../types';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.getUsers(), api.getGroups()]).then(([usersData, groupsData]) => {
            setUsers(usersData);
            setGroups(groupsData);
            setLoading(false);
            });
    }, []);

    const getGroupName = (groupId: string | null) => {
        if (!groupId) return 'Без группы';
        return groups.find(g => g.id === groupId)?.name || 'Неизвестно';
    };

    if (loading) return <div className="text-center py-10">Загрузка данных...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Список сотрудников</h2>
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сотрудник</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Должность</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Отдел</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 text-gray-500">{user.position}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${user.groupId ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {getGroupName(user.groupId)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}