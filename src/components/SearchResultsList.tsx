'use client';

import { getDogIDs, getDogs } from '@/api/routes';
import { useDogStore } from '@/store/DogStore';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/shallow';
import Pagination from './Pagination';
import { useState } from 'react';
import { MAX_FAVORITES, PAGESIZE } from '@/lib/constants';
import { DogFilters, DogSortOption } from '@/types';
import DogCard from './DogCard';
import styled from 'styled-components';

const size = PAGESIZE;

const DogGrid = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(auto-fit, minmax(18.75rem, 1fr));
  gap: 1.25rem;
`;

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
      if (favorites.length === MAX_FAVORITES) {
        push('/favorites');
      }
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

  return (
    <>
      <DogGrid>
        {dogs?.map((dog) => (
          <DogCard
            key={dog.id}
            dog={dog}
            onClick={() => handleDogClick(dog.id)}
            isFavorite={favorites.includes(dog.id)}
            disabled={favorites.length === MAX_FAVORITES}
          />
        ))}
      </DogGrid>

      <Pagination
        page={page}
        setPage={setPage}
        dogIdsList={dogIdsList}
        size={size}
        total={dogIds?.total || 0}
      />
    </>
  );
}
