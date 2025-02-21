import { useEffect, useState } from 'react';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';

const queryClient = new QueryClient();

export default function App() {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setApiStatus(data.status);
      } catch (error) {
        setApiStatus('API connection failed');
      }
    };

    checkApiHealth();
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="fixed top-4 right-4 bg-background p-2 rounded-md shadow">
            API Status: {apiStatus}
          </div>
          <Index />
        </TooltipProvider>
      </QueryClientProvider>
      <Toaster />
      <Sonner />
    </>
  );
}
