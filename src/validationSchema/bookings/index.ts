import * as yup from 'yup';

export const bookingValidationSchema = yup.object().shape({
  number_of_tickets: yup.number().integer().required(),
  total_price: yup.number().integer().required(),
  booking_time: yup.date().required(),
  user_id: yup.string().nullable().required(),
  show_id: yup.string().nullable().required(),
});
