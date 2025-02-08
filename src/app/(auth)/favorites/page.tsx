'use client';

import MatchModal from '@/app/(auth)/favorites/components/MatchModal';
import useLockBodyScroll from '@/hooks/useLockBodyScroll';
import { useState } from 'react';
import styled from 'styled-components';
import FavoritesList from './components/FavoritesList';

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

export default function FavoritesPage() {
  const [openModal, setOpenModal] = useState(false);
  useLockBodyScroll(openModal);

  return (
    <>
      <Container>
        <Title>Your new best friend is waiting for you.</Title>
        <Description>
          Review your favorite pups and find your perfect match below! 🐶💕
        </Description>
        <FavoritesList openModal={() => setOpenModal(true)} />
      </Container>
      {openModal && <MatchModal setClose={() => setOpenModal(false)} />}
    </>
  );
}
