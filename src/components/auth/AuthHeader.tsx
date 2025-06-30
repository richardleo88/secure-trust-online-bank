
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AuthHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Shield className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">{t('auth.bankName')}</h1>
      <p className="text-gray-600 mt-2">{t('auth.professionalBanking')}</p>
    </div>
  );
};

export default AuthHeader;
