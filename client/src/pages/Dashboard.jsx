import React from 'react';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="bg-white shadow-md p-4 rounded-md mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </header>
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <section className="bg-white p-4 rounded-md shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Tasks</h2>
                    <ul>
                        <li className="mb-2 p-2 bg-gray-50 rounded-md shadow-sm">Task 1</li>
                        <li className="mb-2 p-2 bg-gray-50 rounded-md shadow-sm">Task 2</li>
                        <li className="mb-2 p-2 bg-gray-50 rounded-md shadow-sm">Task 3</li>
                    </ul>
                </section>
                <section className="bg-white p-4 rounded-md shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Expenses</h2>
                    <ul>
                        <li className="mb-2 p-2 bg-gray-50 rounded-md shadow-sm">Expense 1</li>
                        <li className="mb-2 p-2 bg-gray-50 rounded-md shadow-sm">Expense 2</li>
                        <li className="mb-2 p-2 bg-gray-50 rounded-md shadow-sm">Expense 3</li>
                    </ul>
                </section>
                <section className="bg-white p-4 rounded-md shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
                    <div className="p-2 bg-gray-50 rounded-md shadow-sm">
                        <p>Total Tasks: 3</p>
                        <p>Total Expenses: $300</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
