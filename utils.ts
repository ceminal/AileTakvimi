import { Person } from './types';

// Get the date of the next birthday
export const getNextBirthday = (birthDateStr: string): Date => {
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  
  const currentYear = today.getFullYear();
  const nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
  
  // Set times to midnight for accurate day comparison
  today.setHours(0, 0, 0, 0);
  nextBirthday.setHours(0, 0, 0, 0);

  // If birthday has passed this year, it's next year
  if (nextBirthday < today) {
    nextBirthday.setFullYear(currentYear + 1);
  }

  return nextBirthday;
};

// Calculate age they will turn
export const getTurningAge = (birthDateStr: string): number => {
  const birthDate = new Date(birthDateStr);
  const nextBday = getNextBirthday(birthDateStr);
  return nextBday.getFullYear() - birthDate.getFullYear();
};

// Check if today is the birthday
export const isToday = (birthDateStr: string): boolean => {
  const today = new Date();
  const nextBday = getNextBirthday(birthDateStr);
  return (
    today.getDate() === nextBday.getDate() &&
    today.getMonth() === nextBday.getMonth() &&
    today.getFullYear() === nextBday.getFullYear()
  );
};

// Sort people by nearest birthday
export const sortPeopleByNextBirthday = (people: Person[]): Person[] => {
  return [...people].sort((a, b) => {
    const dateA = getNextBirthday(a.birthDate);
    const dateB = getNextBirthday(b.birthDate);
    return dateA.getTime() - dateB.getTime();
  });
};

// Get days remaining
export const getDaysRemaining = (birthDateStr: string): number => {
  const today = new Date();
  const nextBday = getNextBirthday(birthDateStr);
  
  // Reset hours
  today.setHours(0,0,0,0);
  nextBday.setHours(0,0,0,0);

  const diffTime = Math.abs(nextBday.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  return diffDays;
};

// Format date for display (e.g., 25 Ekim)
export const formatDatePretty = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' }).format(date);
};