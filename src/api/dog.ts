import { fetcher } from './ApiClient';
import {
  Dog,
  DogFilters,
  DogSortOption,
  GetDogIdsResponse,
  GetDogMatchResponse
} from '@/types';

export const getBreeds = async (): Promise<string[] | undefined> => {
  const data = await fetcher('/dogs/breeds', {
    method: 'GET'
  });

  return data as string[];
};

export const getDogIDs = async (
  page: number,
  size: number,
  filters: DogFilters,
  sortOption: DogSortOption
): Promise<GetDogIdsResponse | undefined> => {
  const filterParams = Object.entries(filters)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `&${key}=${v}`).join('');
      }
      return value ? `&${key}=${value}` : '';
    })
    .join('');

  const sortParams = `&sort=${sortOption.field}:${sortOption.order}`;

  const data = await fetcher(
    `/dogs/search?size=${size}&from=${page * size + filterParams + sortParams}`,
    {
      method: 'GET'
    }
  );

  return data as GetDogIdsResponse;
};

export const getDogs = async (dogIds: string[]): Promise<Dog[] | undefined> => {
  const data = await fetcher('/dogs', {
    method: 'POST',
    body: JSON.stringify(dogIds)
  });

  return data as Dog[];
};

export const getDogMatch = async (
  dogIds: string[]
): Promise<GetDogMatchResponse | undefined> => {
  const data = await fetcher('/dogs/match', {
    method: 'POST',
    body: JSON.stringify(dogIds)
  });

  return data as GetDogMatchResponse;
};
