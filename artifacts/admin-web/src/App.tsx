import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
  Redirect,
} from 'wouter';

import { AuthProvider, useAuth } from '@/providers/auth-provider';
import DashboardLayout from '@/components/dashboard-layout';

import LoginPage from '@/pages/login';
import DashboardOverview from '@/pages/dashboard';
import UsersPage from '@/pages/users';
import DisputesPage from '@/pages/disputes';
import TagsPage from '@/pages/tags';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-slate-950"></div>;
  }
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/">
          {() => <Redirect to="/dashboard" />}
        </Route>
        
        <Route path="/login" component={LoginPage} />
        
        <Route path="/dashboard">
          {() => <ProtectedRoute component={DashboardOverview} />}
        </Route>
        <Route path="/dashboard/users">
          {() => <ProtectedRoute component={UsersPage} />}
        </Route>
        <Route path="/dashboard/disputes">
          {() => <ProtectedRoute component={DisputesPage} />}
        </Route>
        <Route path="/dashboard/tags">
          {() => <ProtectedRoute component={TagsPage} />}
        </Route>

        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
