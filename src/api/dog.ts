import { fetcher } from './ApiClient';
import { Dog, GetDogIdsResponse } from '@/types';

export const getDogIDs = async (): Promise<GetDogIdsResponse | undefined> => {
  const data = await fetcher('/dogs/search', {
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
): Promise<Dog | undefined> => {
  const data = await fetcher('/dogs/match', {
    method: 'POST',
    body: JSON.stringify(dogIds)
  });

  return data as Dog;
};
