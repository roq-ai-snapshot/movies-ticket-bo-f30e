import { UserInterface } from 'interfaces/user';
import { ShowInterface } from 'interfaces/show';
import { GetQueryInterface } from 'interfaces';

export interface BookingInterface {
  id?: string;
  user_id: string;
  show_id: string;
  number_of_tickets: number;
  total_price: number;
  booking_time?: any;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  show?: ShowInterface;
  _count?: {};
}

export interface BookingGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  show_id?: string;
}
