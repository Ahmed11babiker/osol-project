import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss(),   // Use tailwindcss plugin
    autoprefixer(),  // Autoprefixer to add vendor prefixes
  ],
};
