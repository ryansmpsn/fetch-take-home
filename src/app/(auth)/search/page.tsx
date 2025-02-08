'use client';

import { DogFilters, DogSortOption } from '@/types';
import { useState } from 'react';
import DogSearchFilters from '@/components/DogSearchFilters';
import DogSortOptions from '@/components/DogSortOptions';
import SearchResultsList from '@/components/SearchResultsList';
import styled from 'styled-components';
import { useDogStore } from '@/store/DogStore';
import { MAX_FAVORITES } from '@/lib/constants';

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

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: min-content;
  box-shadow: 4px 4px 10px 0px rgba(158, 158, 158, 0.25);
  border-radius: 0.5rem;
  gap: 0.5rem;
  padding: 1.25rem;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SearchResults = styled.div``;

export default function SearchPage() {
  const [page, setPage] = useState(0);

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

  const { favorites } = useDogStore();

  return (
    <Container>
      <Title>Meet our buddies.</Title>
      <Description>
        Select {MAX_FAVORITES} dogs to match with. You can filter by breed, age,
        and city. Then go to the Favorites page to generate your match.
      </Description>

      <SearchContainer>
        <FilterContainer>
          <DogSearchFilters
            onChange={(newFilters: DogFilters) => {
              setFilters({
                breeds: newFilters?.breeds,
                zipCodes: newFilters?.zipCodes,
                ageMin: newFilters?.ageMin,
                ageMax: newFilters?.ageMax
              });
              setPage(0);
            }}
          />
          <DogSortOptions
            onChange={(newSortOption: DogSortOption) =>
              setSortOption({
                field: newSortOption?.field || 'breed',
                order: newSortOption?.order || 'asc'
              })
            }
          />
        </FilterContainer>
        <SearchResults>
          <Count>
            {favorites.length} / {MAX_FAVORITES} selected
          </Count>

          <SearchResultsList
            page={page}
            setPage={setPage}
            filters={filters}
            sortOption={sortOption}
          />
        </SearchResults>
      </SearchContainer>
    </Container>
  );
}
