import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { useRoqClient } from 'lib/roq';
import * as RoqTypes from 'lib/roq/types';

import { theaterValidationSchema } from 'validationSchema/theaters';
import { TheaterInterface } from 'interfaces/theater';

function TheaterCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const roqClient = useRoqClient();
  const handleSubmit = async (values: TheaterInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await roqClient.theater.create({ data: values as RoqTypes.theater });
      resetForm();
      router.push('/theaters');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<TheaterInterface>({
    initialValues: {
      name: '',
      location: '',
      seating_capacity: 0,
      number_of_screens: 0,
      parking_facility: false,
      food_court: false,
    },
    validationSchema: theaterValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Theaters',
              link: '/theaters',
            },
            {
              label: 'Create Theater',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Theater
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.name}
            label={'Name'}
            props={{
              name: 'name',
              placeholder: 'Name',
              value: formik.values?.name,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.location}
            label={'Location'}
            props={{
              name: 'location',
              placeholder: 'Location',
              value: formik.values?.location,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Seating Capacity"
            formControlProps={{
              id: 'seating_capacity',
              isInvalid: !!formik.errors?.seating_capacity,
            }}
            name="seating_capacity"
            error={formik.errors?.seating_capacity}
            value={formik.values?.seating_capacity}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('seating_capacity', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Number Of Screens"
            formControlProps={{
              id: 'number_of_screens',
              isInvalid: !!formik.errors?.number_of_screens,
            }}
            name="number_of_screens"
            error={formik.errors?.number_of_screens}
            value={formik.values?.number_of_screens}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('number_of_screens', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl
            id="parking_facility"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.parking_facility}
          >
            <FormLabel htmlFor="switch-parking_facility">Parking Facility</FormLabel>
            <Switch
              id="switch-parking_facility"
              name="parking_facility"
              onChange={formik.handleChange}
              value={formik.values?.parking_facility ? 1 : 0}
            />
            {formik.errors?.parking_facility && <FormErrorMessage>{formik.errors?.parking_facility}</FormErrorMessage>}
          </FormControl>

          <FormControl
            id="food_court"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.food_court}
          >
            <FormLabel htmlFor="switch-food_court">Food Court</FormLabel>
            <Switch
              id="switch-food_court"
              name="food_court"
              onChange={formik.handleChange}
              value={formik.values?.food_court ? 1 : 0}
            />
            {formik.errors?.food_court && <FormErrorMessage>{formik.errors?.food_court}</FormErrorMessage>}
          </FormControl>

          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/theaters')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'theater',
    operation: AccessOperationEnum.CREATE,
  }),
)(TheaterCreatePage);
