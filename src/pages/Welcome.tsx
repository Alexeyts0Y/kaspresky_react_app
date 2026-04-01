import { Link } from 'react-router-dom'

export default function Welcome() {
    return (
        <div className="text-center py-20">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                Добро пожаловать в корпоративный портал
            </h1>
            <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                Здесь можно управлять списками сотрудников и просматривать структуру отделов
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Link to="/users" className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-500">
                    Список сотрудников
                </Link>
                <Link to="/groups" className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-500">
                    Информация об отделах
                </Link>
            </div>
        </div>
    )
}