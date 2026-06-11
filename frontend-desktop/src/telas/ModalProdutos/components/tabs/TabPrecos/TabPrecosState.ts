import { formatCurrency } from '../../../../../utils/formatters';

interface UseTabPrecosProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function useTabPrecos({ formData, setFormData }: UseTabPrecosProps) {
  const handlePriceChange = (channelId: number, rawValue: string) => {
    const newPrices = [...formData.prices];
    const index = newPrices.findIndex((p: any) => p.channel === channelId);
    if (index >= 0) {
      newPrices[index].price = formatCurrency(rawValue);
    }
    setFormData({ ...formData, prices: newPrices });
  };

  const handleVisibilityChange = (channelId: number, checked: boolean) => {
    const newPrices = [...formData.prices];
    const index = newPrices.findIndex((p: any) => p.channel === channelId);
    if (index >= 0) {
      newPrices[index].isVisible = checked;
    }
    setFormData({ ...formData, prices: newPrices });
  };

  return {
    handlePriceChange,
    handleVisibilityChange
  };
}
