import React, { ReactElement, useEffect } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CDSToaster } from '@ciscodesignsystems/cds-react-toaster';
import { I18nextProvider } from 'react-i18next';
import i18n from '../locales/i18n';
import {
  ToasterContextProvider,
  useToasterNotficiation,
} from './toasterContext';

const error = {
  response: {
    status: '400',
    data: {
      message: 'issue occured',
    },
  },
};
const Toaster = (): ReactElement => {
  const { toastList } = useToasterNotficiation();
  return (
    <span>
      <CDSToaster
        toastList={toastList}
        placement="top-right"
        className="toasts-message custom-font-family"
      />
      <p>Toastercontext</p>
    </span>
  );
};

const RandomComponentOne = (): ReactElement => {
  const { addToastToList } = useToasterNotficiation();
  useEffect(() => {
    addToastToList({
      toastDescription: 'Orbital API Client successfully deleted..',
      status: 'warning',
      timeout: -1,
    });
  }, []);
  return (
    <span>
      <p>random component</p>
    </span>
  );
};

const RandomComponentTwo = (): ReactElement => {
  const { addToastToList } = useToasterNotficiation();
  useEffect(() => {
    addToastToList({
      error,
      context: 'API_CLIENT',
      status: 'warning',
      timeout: -1,
    });
  }, []);
  return (
    <span>
      <p>random component</p>
    </span>
  );
};

test('ToasterContextProvider shows value from provider', () => {
  const { queryByText } = render(
    <ToasterContextProvider>
      <Toaster />
    </ToasterContextProvider>,
  );
  expect(queryByText('Toastercontext'));
});

test('ToasterContextProvider shows value from provider', () => {
  const { queryByText } = render(
    <ToasterContextProvider>
      <Toaster />
      <RandomComponentOne />
    </ToasterContextProvider>,
  );
  expect(queryByText('Orbital API Client successfully deleted..')).toBeTruthy();
});
test('ToasterContextProvider shows value from provider with error context', () => {
  const { getAllByText } = render(
    <I18nextProvider i18n={i18n}>
      <ToasterContextProvider>
        <Toaster />
        <RandomComponentTwo />
      </ToasterContextProvider>
    </I18nextProvider>,
  );
  expect(
    getAllByText('There was an error processing your request.'),
  ).toBeTruthy();
});
