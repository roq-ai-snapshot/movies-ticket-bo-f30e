import * as yup from 'yup';

export const theaterValidationSchema = yup.object().shape({
  name: yup.string().required(),
  location: yup.string().required(),
  seating_capacity: yup.number().integer().required(),
  number_of_screens: yup.number().integer().required(),
  parking_facility: yup.boolean().required(),
  food_court: yup.boolean().required(),
});
