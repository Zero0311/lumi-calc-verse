
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import Calculator from '@/components/Calculator';

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
        <header className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Scientific Calculator</h1>
          <ThemeToggle />
        </header>
        
        <main className="flex-1 p-4">
          <Calculator />
        </main>
        
        <footer className="p-4 text-center text-sm text-muted-foreground">
          Scientific Calculator © 2025
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Index;
