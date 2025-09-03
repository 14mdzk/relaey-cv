import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { StrictMode } from 'react'
import { Providers } from './providers'
import '~/css/app.css'

const appName = import.meta.env.VITE_APP_NAME || 'Relaey'

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: name => resolvePageComponent(
    `./pages/${name}.tsx`,
    import.meta.glob('./pages/**/*.tsx'),
  ),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <StrictMode>
        <Providers>
          <App {...props} />
        </Providers>
      </StrictMode>
    )
  },
})