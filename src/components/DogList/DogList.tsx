'use client';

import SearchResultsList from '@/components/DogList/SearchResultsList';
import DogListFilters from './DogListFilters';
import { DogFilters, DogSortOption } from '@/types';
import { useState } from 'react';
import DogSortOptions from './DogSortOptions';

export default function DogList() {
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

  return (
    <div>
      <h1>Select Breeds</h1>
      <div>
        <DogListFilters
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
      <h1>Search Results</h1>
      <div>
        <h2>Select Favorite Dogs</h2>
        <div>
          <SearchResultsList filters={filters} sortOption={sortOption} />
        </div>
      </div>
    </div>
  );
}
