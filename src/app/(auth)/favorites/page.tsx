'use client';

import { getDogs } from '@/api/routes';
import Button from '@/components/Button';
import DogCard from '@/components/DogCard';
import { LoadingCircle } from '@/components/LoadingCircle';
import MatchModal from '@/components/MatchModal';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';
import { MAX_FAVORITES } from '@/lib/constants';
import { useDogStore } from '@/store/DogStore';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 1rem;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 70px;
  color: ${({ theme }) => theme.colors.primary};
  max-width: 420px;
`;

const Description = styled.h3`
  margin: 0px 0px 2rem;
  max-width: 37.5rem;
`;

const Count = styled.h4`
  margin: 0px 0px 0.25rem;
`;

const Warning = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0px;
  font-size: 1.25rem;
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
`;

export default function FavoritesPage() {
  const [openModal, setOpenModal] = useState(false);

  useLockBodyScroll(openModal);
  const { push } = useRouter();

  const { favorites, removedFavorites, undoRemove, removeFavorite } =
    useDogStore();

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
      <Container>
        <Title>Your new best friend is waiting for you.</Title>
        <Description>
          Review your favorite dogs and generate your perfect match below!
        </Description>
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
            <Button
              onClick={() => setOpenModal(true)}
              disabled={(dogs?.length ?? 0) < 1}
            >
              Generate your perfect match!
            </Button>
          )}
        </ButtonContainer>
      </Container>
      {openModal && <MatchModal setClose={() => setOpenModal(false)} />}
    </>
  );
}
