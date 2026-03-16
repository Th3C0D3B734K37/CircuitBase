import MainApp from '@/components/MainApp';
import { AppProvider } from '@/components/AppContext';

export default function Page() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
