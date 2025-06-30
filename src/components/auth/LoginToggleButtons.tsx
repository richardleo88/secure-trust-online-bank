
import { Button } from '@/components/ui/button';
import { UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LoginToggleButtonsProps {
  isAdminLogin: boolean;
  onToggle: (isAdmin: boolean) => void;
}

const LoginToggleButtons = ({ isAdminLogin, onToggle }: LoginToggleButtonsProps) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4 flex gap-2">
      <Button
        type="button"
        variant={!isAdminLogin ? "default" : "outline"}
        className="flex-1"
        onClick={() => onToggle(false)}
      >
        {t('auth.userLogin')}
      </Button>
      <Button
        type="button"
        variant={isAdminLogin ? "default" : "outline"}
        className="flex-1 flex items-center gap-2"
        onClick={() => onToggle(true)}
      >
        <UserCheck className="h-4 w-4" />
        {t('auth.adminLogin')}
      </Button>
    </div>
  );
};

export default LoginToggleButtons;
