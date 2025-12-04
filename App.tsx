import React, { useState, useEffect, useMemo } from 'react';
import { Person, ViewState } from './types';
import { sortPeopleByNextBirthday, getNextBirthday } from './utils';
import HeroCountdown from './components/HeroCountdown';
import PersonList from './components/PersonList';
import AddPersonForm from './components/AddPersonForm';
import { Home, List, Plus, Sparkles, Sun, Moon } from 'lucide-react';


export default function App() {

  const [people, setPeople] = useState<Person[]>([]);
  useEffect(() => {
    fetch("/data.json")
      .then(res => res.json())
      .then(data => setPeople(data));
  }, []);

  const [view, setView] = useState<ViewState>(ViewState.HOME);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Persistence
  // useEffect(() => {
  //   localStorage.setItem('family-celebrations-data', JSON.stringify(people));
  // }, [people]);

  // Derived state: Sorted list
  const sortedPeople = useMemo(() => sortPeopleByNextBirthday(people), [people]);

  // Logic to find ALL people who share the nearest birthday
  const nearestPeople = useMemo(() => {
    if (sortedPeople.length === 0) return [];

    const firstPerson = sortedPeople[0];
    const firstDate = getNextBirthday(firstPerson.birthDate).getTime();

    // Filter everyone whose next birthday is on the same timestamp
    return sortedPeople.filter(p => getNextBirthday(p.birthDate).getTime() === firstDate);
  }, [sortedPeople]);

  const handleAddPerson = (person: Person) => {
    setPeople(prev => [...prev, person]);
    setView(ViewState.HOME);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg text-text dark:text-dark-text font-sans pb-20 md:pb-0 transition-colors duration-300">

      {/* Header Desktop */}
      <header className="hidden md:flex sticky top-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 px-8 py-4 justify-between items-center transition-colors duration-300">
        <div className="flex items-center gap-2 text-primary">
          <button
            onClick={() => setView(ViewState.HOME)}
            className={`flex items-center gap-1 ${view === ViewState.HOME}`}
          >
            <Sparkles className="fill-primary" />
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Doğum Günü Hatırlatıcı Pro Max Ultra Turbo V2</h1>
          </button>

        </div>
        <nav className="flex items-center gap-6">
          <button
            onClick={() => setView(ViewState.HOME)}
            className={`text-sm font-semibold transition-colors ${view === ViewState.HOME ? 'text-primary' : 'text-subtext dark:text-dark-subtext hover:text-primary dark:hover:text-primary'}`}
          >
            Ana Sayfa
          </button>
          <button
            onClick={() => setView(ViewState.LIST)}
            className={`text-sm font-semibold transition-colors ${view === ViewState.LIST ? 'text-primary' : 'text-subtext dark:text-dark-subtext hover:text-primary dark:hover:text-primary'}`}
          >
            Tüm Liste
          </button>

          <div className="h-4 w-px bg-gray-200 dark:bg-white/10 mx-2"></div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-subtext dark:text-dark-subtext transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* <button
            onClick={() => setView(ViewState.ADD_PERSON)}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full font-bold text-sm shadow-md transition-all active:scale-95 ml-2"
          >
            Yeni Kişi Ekle
          </button> */}
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-100 dark:border-white/5 px-6 py-3 flex justify-between items-center z-50 pb-safe transition-colors duration-300">
        <button
          onClick={() => setView(ViewState.HOME)}
          className={`flex flex-col items-center gap-1 ${view === ViewState.HOME ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <Home size={24} strokeWidth={view === ViewState.HOME ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Ana Sayfa</span>
        </button>

        {/* <div className="relative -top-6">
          <button
            onClick={() => setView(ViewState.ADD_PERSON)}
            className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-200 dark:shadow-none active:scale-95 transition-transform border-4 border-white dark:border-dark-bg"
          >
            <Plus size={28} />
          </button>
        </div> */}

        <button
          onClick={() => setView(ViewState.LIST)}
          className={`flex flex-col items-center gap-1 ${view === ViewState.LIST ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <List size={24} strokeWidth={view === ViewState.LIST ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Liste</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10">

        {/* Mobile Header Logo & Toggle */}
        <div className="md:hidden flex items-center justify-between mb-6 pt-2">
          <div className="flex items-center gap-2 text-primary">
            <button
              onClick={() => setView(ViewState.HOME)}
              className={`flex items-center gap-1 ${view === ViewState.HOME}`}
            >
              <Sparkles className="fill-primary w-6 h-6" />
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">Doğum Günü Hatırlatıcı Pro Max Ultra Turbo V2</h1>
            </button>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white dark:bg-dark-card border border-gray-100 dark:border-white/5 text-subtext dark:text-dark-subtext shadow-sm"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {view === ViewState.HOME && (
          <div className="space-y-8 animate-fade-in">
            <section>
              <HeroCountdown people={nearestPeople} />
            </section>

            <section>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Yaklaşan Kutlamalar</h2>
                <button
                  onClick={() => setView(ViewState.LIST)}
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Tümünü Gör
                </button>
              </div>
              <PersonList people={sortedPeople.slice(nearestPeople.length, nearestPeople.length + 3)} showSearch={false} />
            </section>
          </div>
        )}

        {view === ViewState.LIST && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tüm Liste</h2>
              <span className="bg-orange-100 dark:bg-primary/20 text-orange-700 dark:text-primary px-3 py-1 rounded-full text-xs font-bold">
                {people.length} Kişi
              </span>
            </div>
            <PersonList people={sortedPeople} showSearch={true} />
          </div>
        )}

        {view === ViewState.ADD_PERSON && (
          <div className="py-4 animate-fade-in">
            <AddPersonForm onAdd={handleAddPerson} onCancel={() => setView(ViewState.HOME)} />
          </div>
        )}

      </main>



      <style>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}