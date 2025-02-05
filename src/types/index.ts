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
  next: string;
  resultIds: Dog['id'][];
  total: number;
}
