import React, { FC } from 'react';
import { CDSButton } from '@ciscodesignsystems/cds-react-button';
import { CDSEmptyState } from '@ciscodesignsystems/cds-react-empty-state';
import { Trans, useTranslation } from 'react-i18next';
import { CDSFlex } from '@ciscodesignsystems/cds-react-flex';

interface GenericErrorScreenProps {
  onRefresh: () => void;
  buttonSize?: 'md' | 'sm';
  illustrationSize?: string;
  refreshButtonId?: string;
}

const GenericErrorScreen: FC<GenericErrorScreenProps> = ({
  onRefresh,
  buttonSize,
  illustrationSize,
  refreshButtonId,
}) => {
  const { t } = useTranslation();

  const getTransData = (): string => {
    return (
      <Trans
        i18nKey="apiClients:emptyState.refreshMessage"
        components={{
          bold1: <b />,
        }}>
        {t('apiClients:emptyState.refreshMessage')}
      </Trans>
    ) as unknown as string;
  };

  return (
    <CDSEmptyState>
      {illustrationSize ? (
        <CDSEmptyState.Illustration
          variant="negative"
          style={{ height: illustrationSize }}
        />
      ) : (
        <CDSEmptyState.Illustration variant="negative" />
      )}

      <CDSFlex
        data-testid="error-comp"
        justify="center"
        direction="vertical">
        <CDSEmptyState.Title>
          {t('apiClients:emptyState.genericError')}
        </CDSEmptyState.Title>
        <CDSEmptyState.Message>{getTransData()}</CDSEmptyState.Message>
        <CDSFlex justify="center">
          {buttonSize ? (
            <CDSButton
              onClick={() => onRefresh()}
              data-testid={refreshButtonId}
              size={buttonSize}>
              {t('apiClients:emptyState.refresh')}
            </CDSButton>
          ) : (
            <CDSButton
              onClick={() => onRefresh()}
              data-testid={refreshButtonId}>
              {t('apiClients:emptyState.refresh')}
            </CDSButton>
          )}
        </CDSFlex>
      </CDSFlex>
    </CDSEmptyState>
  );
};

export default GenericErrorScreen;
