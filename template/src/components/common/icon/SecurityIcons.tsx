import duoSecurityLogo from '../../../assets/duo-logo.svg';
import googleAuthenticatorLogo from '../../../assets/google-authenticator.svg';

export const DuoSecurityLogo = () => {
  return (
    <img
      src={duoSecurityLogo}
      alt="Duo Security"
      data-testid="duo-security"
    />
  );
};
export const GoogleAuthenticatorLogo = () => {
  return (
    <img
      src={googleAuthenticatorLogo}
      alt="Google Authenticator"
      data-testid="google-authenticator"
    />
  );
};
