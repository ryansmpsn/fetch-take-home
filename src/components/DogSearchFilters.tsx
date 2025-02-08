'use client';

import { DogFilters } from '@/types';
import { MultiValue } from 'react-select';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getBreeds } from '@/api/routes';
import useDebounce from '@/hooks/useDebounce';
import { SearchLocations } from '@/api/routes';
import { STATES } from '@/lib/constants';
import useIsMounted from '@/hooks/useIsMounted';
import { Input } from './Input';
import styled from 'styled-components';
import { StyledSelect } from './StyledSelect';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AgeRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 0.5rem;

  @media ${({ theme: { device } }) => device.mobileL} {
    flex-direction: column;
  }
`;

const LocationRow = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;

  @media ${({ theme: { device } }) => device.laptopL} {
    flex-direction: row;
  }

  @media ${({ theme: { device } }) => device.tablet} {
    flex-direction: column;
  }
`;

type DogSearchFiltersProps = {
  onChange: (filters: DogFilters) => void;
};

export default function DogSearchFilters({ onChange }: DogSearchFiltersProps) {
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

  const { data: breeds, isLoading: isLoadingBreeds } = useQuery({
    queryFn: () =>
      getBreeds().catch((error) => {
        if (error instanceof Error && error.message === 'Unauthorized') {
          push('/');
        }

        throw new Error('Failed to getBreeds. Please try again later.');
      }),
    queryKey: ['breeds']
  });

  const { data: locations, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations', debouncedCity, debouncedStates],
    queryFn: () =>
      SearchLocations({
        city: debouncedCity,
        states: debouncedStates,
        size: 10000
      }).catch((error) => {
        if (error instanceof Error && error.message === 'Unauthorized') {
          push('/');
        }

        throw new Error('Failed to getBreeds. Please try again later.');
      }),
    enabled: !!debouncedStates?.length
  });

  useEffect(() => {
    if (isLoadingLocations) return;

    const uniqueZipCodes =
      city && locations?.results.length
        ? [...new Set(locations.results.map(({ zip_code }) => zip_code))]
        : undefined;

    const zipCodes = uniqueZipCodes?.length === 0 ? ['1'] : uniqueZipCodes;

    onChange({
      breeds: debouncedFilteredBreeds?.length
        ? debouncedFilteredBreeds
        : undefined,
      ageMin: debouncedAgeMin,
      ageMax: debouncedAgeMax,
      zipCodes
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedFilteredBreeds,
    debouncedAgeMin,
    debouncedAgeMax,
    debouncedCity,
    locations,
    isLoadingLocations
  ]);

  const handleBreedChange = (
    newValue: MultiValue<{ value: string; label: string }>
  ) => {
    const selectedValues = newValue
      ? newValue.map((option) => option.value)
      : [];
    setFilteredBreeds(selectedValues);
  };

  const handleStateChange = (newValue: { value: string } | null) => {
    setStates(newValue ? [newValue.value] : undefined);
    setCity(undefined);
  };

  return (
    isMounted && (
      <Container>
        <StyledSelect
          options={breeds?.map((breed) => ({ value: breed, label: breed }))}
          isMulti
          onChange={handleBreedChange}
          placeholder="Select Breeds..."
          isClearable
          isLoading={isLoadingBreeds}
        />

        <AgeRow>
          <Input
            type="number"
            placeholder="Min Age"
            value={ageMin ?? ''}
            min={0}
            max={25}
            onChange={(e) => {
              setAgeMin(e.target.value ? parseInt(e.target.value) : undefined);
              setAgeMax((prev) =>
                prev && prev < parseInt(e.target.value) ? undefined : prev
              );
            }}
          />

          <Input
            type="number"
            placeholder="Max Age"
            value={ageMax ?? ''}
            min={ageMin ? ageMin : 1}
            max={25}
            onChange={(e) =>
              setAgeMax(
                Number.isNaN(parseInt(e.target.value))
                  ? undefined
                  : parseInt(e.target.value)
              )
            }
          />
        </AgeRow>
        <LocationRow>
          <StyledSelect
            options={STATES?.map((state) => ({
              value: state.abbreviation,
              label: state.name
            }))}
            onChange={handleStateChange}
            placeholder="Select State..."
            isLoading={isLoadingLocations}
            isClearable
          />

          <StyledSelect
            options={Array.from(
              new Set(locations?.results.map((location) => location.city))
            ).map((city) => ({ value: city, label: city }))}
            onChange={(newValue) => setCity(newValue?.value)}
            value={city ? { value: city, label: city } : null}
            placeholder="Select City..."
            isClearable
            isLoading={isLoadingLocations}
            isDisabled={!debouncedStates?.length}
          />
        </LocationRow>
      </Container>
    )
  );
}
