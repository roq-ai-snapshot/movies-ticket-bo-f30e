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
  Center,
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
import { FunctionComponent, useState, useRef, useMemo } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { useRoqClient, useTheaterFindFirst } from 'lib/roq';
import * as RoqTypes from 'lib/roq/types';
import { convertQueryToPrismaUtil } from 'lib/utils';
import { theaterValidationSchema } from 'validationSchema/theaters';
import { TheaterInterface } from 'interfaces/theater';

function TheaterEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const roqClient = useRoqClient();
  const queryParams = useMemo(
    () =>
      convertQueryToPrismaUtil(
        {
          id,
        },
        'theater',
      ),
    [id],
  );
  const { data, error, isLoading, mutate } = useTheaterFindFirst(queryParams, {}, { disabled: !id });
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: TheaterInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await roqClient.theater.update({
        data: values as RoqTypes.theater,
        where: {
          id,
        },
      });
      mutate(updated);
      resetForm();
      router.push('/theaters');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<TheaterInterface>({
    initialValues: data,
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
              label: 'Update Theater',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Theater
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(TheaterEditPage);
