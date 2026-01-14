import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import ChatWidget from '@/Components/ChatWidget';
import { Toaster } from 'react-hot-toast';
import { route as ziggyRoute } from 'ziggy-js';

// Create a route function that uses Ziggy config from Laravel's @routes directive
const route = (name, params, absolute) => {
    return ziggyRoute(name, params, absolute, window.Ziggy);
};

window.route = route;

createInertiaApp({
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster position="top-right" />
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
