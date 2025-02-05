'use client';

import { getDogIDs, getDogs } from '@/api/dog';
import { useDogStore } from '@/store/DogStore';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

export default function SearchResultsList() {
  const router = useRouter();

  const { favorites, addFavorite, removeFavorite } = useDogStore(
    useShallow((state) => ({
      favorites: state.favorites,
      addFavorite: state.addFavorite,
      removeFavorite: state.removeFavorite
    }))
  );

  const {
    data: dogIds,
    error: dogIdsError,
    isLoading: isDogIdsLoading,
    isError: isDogIDsError
  } = useQuery({
    queryFn: () =>
      getDogIDs().catch((error) => {
        if (error instanceof Error && error.message === 'Unauthorized') {
          router?.push('/login'); // Redirect to login if unauthorized
        }

        throw new Error('Failed to fetch results. Please try again later.');
      }),
    queryKey: ['dogIds']
  });

  const dogIdsList = dogIds?.resultIds || [];

  const {
    data: dogs,
    isLoading: isDogsLoading,
    isError: isDogsError,
    error: dogsError
  } = useQuery({
    queryFn: () => getDogs(dogIdsList),
    queryKey: ['dogs', ...dogIdsList],
    enabled: !!dogIds?.resultIds
  });

  const handleDogClick = (dogId: string) => {
    if (favorites.includes(dogId)) {
      removeFavorite(dogId);
    } else {
      addFavorite(dogId);
    }
  };

  if (isDogIdsLoading || isDogsLoading) {
    return <div>Loading dogs...</div>;
  }

  if (isDogIDsError || isDogsError) {
    return (
      <div>
        Error: {dogIdsError?.message} {dogsError?.message}
      </div>
    );
  }
  // TODO: semantic html li ul etc..
  return dogs?.map((dog) => (
    <p
      key={dog.id}
      onClick={() => handleDogClick(dog.id)}
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
  ));
}
