'use client';

import { getDogs } from '@/api/dog';
import MatchModal from '@/components/MatchModal';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';
import { useDogStore } from '@/store/DogStore';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

export default function FavoritesPage() {
  const [openModal, setOpenModal] = useState(false);

  useLockBodyScroll(openModal);
  const { push } = useRouter();

  const { favorites, removedFavorites, undoRemove, removeFavorite } =
    useDogStore(
      useShallow((state) => ({
        favorites: state.favorites,
        removedFavorites: state.removedFavorites,
        undoRemove: state.undoRemove,
        removeFavorite: state.removeFavorite
      }))
    );

  const {
    data: dogs,
    isLoading,
    isError,
    error
  } = useQuery({
    queryFn: () =>
      getDogs(favorites).catch((error) => {
        if (error instanceof Error && error.message === 'Unauthorized') {
          push('/login');
        }

        throw new Error('Failed to getDogs. Please try again later.');
      }),
    queryKey: ['dogs', ...favorites],
    enabled: !!favorites
  });

  if (isLoading) {
    return <div>Loading dogs...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <>
      <div>
        <h1>Favorites page</h1>
        <h2>
          You have {favorites.length} Favorite{favorites.length ? 's' : ''}
        </h2>
        {removedFavorites.length && (
          <button onClick={undoRemove}>undo remove</button>
        )}
        {dogs?.map((dog) => (
          <p
            key={dog.id}
            onClick={() => removeFavorite(dog.id)}
            style={{
              cursor: 'pointer',
              color: favorites.includes(dog.id) ? 'lightblue' : 'green',
              padding: '8px',
              margin: '4px',
              borderRadius: '4px'
            }}
          >
            {dog.name}
          </p>
        ))}
        <Link href="/">Back to Search</Link>
        {favorites ? (
          <button onClick={() => setOpenModal(true)}>
            Generate your perfect match
          </button>
        ) : (
          <p>Go to the search page to add favorites</p>
        )}
      </div>
      {openModal && <MatchModal setClose={() => setOpenModal(false)} />}
    </>
  );
}
