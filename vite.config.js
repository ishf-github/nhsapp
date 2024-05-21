import { sveltekit } from '@sveltejs/kit/vite';
import preprocess from 'svelte-preprocess';

export default {
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $components: '/src/components',
      $lib: '/src/lib',
      $mailer: '/src/mailer.js', // Alias for mailer.js
    }
  },
  preprocess: preprocess(),
};
