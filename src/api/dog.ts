import { fetcher } from './ApiClient';
import { Dog, GetDogIdsResponse, GetDogMatchResponse } from '@/types';

export const getDogIDs = async (
  page: number,
  size: number
): Promise<GetDogIdsResponse | undefined> => {
  const data = await fetcher(`/dogs/search?size=${size}&from=${page * size}`, {
    method: 'GET'
  });

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
