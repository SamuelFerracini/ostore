import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  theme: {
    extend: {
      screens: {
        xs: '320px',
        '3xl': '1920px',
      },
      fontFamily: { display: ['"Cormorant Garamond"', 'serif'], 'display-th': ['"Noto Serif Thai"', 'serif'], sans: ['"IBM Plex Sans Thai"', 'system-ui', 'sans-serif'] },
      colors: {
        'alizarin-crimson': {
          '50': '#fff0f2',
          '100': '#ffdde2',
          '200': '#ffc1ca',
          '300': '#ff95a5',
          '400': '#ff5972',
          '500': '#ff2646',
          '600': '#fc062a',
          '700': '#e60022',
          '800': '#af051e',
          '900': '#900c20',
          '950': '#50000c',
        },
        ivory: '#FCFAF5',
        mist: '#E9EFFA',
        field: '#F1F5FC',
        photo: '#F7F7F7',
        sky: '#C9D7EF',
        periwinkle: '#8FA9DC',
        royal: '#2B4C7E',
        navy: '#1D2B45',
        muted: '#5A6782',
        gold: { DEFAULT: '#C5A253', text: '#8C6B1F', soft: '#FBF4E2', line: '#E8DDC2', arch: '#E3D3A6', light: '#E2C783' },
        midnight: { DEFAULT: '#0E1729', surface: '#16223A', line: '#2A3A57' },
      },
      fontFamily: { display: ['"Cormorant Garamond"', 'serif'], 'display-th': ['"Noto Serif Thai"', 'serif'], sans: ['"IBM Plex Sans Thai"', 'system-ui', 'sans-serif'] },
    },
  },
};
