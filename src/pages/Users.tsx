import { useState, useEffect, useMemo } from 'react';
import { api } from '../api/mockApi';
import type { User, Group } from '../types';
import { useDebounce } from '../hooks/useDebounce';

type SortKey = keyof User;
type SortDirection = 'asc' | 'desc';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [sortConfig, setSortConfig] = useState<{key: SortKey, direction: SortDirection} | null>(null);

    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPosition, setNewUserPosition] = useState('');

    useEffect(() => {
        Promise.all([api.getUsers(), api.getGroups()]).then(([usersData, groupsData]) => {
            setUsers(usersData);
            setGroups(groupsData);
            setLoading(false);
            });
    }, []);

    const handleAddUser = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!newUserName || !newUserEmail) return;
        const user = await api.addUser({name: newUserName, email: newUserEmail, position: newUserPosition, groupId: null});
        setUsers([...users, user]);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPosition('');
    };

    const handleDelete = async (id: string) => {
        await api.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
    };

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({key, direction});
    }

    const getGroupName = (groupId: string | null) => {
        if (!groupId) return 'Без группы';
        return groups.find(g => g.id === groupId)?.name || 'Неизвестно';
    };

    const processedUsers = useMemo(() => {
        let result = [...users];

        if (debouncedSearch) {
            const lowercasedSearch = debouncedSearch.toLowerCase();
            result = result.filter(
                user => 
                    user.name.toLowerCase().includes(lowercasedSearch) ||
                    user.email.toLowerCase().includes(lowercasedSearch) ||
                    user.position.toLowerCase().includes(lowercasedSearch)
                
            );
        }

        if (sortConfig) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key] || '';
                const bValue = b[sortConfig.key] || '';
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [users, debouncedSearch, sortConfig]);

    if (loading) return <div className="text-center py-10">Загрузка данных...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Список сотрудников</h2>
                <input 
                    type="text"
                    placeholder="Поиск по имени, email..."
                    className="border rounded-md px-4 py-2 w-72"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)} 
                />
            </div>
            <form onSubmit={handleAddUser} className="bg-white p-4 rounded-lg shadow-sm border flex gap-4 items-end">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">ФИО</label>
                    <input required type="text" className="border rounded px-3 py-1.5 w-full" value={newUserName} onChange={e => setNewUserName(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input required type="text" className="border rounded px-3 py-1.5 w-full" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Должность</label>
                    <input required type="text" className="border rounded px-3 py-1.5 w-full" value={newUserPosition} onChange={e => setNewUserPosition(e.target.value)} />
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700">Добавить</button>
            </form>
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['name', 'email', 'position'].map((key) => (
                                <th key={key} onClick={() => handleSort(key as SortKey)} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                    {key === 'name' ? 'Сотрудник' : key === 'email' ? 'Email' : 'Должность'}
                                    {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Отдел</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {processedUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 text-gray-500">{user.position}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${user.groupId ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {getGroupName(user.groupId)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">Удалить</button>
                                </td>
                            </tr>
                        ))}
                        {processedUsers.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Пользователи не найдены</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}