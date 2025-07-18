import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ChakraProvider } from '@chakra-ui/react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
// 追加
const pages = import.meta.glob('./Pages/**/*.{jsx,tsx}');

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.tsx`, pages)
            .catch(() => resolvePageComponent(`./Pages/${name}.jsx`, pages)),
    // resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            // <ChakraProvider>
                <App {...props} />
            // </ChakraProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
