import { fetcher } from './ApiClient';
import {
  Dog,
  DogFilters,
  DogSortOption,
  GetDogIdsResponse,
  GetDogMatchResponse,
  LoginFormBody,
  SearchLocationFilters,
  SearchLocationResponse
} from '@/types';

// Auth
export const login = async ({ name, email }: LoginFormBody): Promise<void> => {
  await fetcher('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ name, email })
  });
};

export const logout = async (): Promise<void> => {
  await fetcher('/auth/logout', {
    method: 'POST'
  });
};

// Dog
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
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map((v) => `${key}=${encodeURIComponent(v)}`)
        : value
        ? [`${key}=${encodeURIComponent(value)}`]
        : []
    )
    .join('&');

  const sortParams = `&sort=${sortOption.field}:${sortOption.order}`;

  const data = await fetcher(
    `/dogs/search?size=${size}&from=${
      page * size + '&' + filterParams + sortParams
    }`,
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
  favoritesDogIds: string[]
): Promise<GetDogMatchResponse | undefined> => {
  const data = await fetcher('/dogs/match', {
    method: 'POST',
    body: JSON.stringify(favoritesDogIds)
  });

  return data as GetDogMatchResponse;
};

// Location
export const GetLocations = async (
  zipCodes: string[]
): Promise<SearchLocationResponse> => {
  const data = await fetcher('/locations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(zipCodes)
  });

  return data as SearchLocationResponse;
};

export const SearchLocations = async (
  filters: SearchLocationFilters
): Promise<SearchLocationResponse> => {
  const data = await fetcher('/locations/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(filters)
  });

  return data as SearchLocationResponse;
};
