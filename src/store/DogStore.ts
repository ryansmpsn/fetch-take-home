import { Dog } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface DogStore {
  favorites: Dog['id'][];
  addFavorite: (dogId: Dog['id']) => void;
  removeFavorite: (dogId: Dog['id']) => void;
}

export const useDogStore = create<DogStore>()(
  persist(
    (set) => ({
      favorites: [],
      //   TODO: handle more than 100 favs
      addFavorite: (dogId: Dog['id']) =>
        set((state: DogStore) => ({ favorites: [...state.favorites, dogId] })),
      removeFavorite: (dogId: Dog['id']) =>
        set((state: DogStore) => ({
          favorites: state.favorites.filter((fav) => fav !== dogId)
        }))
    }),
    {
      name: 'dog-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
