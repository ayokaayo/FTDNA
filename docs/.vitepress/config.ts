import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'FT DNA',
  description: 'Fast Track Component library',
  appearance: 'dark',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: false,
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Github', link: 'https://github.com/fasttrack-solutions/vue-components-lib' }
    ],
    sidebar: [
      {
        text: 'POC Basics',
        items: [
          { text: 'What We Built & Why', link: '/guide/poc-basics' },
          { text: 'Developer Guide', link: '/guide/dev-guide' }
        ]
      },
      {
        text: 'Introduction',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Font Awesome', link: '/guide/fontawesome' },
          { text: 'Tests', link: '/guide/tests' }
        ]
      },
      {
        text: 'Design Tokens',
        items: [
          { text: 'Colors', link: '/tokens/colors' },
          { text: 'Typography', link: '/tokens/typography' },
          { text: 'Semantic Tokens', link: '/tokens/semantic' }
        ]
      },
      {
        text: 'Components',
        items: [
          { text: 'Alert', link: '/components/alert' },
          { text: 'Button', link: '/components/button' },
          { text: 'Checkbox <span class="poc-ready">POC</span>', link: '/components/checkbox' },
          { text: 'Confirm', link: '/components/confirm' },
          { text: 'Datepicker', link: '/components/datepicker' },
          { text: 'Floating Label', link: '/components/floatinglabel' },
          { text: 'Input', link: '/components/input' },
          { text: 'Select', link: '/components/select' },
          { text: 'Modal', link: '/components/modal' },
          { text: 'Navbar', link: '/components/navbar' },
          { text: 'Options Selector', link: '/components/optionsselector' },
          { text: 'Paging <span class="poc-ready">POC</span>', link: '/components/paging' },
          { text: 'Panel', link: '/components/panel' },
          { text: 'Radio <span class="poc-ready">POC</span>', link: '/components/radio' },
          { text: 'Sliding Panel', link: '/components/slidingpanel' },
          { text: 'Split View', link: '/components/splitview' },
          { text: 'Spinner', link: '/components/spinner' },
          { text: 'Table', link: '/components/table' },
          { text: 'Tag <span class="poc-ready">POC</span>', link: '/components/tag' },
          { text: 'Tabs', link: '/components/tabs' },
          { text: 'Tooltip <span class="poc-ready">POC</span>', link: '/components/tooltip' }
        ]
      },
      {
        text: 'Composables',
        items: [
          { text: 'Notification', link: '/composables/notification' }
        ]
      },
      {
        text: 'System',
        items: [
          { text: 'Component Status', link: '/components/status' },
          { text: 'Contributing', link: '/contributing' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/fasttrack-solutions/vue-components-lib' }
    ],
    footer: {
      copyright: 'Copyright © Fast Track Solutions'
    }
  }
})
