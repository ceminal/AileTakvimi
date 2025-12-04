import React from 'react';
import { Person } from '../types';
import { getDaysRemaining, formatDatePretty, isToday, getTurningAge } from '../utils';
import { Cake, Calendar } from 'lucide-react';

interface PersonListProps {
  people: Person[];
  showSearch?: boolean;
}

const PersonList: React.FC<PersonListProps> = ({ people, showSearch = true }) => {
  const [search, setSearch] = React.useState("");

  const filteredPeople = people.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // if (filteredPeople.length === 0) {
  //   return (
  //     <div className="flex flex-col items-center justify-center py-20 text-subtext dark:text-dark-subtext">
  //       <Calendar size={48} className="mb-4 opacity-50" />
  //       <p>Sonuç bulunamadı.</p>
  //     </div>
  //   );
  // }

  if (people.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-subtext dark:text-dark-subtext">
        <Calendar size={48} className="mb-4 opacity-50" />
        <p>Listenizde henüz kimse yok.</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {showSearch &&
        <div className="mb-4">
          <input
            type="text"
            placeholder="İsim ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-card text-sm outline-none focus:border-primary dark:focus:border-primary transition"
          />
        </div>
      }

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-24">
        {filteredPeople.map((person) => {
          const daysLeft = getDaysRemaining(person.birthDate);
          const today = isToday(person.birthDate);
          const age = getTurningAge(person.birthDate);

          return (
            <div
              key={person.id}
              className={`group relative flex items-center p-4 rounded-2xl border transition-all duration-300 hover:shadow-md cursor-pointer
              ${today
                  ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20'
                  : 'bg-white dark:bg-dark-card border-gray-100 dark:border-white/5 hover:border-orange-100 dark:hover:border-white/10'
                }
            `}
            >
              <div className="relative shrink-0 mr-4">
                <img
                  src={person.avatarUrl}
                  alt={person.name}
                  className={`w-14 h-14 rounded-full object-cover border-2 ${today ? 'border-primary' : 'border-gray-100 dark:border-white/10'}`}
                />
                {today && (
                  <div className="absolute -top-1 -right-1 bg-primary text-white p-1 rounded-full">
                    <Cake size={10} fill="currentColor" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text dark:text-dark-text truncate">{person.name}</h3>
                <p className="text-sm text-subtext dark:text-dark-subtext truncate">
                  {formatDatePretty(person.birthDate)}
                </p>
              </div>

              {/* <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text dark:text-dark-text truncate">{person.name}</h3>
                <p className="text-sm text-subtext dark:text-dark-subtext truncate">
                  {formatDatePretty(person.birthDate)} • {age} Yaşında
                </p>
              </div> */}

              <div className="text-right shrink-0 pl-2">
                {today ? (
                  <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full animate-pulse">
                    Bugün!
                  </span>
                ) : (
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-primary">{daysLeft}</span>
                    <span className="text-xs text-subtext dark:text-dark-subtext font-medium">gün kaldı</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonList;