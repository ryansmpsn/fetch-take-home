'use client';

import { getDogs } from '@/api/routes';
import Button from '@/components/Button';
import DogCard from '@/app/(auth)/components/DogCard';
import { LoadingCircle } from '@/components/LoadingCircle';
import { MAX_FAVORITES } from '@/lib/constants';
import { useDogStore } from '@/store/DogStore';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const Count = styled.h4`
  margin: 0px 0px 0.25rem;
`;

const Warning = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem auto;

  text-align: center;
  gap: 1rem;
  font-size: 1.25rem;
  max-width: 18.75rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 2rem 0px;
`;

const DogGrid = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(auto-fill, minmax(15.625rem, 1fr));
  gap: 1.25rem;

  @media ${({ theme }) => theme.device.tablet} {
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  }
`;

interface FavoritesListProps {
  openModal: () => void;
}

export default function FavoritesList({ openModal }: FavoritesListProps) {
  const { favorites, removedFavorites, undoRemove, removeFavorite } =
    useDogStore();
  const { push } = useRouter();

  const {
    data: dogs,
    isFetching,
    isError,
    error
  } = useQuery({
    queryFn: () =>
      getDogs(favorites).catch((error) => {
        if (error instanceof Error && error.message === 'Unauthorized') {
          push('/');
        }

        throw new Error('Failed to getDogs. Please try again later.');
      }),
    queryKey: ['dogs', ...favorites],
    enabled: !!favorites
  });

  return (
    <>
      {dogs && (
        <Count>
          {favorites.length} Favorite{favorites.length === 1 ? '' : 's'}
        </Count>
      )}

      {dogs?.length !== 0 ? (
        isFetching ? (
          <LoadingCircle text={'Loading...'} />
        ) : isError ? (
          <p>Error: {error?.message}</p>
        ) : (
          <DogGrid>
            {dogs?.map((dog) => (
              <DogCard
                key={dog.id}
                onClick={() => removeFavorite(dog.id)}
                dog={dog}
                isFavorite
              />
            ))}
          </DogGrid>
        )
      ) : (
        <Warning>
          <p>Oh No! You have no favorite dogs.</p>
          <p>Visit the search page to choose from our furry friends.</p>
        </Warning>
      )}

      <ButtonContainer>
        {removedFavorites.length && favorites.length < MAX_FAVORITES ? (
          <Button onClick={undoRemove}>Undo Remove</Button>
        ) : null}
        {favorites && (
          <Button onClick={openModal} disabled={(dogs?.length ?? 0) < 1}>
            Generate your perfect match!
          </Button>
        )}
      </ButtonContainer>
    </>
  );
}
