import { ShowInterface } from 'interfaces/show';
import { GetQueryInterface } from 'interfaces';

export interface MovieInterface {
  id?: string;
  title: string;
  genre: string;
  duration: number;
  rating: number;
  release_date: any;
  director: string;
  created_at?: any;
  updated_at?: any;
  show?: ShowInterface[];

  _count?: {
    show?: number;
  };
}

export interface MovieGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  genre?: string;
  director?: string;
}
