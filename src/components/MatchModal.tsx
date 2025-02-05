'use client';

import useOutsideClick from '@/hooks/useOutsideClick';
import type { PropsWithChildren } from 'react';
import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import Image from 'next/image';
import { getDogMatch, getDogs } from '@/api/dog';
import { useDogStore } from '@/store/DogStore';
import { useShallow } from 'zustand/shallow';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const Backdrop = styled.div`
  position: absolute;
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
  padding: 2rem 5rem;
  border-radius: 8px;
  color: black;

  background: white;
  border: 1px solid black;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  padding: 0.5rem;
  top: 0.5rem;
  right: 0.5rem;
  height: 2rem;
  width: 2rem;

  &:hover,
  &:focus {
    background-color: black;
  }
`;

const CloseIcon = styled(Image)`
  width: 100%;
  height: auto;
  cursor: pointer;
  object-fit: contain;
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

  const { favorites } = useDogStore(
    useShallow((state) => ({
      favorites: state.favorites
    }))
  );

  const {
    data: dogMatchId,
    isLoading: isMatchIdLoading,
    isError: isMatchIdError,
    error: matchIdError
  } = useQuery({
    queryFn: () =>
      getDogMatch(favorites).catch((error) => {
        if (error instanceof Error && error.message === 'Unauthorized') {
          push('/login');
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
    isError: isMatchError,
    error: matchError
  } = useQuery({
    queryFn: () =>
      getDogs([matchId]).catch((error) => {
        if (error instanceof Error && error.message === 'Unauthorized') {
          push('/login');
        }

        throw new Error('Failed to getDogs. Please try again later.');
      }),
    queryKey: ['dogs', matchId],
    enabled: !!matchId
  });

  if (isMatchIdLoading || isMatchLoading) {
    return <div>Loading dogs...</div>;
  }

  if (isMatchError || isMatchIdError) {
    return (
      <div>
        Error: {matchIdError?.message} {matchError?.message}
      </div>
    );
  }

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

          <div>
            <h1>Perfect Match</h1>
            <div>
              <h2>
                {dogMatch?.map((dog) => (
                  <div key={dog.id}>
                    <p>{dog.name}</p>
                    <p>{dog.age}</p>
                    <p>{dog.breed}</p>
                    <p>{dog.zip_code}</p>
                  </div>
                ))}
              </h2>
            </div>
          </div>
        </Container>
      </Backdrop>,
      mainContainer
    )
  );
}

export default MatchModal;
