# Font Awesome Integration

The Fast Track Vue Component Library includes support for Font Awesome icons. Many components can accept Font Awesome icons through the `icon` prop.

## Installation

First, install Font Awesome and Vue's integration:

```bash
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/vue-fontawesome@latest
```

## Setup

In your main Vue application file, configure Font Awesome:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas)

const app = createApp(App)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#app')
```

## Using Icons in Components

Many Fast Track components accept icons. For example, with the Button component:

```vue
<template>
  <FTButton icon="home">Home</FTButton>
  <FTButton icon="heart">Favorite</FTButton>
  <FTButton icon="cog">Settings</FTButton>
</template>

<script setup lang="ts">
  import { FTButton } from '@fasttrack-solutions/vue-components-lib';
</script>
```

## Icon Props

Components that support icons typically have these props:

- `icon` - The Font Awesome icon name (e.g., 'home', 'heart', 'cog')
- `iconOnly` - Display only the icon without text
- `iconSmall` - Use a smaller icon size
- `iconMedium` - Use a medium icon size
- `iconBig` - Use a larger icon size

## Available Icons

Font Awesome Free includes hundreds of solid icons. Some commonly used examples:

- Navigation: `home`, `arrow-left`, `arrow-right`, `menu`
- Actions: `check`, `times`, `edit`, `trash`, `download`
- Status: `exclamation-triangle`, `info-circle`, `question-circle`, `check-circle`
- User: `user`, `users`, `user-circle`, `sign-out`

Visit [Font Awesome Icons](https://fontawesome.com/icons) to browse the full library.
