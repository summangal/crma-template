import { useEffect, useState } from 'react';
import { CDSCard } from '@ciscodesignsystems/cds-react-card';
import { CDSFlex } from '@ciscodesignsystems/cds-react-flex';
import { CDSHeading } from '@ciscodesignsystems/cds-react-heading';
import { CDSText } from '@ciscodesignsystems/cds-react-text';
import { CDSDivider } from '@ciscodesignsystems/cds-react-divider';
import { CDSSpinner } from '@ciscodesignsystems/cds-react-spinner';
import { t } from 'i18next';

const LoadAfter5Second = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(interval);
  }, []);

  return (
    <CDSCard
      interactive
      className="card-width">
      <CDSHeading>{t('Load after 5 second')}</CDSHeading>
      <CDSDivider />
      <CDSFlex
        direction="vertical"
        gap="lg">
        {loading ? (
          <CDSSpinner />
        ) : (
          <CDSFlex
            direction="vertical"
            gap="xxs">
            <CDSText
              size="xxs"
              weight="semi-bold">
              {t(
                'Tempora dolorum tenetur vero quos repellat. Perferendis provident laboriosam. Facere natus maiores maiores quisquam id necessitatibus. Officiis doloremque culpa consectetur numquam fugit ipsum iure a. Nihil aliquid accusamus. Harum dolorum officiis in temporibus. Ut nam aperiam quaerat fuga dolorem. Quis neque quasi a maiores adipis',
              )}
            </CDSText>
            {/* <CDSViewSwitcher
                disabled={false}
                fullWidth={false}
                size="md"
                options={themes}
                onChange={value => setSelectedTheme(value as CDSThemeType)}
                value={selectedTheme || ''}
              /> */}
          </CDSFlex>
        )}
      </CDSFlex>
    </CDSCard>
  );
};

export default LoadAfter5Second;
