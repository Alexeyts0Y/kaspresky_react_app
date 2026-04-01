import type { User, Group } from '../types';

const groups: Group[] = [
    { id: 'g1', name: 'Руководство', description: 'Топ-менеджмент компании' },
    { id: 'g2', name: 'Бухгалтерия', description: 'Финансовый и налоговый учет' },
    { id: 'g3', name: 'IT Отдел', description: 'Разработка и поддержка' },
]

let users: User[] = [
    { id: 'u1', name: 'Иван Иванов', email: 'ivanov@corp.com', position: 'Генеральный директор', groupId: 'g1' },
    { id: 'u2', name: 'Анна Смирнова', email: 'smirnova@corp.com', position: 'Главный бухгалтер', groupId: 'g2' },
    { id: 'u3', name: 'Петр Петров', email: 'petrov@corp.com', position: 'Frontend Разработчик', groupId: 'g3' },
    { id: 'u4', name: 'Елена Сидорова', email: 'sidorova@corp.com', position: 'Внештатный дизайнер', groupId: null },
]

export const api = {
    getUsers: async (): Promise<User[]> => {
        return [...users];
    },
    getGroups: async (): Promise<Group[]> => {
        return [...groups];
    },
    addUser: async (user: Omit<User, 'id'>): Promise<User> => {
        const newUser = {...user, id: `u${Date.now()}`};
        users.push(newUser);
        return newUser;
    },
    deleteUser: async (id: string): Promise<void> => {
        users = users.filter((u) => u.id !== id);
    },
}