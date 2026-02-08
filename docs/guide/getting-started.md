# Getting Started

Welcome to the Fast Track Vue Component Library! This guide will help you install and start using the components in your projects.

## Prerequisites

- Node.js 16 or higher
- Vue 3
- TypeScript (optional but recommended)

## Installation

Install the component library using your preferred package manager:

```bash
npm install @fasttrack-solutions/vue-components-lib
```

Or with yarn:

```bash
yarn add @fasttrack-solutions/vue-components-lib
```

Or with pnpm:

```bash
pnpm add @fasttrack-solutions/vue-components-lib
```

## NPM Registry Setup

If the package is hosted on a private registry, configure your `.npmrc` file:

```
@fasttrack-solutions:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Replace `YOUR_GITHUB_TOKEN` with your GitHub personal access token.

## Basic Usage

### Composition API (Script Setup)

```vue
<template>
  <FTButton primary>Click me</FTButton>
</template>

<script setup lang="ts">
  import { FTButton } from '@fasttrack-solutions/vue-components-lib';
</script>
```

### Options API

```vue
<template>
  <FTButton primary>Click me</FTButton>
</template>

<script>
  import { FTButton } from '@fasttrack-solutions/vue-components-lib';

  export default {
    components: { FTButton }
  }
</script>
```

## Importing Styles

Import the design tokens in your application's main CSS file or in your Vue component:

```css
@import '@fasttrack-solutions/vue-components-lib/dist/tokens.css';
```

Or use SCSS:

```scss
@import '@fasttrack-solutions/vue-components-lib/dist/tokens.scss';
```

## TypeScript Support

The library is fully typed with TypeScript. All components include complete type definitions for better IDE support and type safety.

## Next Steps

Explore the component library:
- Check out individual [Components](/components/alert) for usage examples
- Review the [Design Tokens](/tokens/colors) for color, typography, and semantic token documentation
- Learn about [Tests](/guide/tests) to ensure quality in your implementation
