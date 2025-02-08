'use client';

import useOutsideClick from '@/hooks/useOutsideClick';
import type { PropsWithChildren } from 'react';
import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Image from 'next/image';
import { getDogMatch, getDogs } from '@/api/routes';
import { useDogStore } from '@/store/DogStore';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import DogCard from '../../components/DogCard';
import { LoadingCircle } from '../../../../components/LoadingCircle';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(74, 77, 80, 0.8);
  z-index: 1000;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
`;

const Container = styled.dialog`
  display: flex;
  position: relative;
  padding: 2rem;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
  border: none;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  padding: 0.5rem;
  top: 0.5rem;
  right: 0.5rem;
  height: 2rem;
  width: 2rem;
  border: none;
  border-radius: 4px;
  transition: opacity 0.25s;
  background-color: transparent;

  &:hover,
  &:focus {
    opacity: 0.5;
  }
`;

const CloseIcon = styled(Image)`
  width: 100%;
  height: auto;
  cursor: pointer;
  object-fit: contain;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 60px;
  color: ${({ theme }) => theme.colors.primary};
  max-width: 420px;
  margin-top: 0px;
`;

export type ModalType = {
  setClose: () => void;
  closeButton?: boolean;
};

function MatchModal({ setClose, ...props }: PropsWithChildren<ModalType>) {
  const containerRef = useRef<HTMLDialogElement>(null);

  const { push } = useRouter();

  useOutsideClick(containerRef, setClose);

  const mainContainer = document.querySelector('#main');

  const { favorites } = useDogStore();

  const {
    data: dogMatchId,
    isLoading: isMatchIdLoading,
    isError: isMatchIdError,
    isFetching: isMatchIdFetching,
    error: matchIdError
  } = useQuery({
    queryFn: () =>
      getDogMatch(favorites).catch((error) => {
        if (error instanceof Error && error.message === 'Unauthorized') {
          push('/');
        }
        throw new Error('Failed to getDogMatch. Please try again later.');
      }),
    queryKey: ['dog', 'match', ...favorites],
    enabled: !!favorites
  });

  const matchId = dogMatchId?.match || '';

  const {
    data: dogMatch,
    isLoading: isMatchLoading,
    isFetching: isMatchFetching,
    isError: isMatchError,
    error: matchError
  } = useQuery({
    queryFn: () =>
      getDogs([matchId]).catch((error) => {
        if (error instanceof Error && error.message === 'Unauthorized') {
          push('/');
        }
        throw new Error('Failed to getDogs. Please try again later.');
      }),
    queryKey: ['dogs', matchId],
    enabled: !!matchId,
    refetchOnMount: false, // Prevents refetching immediately on mount
    staleTime: Infinity // Consider data fresh to avoid flashing
  });

  return (
    mainContainer &&
    createPortal(
      <Backdrop>
        <Container {...props} ref={containerRef}>
          <CloseButton onClick={setClose}>
            <CloseIcon
              width={20}
              height={20}
              src={'/close.svg'}
              alt="close button"
            />
          </CloseButton>
          {isMatchIdLoading ||
          isMatchLoading ||
          isMatchIdFetching ||
          isMatchFetching ? (
            <LoadingCircle text={'Loading...'} />
          ) : isMatchError || isMatchIdError ? (
            <div>
              Error: {matchIdError?.message} {matchError?.message}
            </div>
          ) : (
            dogMatch && (
              <div>
                <Title>Meet {dogMatch[0].name}!</Title>
                <DogCard dog={dogMatch[0]} isMatch />
              </div>
            )
          )}
        </Container>
      </Backdrop>,
      mainContainer
    )
  );
}

export default MatchModal;
