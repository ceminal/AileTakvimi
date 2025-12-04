import React, { useEffect, useState } from 'react';
import { Person, CountdownTime } from '../types';
import { getNextBirthday, getTurningAge, isToday } from '../utils';
import confetti from 'canvas-confetti';
import { Gift, Clock } from 'lucide-react';

interface HeroCountdownProps {
  people: Person[];
}

const HeroCountdown: React.FC<HeroCountdownProps> = ({ people }) => {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);

  // Since all people passed here have the same birthday (grouped in App.tsx), we use the first one for calculations.
  const primaryPerson = people.length > 0 ? people[0] : undefined;

  useEffect(() => {
    if (!primaryPerson) return;

    const checkTime = () => {
      const today = isToday(primaryPerson.birthDate);
      setIsBirthdayToday(today);

      if (today) {
        // Stop timer visually if it's today
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const nextBday = getNextBirthday(primaryPerson.birthDate);
      const now = new Date();

      const target = new Date(nextBday);
      target.setHours(0, 0, 0, 0);

      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    checkTime();
    const timer = setInterval(checkTime, 1000);

    // Trigger confetti if it is today
    if (isToday(primaryPerson.birthDate)) {
      const duration = 3000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#eb6347', '#ffffff', '#fbbf24']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#eb6347', '#ffffff', '#fbbf24']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }

    return () => clearInterval(timer);
  }, [primaryPerson]);

  if (!primaryPerson) {
    return (
      <div className="w-full bg-white dark:bg-dark-card rounded-3xl p-8 shadow-sm text-center border border-gray-100 dark:border-white/5 transition-colors duration-300">
        <div className="w-20 h-20 bg-gray-100 dark:bg-dark-bg rounded-full mx-auto mb-4 flex items-center justify-center">
          <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-xl font-bold text-text dark:text-white">Henüz kimse eklenmedi</h2>
        <p className="text-subtext dark:text-dark-subtext mt-2">Takvimi başlatmak için yeni bir kişi ekleyin!</p>
      </div>
    );
  }

  // Format names helper: "Ali", "Ali ve Veli", "Ali, Veli ve Ayşe"
  const getFormattedNames = () => {
    const names = people.map(p => p.name.split(' ')[0]);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    const last = names.pop();
    return `${names.join(', ')} ve ${last}`;
  };

  const getFormattedAges = () => {
    if (people.length === 1) {
      return `${getTurningAge(people[0].birthDate)} yaşına`;
    }
    return people.map(p => `${p.name.split(' ')[0]} (${getTurningAge(p.birthDate)})`).join(', ');
  };

  const formattedNames = getFormattedNames();
  const multiplePeople = people.length > 1;

  return (
    <div className={`relative w-full rounded-[2.5rem] p-6 sm:p-10 shadow-lg overflow-hidden transition-all duration-500 ${isBirthdayToday ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gradient-to-br from-primary to-[#c04d35]'}`}>

      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>

      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Avatars */}
        <div className="flex items-center justify-center -space-x-4 mb-2">
          {people.map((p, index) => (
            <div key={p.id} className={`relative p-1 rounded-full z-${(people.length - index) * 10} ${isBirthdayToday ? 'bg-white/30 animate-bounce' : 'bg-white/20'}`} style={{ animationDelay: `${index * 0.1}s` }}>
              <img
                src={p.avatarUrl}
                alt={p.name}
                className={`${multiplePeople ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-28 h-28 sm:w-36 sm:h-36'} rounded-full object-cover border-4 border-white shadow-xl`}
              />
              {isBirthdayToday && (
                <div className="absolute -top-2 -right-2 bg-white text-orange-500 p-2 rounded-full shadow-lg animate-pop">
                  <Gift size={20} fill="currentColor" />
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
          {isBirthdayToday
            ? multiplePeople
            : `${formattedNames} • ${getNextBirthday(primaryPerson.birthDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}`}
        </p>
        {/* <p className="text-white/90 font-medium mt-2 text-lg">
          {isBirthdayToday
            ? multiplePeople
              ? `Bugün ${getFormattedAges()} yaşlarına giriyorlar! 🎉`
              : `Bugün ${getTurningAge(people[0].birthDate)} yaşına giriyor! 🎉`
            : `${getNextBirthday(primaryPerson.birthDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} tarihinde ${multiplePeople ? 'yeni yaşlarını kutluyorlar.' : `${getTurningAge(primaryPerson.birthDate)} yaşına giriyor.`}`}
        </p> */}

        <h1 className="text-white/90 font-medium mt-2 text-3xl">
          {isBirthdayToday ? `İyi ki Doğdun ${formattedNames}!` : `Doğum gününe kalan süre`}
        </h1>



        {!isBirthdayToday && (
          <div className="flex gap-3 sm:gap-4 mt-8 w-full justify-center max-w-lg">
            {[
              { val: timeLeft.days, label: 'GÜN' },
              { val: timeLeft.hours, label: 'SAAT' },
              { val: timeLeft.minutes, label: 'DAKİKA' },
              { val: timeLeft.seconds, label: 'SANİYE' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col flex-1 items-center">
                <div className="w-full aspect-square flex items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 mb-2">
                  <span className="text-2xl sm:text-4xl font-bold text-white tabular-nums">
                    {item.val.toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold tracking-widest text-white/70">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {isBirthdayToday && (
          <div className="mt-8 bg-white text-orange-600 px-8 py-3 rounded-full font-bold shadow-lg animate-pulse cursor-pointer hover:scale-105 transition-transform">
            🎂
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroCountdown;