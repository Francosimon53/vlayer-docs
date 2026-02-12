import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'vlayer',
  tagline: 'HIPAA Compliance Scanning for Healthcare Apps',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.vlayer.app',
  baseUrl: '/',

  organizationName: 'vlayer',
  projectName: 'verification-layer',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/vlayer/verification-layer/tree/main/docs/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/vlayer-social-card.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'vlayer',
      logo: {
        alt: 'vlayer Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://play.vlayer.app',
          label: '▶ Playground',
          position: 'left',
        },
        {
          href: 'https://vlayer.app',
          label: 'Website',
          position: 'right',
        },
        {
          href: 'https://github.com/vlayer/verification-layer',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/',
            },
            {
              label: 'CLI Reference',
              to: '/cli',
            },
            {
              label: 'Configuration',
              to: '/configuration',
            },
          ],
        },
        {
          title: 'Scanners',
          items: [
            {
              label: 'PHI Detection',
              to: '/scanners/phi',
            },
            {
              label: 'Encryption',
              to: '/scanners/encryption',
            },
            {
              label: 'Audit Logging',
              to: '/scanners/audit',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Playground',
              href: 'https://play.vlayer.app',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/vlayer/verification-layer',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/vlayer',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/vlayer',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} vlayer. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml'],
    },
    algolia: undefined,
  } satisfies Preset.ThemeConfig,
};

export default config;
