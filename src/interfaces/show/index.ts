import { BookingInterface } from 'interfaces/booking';
import { MovieInterface } from 'interfaces/movie';
import { TheaterInterface } from 'interfaces/theater';
import { GetQueryInterface } from 'interfaces';

export interface ShowInterface {
  id?: string;
  movie_id: string;
  theater_id: string;
  show_time: any;
  ticket_price: number;
  available_seats: number;
  created_at?: any;
  updated_at?: any;
  booking?: BookingInterface[];
  movie?: MovieInterface;
  theater?: TheaterInterface;
  _count?: {
    booking?: number;
  };
}

export interface ShowGetQueryInterface extends GetQueryInterface {
  id?: string;
  movie_id?: string;
  theater_id?: string;
}
