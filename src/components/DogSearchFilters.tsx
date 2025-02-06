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
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  margin: 0.25rem 0px;
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 1rem;

  @media ${({ theme: { device } }) => device.mobileL} {
    flex-direction: column;
  }
`;

const Label = styled.label``;

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
    const uniqueZipCodes = city
      ? Array.from(
          new Set(locations?.results.map((location) => location.zip_code))
        )
      : undefined;

    onChange({
      breeds: debouncedFilteredBreeds?.length
        ? debouncedFilteredBreeds
        : undefined,
      ageMin: debouncedAgeMin,
      ageMax: debouncedAgeMax,
      zipCodes: uniqueZipCodes ? uniqueZipCodes : undefined
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedFilteredBreeds,
    debouncedAgeMin,
    debouncedAgeMax,
    debouncedCity
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
        <h3>Filtering</h3>
        <InputGroup>
          <Label>Breeds:</Label>

          <StyledSelect
            options={breeds?.map((breed) => ({ value: breed, label: breed }))}
            isMulti
            onChange={handleBreedChange}
            placeholder="Select breeds..."
            isClearable
            isLoading={isLoadingBreeds}
          />
        </InputGroup>

        <InputRow>
          <InputGroup>
            <Label>Min Age:</Label>

            <Input
              type="number"
              placeholder="Min Age"
              value={ageMin ?? ''}
              min={0}
              max={25}
              onChange={(e) => {
                setAgeMin(
                  e.target.value ? parseInt(e.target.value) : undefined
                );
                setAgeMax((prev) =>
                  prev && prev < parseInt(e.target.value) ? undefined : prev
                );
              }}
            />
          </InputGroup>
          <InputGroup>
            <Label>Max Age:</Label>

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
          </InputGroup>
        </InputRow>
        <InputRow>
          <InputGroup>
            <Label>States:</Label>

            <StyledSelect
              options={STATES?.map((state) => ({
                value: state.abbreviation,
                label: state.name
              }))}
              onChange={handleStateChange}
              placeholder="Select States..."
              isLoading={isLoadingLocations}
              isClearable
            />
          </InputGroup>
          <InputGroup>
            <Label>City:</Label>

            <StyledSelect
              options={Array.from(
                new Set(locations?.results.map((location) => location.city))
              ).map((city) => ({ value: city, label: city }))}
              onChange={(newValue) => setCity(newValue?.value)}
              value={city ? { value: city, label: city } : null}
              placeholder="Select a City..."
              isClearable
              isLoading={isLoadingLocations}
            />
          </InputGroup>
        </InputRow>
      </Container>
    )
  );
}
