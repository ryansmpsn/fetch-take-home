'use client';

import { DogFilters } from '@/types';
import Select, { MultiValue } from 'react-select';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getBreeds } from '@/api/dog';
import useDebounce from '@/hooks/useDebounce';

type DogListFiltersProps = {
  onChange: (filters: DogFilters) => void;
};

export default function DogListFilters({ onChange }: DogListFiltersProps) {
  const [filteredBreeds, setFilteredBreeds] = useState<DogFilters['breeds']>(
    []
  );

  const debouncedFilter = useDebounce(filteredBreeds);

  const router = useRouter();
  // TODO: Implement remaing filters
  useEffect(() => {
    onChange({ breeds: debouncedFilter?.length ? debouncedFilter : undefined });
  }, [debouncedFilter]);

  const {
    data: breeds,
    error,
    isLoading,
    isError
  } = useQuery({
    queryFn: () =>
      getBreeds().catch((error) => {
        if (error instanceof Error && error.message === 'Unauthorized') {
          router?.push('/login'); // Redirect to login if unauthorized
        }

        throw new Error('Failed to fetch breeds. Please try again later.');
      }),
    queryKey: ['breeds']
  });

  const handleBreedChange = (
    newValue: MultiValue<{ value: string; label: string }>
  ) => {
    const selectedValues = newValue
      ? newValue.map((option) => option.value)
      : [];
    setFilteredBreeds(selectedValues);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Select
        options={breeds?.map((breed) => ({ value: breed, label: breed }))}
        isMulti
        onChange={handleBreedChange}
        value={filteredBreeds?.map((breed) => ({
          value: breed,
          label: breed
        }))}
        placeholder="Select breeds..."
      />
    </>
  );
}
