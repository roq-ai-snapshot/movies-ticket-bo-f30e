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

import { showValidationSchema } from 'validationSchema/shows';
import { MovieInterface } from 'interfaces/movie';
import { TheaterInterface } from 'interfaces/theater';
import { ShowInterface } from 'interfaces/show';

function ShowCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const roqClient = useRoqClient();
  const handleSubmit = async (values: ShowInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await roqClient.show.create({ data: values as RoqTypes.show });
      resetForm();
      router.push('/shows');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ShowInterface>({
    initialValues: {
      show_time: new Date(new Date().toDateString()),
      ticket_price: 0,
      available_seats: 0,
      movie_id: (router.query.movie_id as string) ?? null,
      theater_id: (router.query.theater_id as string) ?? null,
    },
    validationSchema: showValidationSchema,
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
              label: 'Shows',
              link: '/shows',
            },
            {
              label: 'Create Show',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Show
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="show_time" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Show Time
            </FormLabel>
            <DatePicker
              selected={formik.values?.show_time ? new Date(formik.values?.show_time) : null}
              onChange={(value: Date) => formik.setFieldValue('show_time', value)}
            />
          </FormControl>

          <NumberInput
            label="Ticket Price"
            formControlProps={{
              id: 'ticket_price',
              isInvalid: !!formik.errors?.ticket_price,
            }}
            name="ticket_price"
            error={formik.errors?.ticket_price}
            value={formik.values?.ticket_price}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('ticket_price', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Available Seats"
            formControlProps={{
              id: 'available_seats',
              isInvalid: !!formik.errors?.available_seats,
            }}
            name="available_seats"
            error={formik.errors?.available_seats}
            value={formik.values?.available_seats}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('available_seats', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<MovieInterface>
            formik={formik}
            name={'movie_id'}
            label={'Select Movie'}
            placeholder={'Select Movie'}
            fetcher={() => roqClient.movie.findManyWithCount({})}
            labelField={'title'}
          />
          <AsyncSelect<TheaterInterface>
            formik={formik}
            name={'theater_id'}
            label={'Select Theater'}
            placeholder={'Select Theater'}
            fetcher={() => roqClient.theater.findManyWithCount({})}
            labelField={'name'}
          />
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
              onClick={() => router.push('/shows')}
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
    entity: 'show',
    operation: AccessOperationEnum.CREATE,
  }),
)(ShowCreatePage);
