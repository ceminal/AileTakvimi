import React, { useState } from 'react';
import { Person, RELATIONSHIPS } from '../types';
import { UserPlus, X, Image as ImageIcon } from 'lucide-react';

interface AddPersonFormProps {
  onAdd: (person: Person) => void;
  onCancel: () => void;
}

const AddPersonForm: React.FC<AddPersonFormProps> = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [relationship, setRelationship] = useState(RELATIONSHIPS[0]);
  const [errors, setErrors] = useState<{name?: string, date?: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {name?: string, date?: string} = {};
    
    if (!name.trim()) newErrors.name = 'İsim gerekli';
    if (!date) newErrors.date = 'Tarih gerekli';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate a consistent pseudo-random avatar based on name
    const seed = encodeURIComponent(name);
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=c0aede,d1d4f9,b6e3f4`;

    const newPerson: Person = {
      id: crypto.randomUUID(),
      name: name.trim(),
      birthDate: date,
      relationship,
      avatarUrl
    };

    onAdd(newPerson);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-dark-card rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-white/5 transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-text dark:text-white">Yeni Kişi Ekle</h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-subtext dark:text-dark-subtext transition-colors">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Avatar Preview */}
        <div className="flex justify-center mb-2">
            <div className="w-24 h-24 rounded-full bg-gray-50 dark:bg-dark-bg border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center overflow-hidden">
                {name ? (
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=c0aede,d1d4f9,b6e3f4`} alt="Preview" />
                ) : (
                    <ImageIcon className="text-gray-300 dark:text-white/20" />
                )}
            </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-text dark:text-dark-text mb-2 ml-1">Ad Soyad</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: Ayşe Yılmaz"
            className={`w-full h-14 px-5 rounded-2xl bg-background dark:bg-dark-bg text-text dark:text-white border outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 dark:placeholder:text-gray-600 ${errors.name ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-transparent'}`}
          />
          {errors.name && <p className="text-red-500 text-xs ml-2 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-text dark:text-dark-text mb-2 ml-1">Doğum Tarihi</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`w-full h-14 px-5 rounded-2xl bg-background dark:bg-dark-bg text-text dark:text-white border outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.date ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-transparent'}`}
            style={{ colorScheme: 'light dark' }} 
          />
          {errors.date && <p className="text-red-500 text-xs ml-2 mt-1">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-text dark:text-dark-text mb-2 ml-1">Yakınlık Derecesi</label>
          <select 
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full h-14 px-5 rounded-2xl bg-background dark:bg-dark-bg text-text dark:text-white border border-transparent outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none"
          >
            {RELATIONSHIPS.map(rel => (
              <option key={rel} value={rel}>{rel}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className="mt-4 h-14 w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <UserPlus size={20} />
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default AddPersonForm;