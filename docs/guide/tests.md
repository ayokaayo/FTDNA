# Testing

The Fast Track Vue Component Library includes comprehensive test coverage for all components and composables. This guide helps you understand and write tests for components in your applications.

## Testing Setup

The library uses Vitest and Vue Test Utils for testing. To set up testing in your project:

```bash
npm install -D vitest @vitest/ui @vue/test-utils jsdom happy-dom
```

## Basic Component Testing

Here's an example of testing an FTButton component:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FTButton } from '@fasttrack-solutions/vue-components-lib'

describe('FTButton', () => {
  it('renders with text', () => {
    const wrapper = mount(FTButton, {
      slots: {
        default: 'Click me'
      }
    })
    expect(wrapper.text()).toContain('Click me')
  })

  it('applies primary style when prop is set', () => {
    const wrapper = mount(FTButton, {
      props: { primary: true }
    })
    expect(wrapper.find('button').classes()).toContain('ft-button--primary')
  })

  it('emits click event', async () => {
    const wrapper = mount(FTButton)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emits('click')).toBeTruthy()
  })
})
```

## Testing Input Components

When testing form components like FTInput or FTCheckbox, verify v-model behavior:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { FTInput } from '@fasttrack-solutions/vue-components-lib'

describe('FTInput', () => {
  it('updates v-model on input', async () => {
    const wrapper = mount(FTInput, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': (e: string) => wrapper.vm.$emit('update:modelValue', e)
      }
    })

    const input = wrapper.find('input')
    await input.setValue('test value')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
```

## Testing Composables

The Notification composable can be tested in isolation:

```ts
import { describe, it, expect } from 'vitest'
import { useNotification } from '@fasttrack-solutions/vue-components-lib'

describe('useNotification', () => {
  it('creates a notification', () => {
    const { notify } = useNotification()
    notify({
      message: 'Test notification',
      type: 'success'
    })

    // Assertions based on your implementation
  })
})
```

## Running Tests

Add a test script to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

Run tests with:

```bash
npm run test
```

## Best Practices

1. **Test User Behavior** - Test what users see and interact with, not implementation details
2. **Test Props and Events** - Verify components respond correctly to props and emit proper events
3. **Test Accessibility** - Ensure components are accessible with proper ARIA attributes
4. **Use Descriptive Test Names** - Make it clear what each test validates
5. **Keep Tests Focused** - One assertion per test when possible

For more information, refer to the [Vitest documentation](https://vitest.dev/) and [Vue Test Utils guide](https://test-utils.vuejs.org/).
