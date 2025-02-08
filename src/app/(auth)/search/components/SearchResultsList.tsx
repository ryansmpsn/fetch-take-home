'use client';

import { getDogIDs, getDogs } from '@/api/routes';
import { useDogStore } from '@/store/DogStore';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Pagination from './Pagination';
import { MAX_FAVORITES, PAGESIZE } from '@/lib/constants';
import { DogFilters, DogSortOption } from '@/types';
import DogCard from '../../components/DogCard';
import styled from 'styled-components';
import { LoadingCircle } from '../../../../components/LoadingCircle';

const DogGrid = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(auto-fill, minmax(15.625rem, 1fr));
  gap: 1.25rem;

  @media ${({ theme }) => theme.device.tablet} {
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  }
`;

type SearchResultsListProps = {
  page: number;
  setPage: (page: number) => void;
  filters: DogFilters;
  sortOption: DogSortOption;
};

export default function SearchResultsList({
  page,
  setPage,
  filters,
  sortOption
}: SearchResultsListProps) {
  const { push } = useRouter();

  const { favorites, addFavorite, removeFavorite } = useDogStore();

  const {
    data: dogIds,
    error: dogIdsError,
    isLoading: isDogIdsLoading,
    isError: isDogIDsError
  } = useQuery({
    queryFn: () =>
      getDogIDs(page, PAGESIZE, filters, sortOption).catch((error) => {
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
    return <LoadingCircle text={'Loading...'} />;
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
            isMatch={favorites.length === MAX_FAVORITES}
          />
        ))}
      </DogGrid>
      {dogIds && <Pagination page={page} setPage={setPage} dogIds={dogIds} />}
    </>
  );
}
