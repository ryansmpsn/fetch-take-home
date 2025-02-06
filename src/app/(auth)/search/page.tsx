'use client';

import { DogFilters, DogSortOption } from '@/types';
import { useState } from 'react';
import DogSearchFilters from '@/components/DogSearchFilters';
import DogSortOptions from '@/components/DogSortOptions';
import SearchResultsList from '@/components/SearchResultsList';
import styled from 'styled-components';
import { useDogStore } from '@/store/DogStore';
import { useShallow } from 'zustand/shallow';
import { MAX_FAVORITES } from '@/lib/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 1rem;
`;

const Title = styled.h1``;

const Description = styled.h3`
  margin: 0px;
`;

const Count = styled.h4`
  margin: 0px;
`;

const SearchContainer = styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;

  @media ${({ theme: { device } }) => device.laptopL} {
    display: flex;
    flex-direction: column;
  }
`;

const SearchResults = styled.div``;

export default function SearchPage() {
  const [filters, setFilters] = useState<DogFilters>({
    breeds: undefined,
    zipCodes: undefined,
    ageMin: undefined,
    ageMax: undefined
  });

  const [sortOption, setSortOption] = useState<DogSortOption>({
    field: 'breed',
    order: 'asc'
  });

  const { favorites } = useDogStore(
    useShallow((state) => ({
      favorites: state.favorites
    }))
  );

  return (
    <Container>
      <Title>Search</Title>
      <Description>
        Select {MAX_FAVORITES} dogs to match with. You can filter by breed, age,
        and location.
      </Description>

      <SearchContainer>
        <div>
          <DogSearchFilters
            onChange={(newFilters) =>
              setFilters({
                breeds: newFilters?.breeds,
                zipCodes: newFilters?.zipCodes,
                ageMin: newFilters?.ageMin,
                ageMax: newFilters?.ageMax
              })
            }
          />
          <DogSortOptions
            onChange={(newSortOption: DogSortOption) =>
              setSortOption({
                field: newSortOption?.field || 'breed',
                order: newSortOption?.order || 'asc'
              })
            }
          />
        </div>
        <SearchResults>
          <h2>Search Results</h2>
          <Count>
            {favorites.length} / {MAX_FAVORITES} selected
          </Count>

          <SearchResultsList filters={filters} sortOption={sortOption} />
        </SearchResults>
      </SearchContainer>
    </Container>
  );
}
