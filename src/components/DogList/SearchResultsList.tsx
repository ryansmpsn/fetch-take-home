'use client';

import { getDogIDs, getDogs } from '@/api/routes';
import { useDogStore } from '@/store/DogStore';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';
import Pagination from '../Pagination';
import { useState } from 'react';
import { PAGESIZE } from '@/lib/constants';
import { DogFilters, DogSortOption } from '@/types';

const size = PAGESIZE;

export default function SearchResultsList({
  filters,
  sortOption
}: {
  filters: DogFilters;
  sortOption: DogSortOption;
}) {
  const { push } = useRouter();
  const [page, setPage] = useState(0);

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
      getDogIDs(page, size, filters, sortOption).catch((error) => {
        if (error instanceof Error && error.message === 'Unauthorized') {
          push('/');
        }

        throw new Error('Failed to fetch getDogIDs. Please try again later.');
      }),
    queryKey: ['dogIds', page, filters, sortOption]
  });

  const dogIdsList = dogIds?.resultIds || [];

  const {
    data: dogs,
    isLoading: isDogsLoading,
    isError: isDogsError,
    error: dogsError
  } = useQuery({
    queryFn: () =>
      getDogs(dogIdsList).catch((error) => {
        if (error instanceof Error && error.message === 'Unauthorized') {
          push('/');
        }

        throw new Error('Failed to getDogs. Please try again later.');
      }),
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
  // TODO: add optimistic updates
  return (
    <>
      {dogs?.map((dog) => (
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
          {dog.name} - {dog.breed} - {dog.age}
        </p>
      ))}

      <Pagination
        page={page}
        setPage={setPage}
        dogIdsList={dogIdsList}
        size={size}
      />
    </>
  );
}
