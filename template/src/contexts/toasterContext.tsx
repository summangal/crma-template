/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  react/jsx-no-constructed-context-values */
import React, {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
} from 'react';
import {
  CDSToastObject,
  CDSToasterStatus,
  useToast,
} from '@ciscodesignsystems/cds-react-toaster';
import { useTranslation } from 'react-i18next';

interface IToasterContext {
  addToastToList: (value: IToastData) => void;
  toastList: CDSToastObject[];
}

interface IToasterContextProviderProps {
  children: React.ReactNode;
}

interface IToastData {
  toastTitle?: ReactNode;
  toastDescription?: ReactNode;
  context?: string;
  error?: any;
  status?: CDSToasterStatus;
  timeout?: number;
  errorDescription?: boolean;
}

const defaultValue = {
  addToastToList: () => {},
  toastList: [],
} as IToasterContext;

const ToasterContext = createContext<IToasterContext>(defaultValue);

export default ToasterContext;

export const ToasterContextProvider = (
  props: IToasterContextProviderProps,
): ReactElement => {
  const { children } = props;
  const { t } = useTranslation();
  const { toasts, addToast, deleteToast } = useToast();
  const addToastToList = ({
    status,
    toastTitle,
    context,
    error,
    toastDescription,
    timeout,
    errorDescription,
  }: IToastData): void => {
    let title: any = toastTitle ?? '';
    let description: any = toastDescription ?? '';
    if (error) {
      const errorStatus = error?.response?.status;
      title = t([
        `apiErrors:apiErrors:title:${context}:${errorStatus}`,
        `apiErrors:apiErrors:title:${context}:genericError`,
      ]);
      if (errorDescription) {
        description = t([
          `apiErrors:apiErrors:title:${context}:${errorStatus}`,
          `apiErrors:apiErrors:title:${context}:genericError`,
        ]);
      }
    }

    const toast = {
      id: `${Date.now()}${crypto.randomUUID()}`,
      title,
      description,
      status,
      timeout,
    };
    // removing  all persisted toast notification
    if (toasts.length > 0) {
      toasts.forEach(el => {
        deleteToast(el.id);
      });
    } else {
      addToast(toast);
    }
  };

  return (
    <ToasterContext.Provider
      value={{
        addToastToList,
        toastList: toasts,
      }}>
      {children}
    </ToasterContext.Provider>
  );
};

export const useToasterNotification = (): IToasterContext => {
  const { toastList, addToastToList } = useContext(ToasterContext);
  return {
    toastList,
    addToastToList,
  };
};
