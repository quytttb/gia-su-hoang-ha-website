import { useTheme } from '../../contexts/ThemeContext';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Sun, Moon, Laptop } from 'lucide-react';

const themeOptions = [
  { value: 'system', label: 'Hệ thống', icon: <Laptop className="w-4 h-4 mr-2" /> },
  { value: 'light', label: 'Sáng', icon: <Sun className="w-4 h-4 mr-2" /> },
  { value: 'dark', label: 'Tối', icon: <Moon className="w-4 h-4 mr-2" /> },
];

const themeIcon = {
  system: <Laptop className="w-5 h-5" />,
  light: <Sun className="w-5 h-5" />,
  dark: <Moon className="w-5 h-5" />,
};

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger
        className="w-14 h-8 p-0 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 flex items-center justify-center"
        aria-label="Chọn chế độ hiển thị"
      >
        <SelectValue aria-label={theme}>{themeIcon[theme]}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="min-w-[140px]">
        {themeOptions.map(opt => (
          <SelectItem key={opt.value} value={opt.value} className="flex items-center">
            {opt.icon}
            <span>{opt.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ThemeToggle;
