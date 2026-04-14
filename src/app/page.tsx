import { ChatInterface } from "@/components/chat/ChatInterface";
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Library Management System
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-gray-600 sm:text-lg">
            Une plateforme moderne pour gerer les livres, les emprunts et les
            utilisateurs dans une interface inspiree du style chat.
          </p>
        </section>
        <ChatInterface />
      </main>
    </div>
  );
}
