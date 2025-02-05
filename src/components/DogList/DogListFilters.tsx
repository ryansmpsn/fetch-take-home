'use client';

import { DogFilters } from '@/types';
import Select, { MultiValue } from 'react-select';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getBreeds } from '@/api/dog';
import useDebounce from '@/hooks/useDebounce';
import { SearchLocations } from '@/api/location';
import { STATES } from '@/lib/constants';
import useIsMounted from '@/hooks/useIsMounted';

type DogListFiltersProps = {
  onChange: (filters: DogFilters) => void;
};

export default function DogListFilters({ onChange }: DogListFiltersProps) {
  const [filteredBreeds, setFilteredBreeds] = useState<DogFilters['breeds']>(
    []
  );
  const [ageMin, setAgeMin] = useState<number | undefined>(undefined);
  const [ageMax, setAgeMax] = useState<number | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [states, setStates] = useState<string[] | undefined>(undefined);
  const debouncedFilteredBreeds = useDebounce(filteredBreeds);
  const debouncedStates = useDebounce(states);
  const debouncedCity = useDebounce(city);
  const debouncedAgeMin = useDebounce(ageMin);
  const debouncedAgeMax = useDebounce(ageMax);
  const { push } = useRouter();
  const isMounted = useIsMounted();

  const { data: breeds } = useQuery({
    queryFn: () =>
      getBreeds().catch((error) => {
        if (error instanceof Error && error.message === 'Unauthorized') {
          push('/login');
        }

        throw new Error('Failed to getBreeds. Please try again later.');
      }),
    queryKey: ['breeds']
  });

  const { data: locations } = useQuery({
    queryKey: ['locations', debouncedCity, debouncedStates],
    queryFn: () =>
      SearchLocations({
        city: debouncedCity,
        states: debouncedStates,
        size: 10000
      }).catch((error) => {
        if (error instanceof Error && error.message === 'Unauthorized') {
          push('/login');
        }

        throw new Error('Failed to getBreeds. Please try again later.');
      }),
    enabled: !!debouncedStates?.length
  });

  useEffect(() => {
    const uniqueZipCodes = Array.from(
      new Set(locations?.results.map((location) => location.zip_code))
    );

    onChange({
      breeds: debouncedFilteredBreeds?.length
        ? debouncedFilteredBreeds
        : undefined,
      ageMin: debouncedAgeMin,
      ageMax: debouncedAgeMax,
      zipCodes: uniqueZipCodes ? uniqueZipCodes : undefined
    });
  }, [
    debouncedFilteredBreeds,
    debouncedAgeMin,
    debouncedAgeMax,
    locations?.results
  ]);

  const handleBreedChange = (
    newValue: MultiValue<{ value: string; label: string }>
  ) => {
    const selectedValues = newValue
      ? newValue.map((option) => option.value)
      : [];
    setFilteredBreeds(selectedValues);
  };

  const handleStateChange = (
    newValue: MultiValue<{ value: string; label: string }>
  ) => {
    const selectedValues = newValue
      ? newValue.map((option) => option.value)
      : [];
    setStates(selectedValues);
    setCity(undefined);
  };

  return (
    isMounted && (
      <>
        <Select
          options={breeds?.map((breed) => ({ value: breed, label: breed }))}
          isMulti
          onChange={handleBreedChange}
          placeholder="Select breeds..."
        />
        <input
          type="number"
          placeholder="Min Age"
          value={ageMin ?? ''}
          onChange={(e) =>
            setAgeMin(e.target.value ? parseInt(e.target.value) : undefined)
          }
        />
        <input
          type="number"
          placeholder="Max Age"
          value={ageMax ?? ''}
          onChange={(e) =>
            setAgeMax(e.target.value ? parseInt(e.target.value) : undefined)
          }
        />

        <Select
          options={STATES?.map((state) => ({
            value: state.abbreviation,
            label: state.name
          }))}
          isMulti
          onChange={handleStateChange}
          placeholder="Select States..."
        />

        <Select
          options={Array.from(
            new Set(locations?.results.map((location) => location.city))
          ).map((city) => ({ value: city, label: city }))}
          onChange={(newValue) => setCity(newValue?.value)}
          value={city ? { value: city, label: city } : null}
          placeholder="Show dogs in city..."
          isClearable
        />
      </>
    )
  );
}
