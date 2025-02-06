export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface Location {
  zip_code: string;
  latitude: Coordinates['lat'];
  longitude: Coordinates['lon'];
  city: string;
  state: string;
  county: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface LoginFormBody {
  name: string;
  email: string;
}

export interface GetDogIdsResponse {
  prev: string;
  next: string;
  resultIds: Dog['id'][];
  total: number;
}

export interface GetDogMatchResponse {
  match: Dog['id'];
}

export interface DogFilters {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
}

export interface DogSortOption {
  field: 'breed' | 'name' | 'age';
  order: 'asc' | 'desc';
}
export interface SearchLocationFilters {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: Coordinates;
    left?: Coordinates;
    bottom?: Coordinates;
    right?: Coordinates;
    bottom_left?: Coordinates;
    top_left?: Coordinates;
  };
  size?: number;
  from?: number;
}

export interface SearchLocationResponse {
  total: number;
  results: Location[];
}
