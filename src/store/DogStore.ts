import { MAX_FAVORITES } from '@/lib/constants';
import { Dog } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface DogStore {
  favorites: Dog['id'][];
  removedFavorites: Dog['id'][];
  addFavorite: (dogId: Dog['id']) => void;
  removeFavorite: (dogId: Dog['id']) => void;
  undoRemove: () => void;
}

export const useDogStore = create<DogStore>()(
  persist(
    (set) => ({
      favorites: [],
      removedFavorites: [],
      addFavorite: (dogId: Dog['id']) =>
        set((state: DogStore) => {
          if (state.favorites.length >= MAX_FAVORITES) return state;
          return {
            favorites: [...state.favorites, dogId],
            removedFavorites: state.removedFavorites.filter(
              (fav) => fav !== dogId
            )
          };
        }),
      removeFavorite: (dogId: Dog['id']) =>
        set((state: DogStore) => ({
          favorites: state.favorites.filter((fav) => fav !== dogId),
          removedFavorites: [...state.removedFavorites, dogId]
        })),
      undoRemove: () =>
        set((state: DogStore) => {
          if (state.removedFavorites.length === 0) return state;
          const lastFavoriteId =
            state.removedFavorites[state.removedFavorites.length - 1];
          return {
            favorites: [...state.favorites, lastFavoriteId],
            removedFavorites: state.removedFavorites.slice(0, -1)
          };
        })
    }),
    {
      name: 'dog-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
