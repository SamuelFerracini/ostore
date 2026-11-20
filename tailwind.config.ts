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
        ivory: '#FFFAFA',
        mist: '#FBE8EC',
        field: '#FDF1F3',
        photo: '#FDF1F3',
        sky: '#F2D5DC',
        periwinkle: '#E8A3B4',
        royal: '#B5546E',
        navy: '#2E2428',
        muted: '#7A6A70',
        gold: { DEFAULT: '#C9A06A', text: '#8A5F36', soft: '#FBF0E6', line: '#EBD3C0', arch: '#E6C9A8', light: '#E0BC8A' },
        midnight: { DEFAULT: '#1E161A', surface: '#2A1E24', line: '#3A2A31' },
      },
      fontFamily: { display: ['"Cormorant Garamond"', 'serif'], 'display-th': ['"Noto Serif Thai"', 'serif'], sans: ['"IBM Plex Sans Thai"', 'system-ui', 'sans-serif'] },
    },
  },
};
