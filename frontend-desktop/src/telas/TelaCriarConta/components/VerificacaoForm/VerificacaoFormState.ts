import { useRef } from 'react';

interface VerificacaoFormStateProps {
  codeDigits: string[];
  setCodeDigits: (digits: string[]) => void;
}

export function useVerificacaoForm({ codeDigits, setCodeDigits }: VerificacaoFormStateProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return;

    const newDigits = [...codeDigits];
    newDigits[index] = value.substring(value.length - 1);
    setCodeDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const newDigits = pasteData.split('');
      setCodeDigits(newDigits);
      inputRefs.current[5]?.focus();
    }
  };

  return {
    inputRefs,
    handleDigitChange,
    handleKeyDown,
    handlePaste
  };
}
