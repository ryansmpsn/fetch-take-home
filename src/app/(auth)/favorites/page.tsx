'use client';

import { getDogs } from '@/api/routes';
import Button from '@/components/Button';
import DogCard from '@/components/DogCard';
import MatchModal from '@/components/MatchModal';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';
import { MAX_FAVORITES } from '@/lib/constants';
import { useDogStore } from '@/store/DogStore';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';
import { useShallow } from 'zustand/shallow';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 1rem;
`;

const Title = styled.h1``;

const Description = styled.h3`
  margin: 0;
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
  grid-template-columns: repeat(auto-fit, minmax(18.75rem, 1fr));
  gap: 1.25rem;
`;

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
          push('/');
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
      <Container>
        <Title>Favorites</Title>
        <Description>
          Review your favorite dogs and generate your perfect match below!
        </Description>
        {dogs && (
          <h2>
            {favorites.length} Favorite{favorites.length ? 's' : ''}
          </h2>
        )}

        {dogs ? (
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
        ) : (
          <>
            <p>Oh No! You have no favorite dogs.</p>
            <p>Head to the search page to choose from our furry friends.</p>
          </>
        )}

        <ButtonContainer>
          {removedFavorites.length && favorites.length < MAX_FAVORITES ? (
            <Button onClick={undoRemove}>Undo Remove</Button>
          ) : null}
          {favorites && (
            <Button onClick={() => setOpenModal(true)} disabled={!dogs}>
              Generate your perfect match!
            </Button>
          )}
        </ButtonContainer>
      </Container>
      {openModal && <MatchModal setClose={() => setOpenModal(false)} />}
    </>
  );
}
