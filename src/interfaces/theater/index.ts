import { ShowInterface } from 'interfaces/show';
import { GetQueryInterface } from 'interfaces';

export interface TheaterInterface {
  id?: string;
  name: string;
  location: string;
  seating_capacity: number;
  number_of_screens: number;
  parking_facility: boolean;
  food_court: boolean;
  created_at?: any;
  updated_at?: any;
  show?: ShowInterface[];

  _count?: {
    show?: number;
  };
}

export interface TheaterGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  location?: string;
}
