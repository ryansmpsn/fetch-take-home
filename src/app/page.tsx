'use client';

import SearchResultsList from '@/components/SearchResultsList';
import { fetcher } from '@/api/ApiClient';
import { Dog } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Select, { MultiValue } from 'react-select';
import Link from 'next/link';

const fetchBreeds = async (): Promise<string[] | undefined> => {
  const data = await fetcher('/dogs/breeds', {
    method: 'GET'
  });

  return data as string[];
};

export default function Home() {
  const router = useRouter();
  const [selectedBreeds, setSelectedBreeds] = useState<Dog['breed'][]>([]); // State to store selected breeds

  const {
    data: breeds,
    error,
    isLoading,
    isError
  } = useQuery({
    queryFn: () =>
      fetchBreeds().catch((error) => {
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
    setSelectedBreeds(selectedValues);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Select Breeds</h1>
      <div>
        <Select
          options={breeds?.map((breed) => ({ value: breed, label: breed }))}
          isMulti
          onChange={handleBreedChange}
          value={selectedBreeds.map((breed) => ({
            value: breed,
            label: breed
          }))}
          placeholder="Select breeds..."
        />
      </div>
      <h1>Search Results</h1>
      <div>
        <h2>Select Favorite Dogs</h2>
        <div>
          <SearchResultsList />
        </div>
      </div>
      <div>
        <h2>Favorited Dogs: TODO Make this a separate page</h2>

        <Link href="/favorites">review favorited dogs</Link>
      </div>
    </div>
  );
}
