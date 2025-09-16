import { createRoot } from 'react-dom/client'
import './index.css'
import { persistor, store } from './store/store.tsx'
import { Provider } from 'react-redux'
import AppRouter from './router/AppRouter.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from "./tanstack/QueryClient.tsx"
import { PersistGate } from 'redux-persist/integration/react'


createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </PersistGate>
  </Provider>
)
