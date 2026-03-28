import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Solace Cloud CLI',
  tagline: '',
  favicon: 'img/Solace-Icon-2025-White-on-Green.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://dishantlangayan.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/sc-cli/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'dishantlangayan', // Usually your GitHub org/user name.
  projectName: 'sc-cli', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/dishantlangayan/dishantlangayan.github.io/blob/master/sc-cli/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Solace Cloud CLI',
      logo: {
        alt: 'CLI',
        src: 'img/Solace-Icon-2025-White-on-Green.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/dishantlangayan/dishantlangayan.github.io',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Get Started in 5 mins',
              to: '/docs/intro#fast-track',
            },
            {
              label: 'Getting Started',
              to: '/docs/category/getting-started',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Solace Community',
              href: 'https://community.solace.com/',
            },
            {
              label: 'Solace Dev',
              href: 'https://www.solace.dev/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Report Issues',
              to: 'https://github.com/SolaceLabs/solace-cloud-cli/issues',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/SolaceLabs/solace-cloud-cli',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Dishant Langayan.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
