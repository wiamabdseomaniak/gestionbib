'use client';

import Link from 'next/link';
import { Card } from '@/components/ui';

export const ChatInterface = () => {
  const actions = [
    {
      icon: '📚',
      title: 'Browse Books',
      description: 'Explore our collection',
      href: '/books',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: '🔐',
      title: 'Student Login',
      description: 'Access your dashboard',
      href: '/login?role=student',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: '📝',
      title: 'Register',
      description: 'Create an account',
      href: '/register',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: '👨‍💼',
      title: 'Librarian Login',
      description: 'Admin access',
      href: '/login?role=librarian',
      color: 'from-amber-500 to-amber-600',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-start">
          <div className="max-w-md lg:max-w-2xl">
            <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 shadow-md">
              <div className="flex items-center space-x-2 mb-2">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">GestioBib Assistant</span>
              </div>
              <p className="text-gray-800 text-lg">
                Welcome to <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">GestioBib</span>! 
                Your modern library management system. How can I help you today?
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="max-w-md lg:max-w-2xl">
            <div className="bg-indigo-500 rounded-2xl rounded-tr-none p-4 shadow-md text-white">
              <p className="text-sm">Hello! I'm here to help you manage your library experience.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <div className="max-w-3xl">
            <div className="bg-gray-100 rounded-2xl rounded-tl-none p-6 shadow-md">
              <p className="text-gray-800 mb-4 font-medium">
                Here are some quick actions you can take:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="group"
                  >
                    <Card hover className="h-full">
                      <div className="flex items-start space-x-4">
                        <div className={`bg-gradient-to-br ${action.color} p-3 rounded-xl text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
