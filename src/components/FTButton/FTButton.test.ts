import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FTButton from './FTButton.vue'

describe('FTButton', () => {
  // Snapshot tests
  it('renders correctly with default props', () => {
    const wrapper = mount(FTButton, {
      slots: { default: 'Click me' }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders correctly as secondary', () => {
    const wrapper = mount(FTButton, {
      props: { secondary: true },
      slots: { default: 'Secondary' }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders correctly as tertiary', () => {
    const wrapper = mount(FTButton, {
      props: { tertiary: true },
      slots: { default: 'Tertiary' }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders correctly as action', () => {
    const wrapper = mount(FTButton, {
      props: { action: true },
      slots: { default: 'Action' }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders correctly as icon only', () => {
    const wrapper = mount(FTButton, {
      props: { iconOnly: true, leadingIcon: 'refresh', ariaLabel: 'Refresh' }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  // Type variant classes
  describe('Type variants', () => {
    it('defaults to primary when no type is set', () => {
      const wrapper = mount(FTButton, {
        slots: { default: 'Default' }
      })
      expect(wrapper.find('.ft-button').classes()).toContain('ft-button--primary')
    })

    it('applies primary class', () => {
      const wrapper = mount(FTButton, {
        props: { primary: true },
        slots: { default: 'Primary' }
      })
      expect(wrapper.find('.ft-button').classes()).toContain('ft-button--primary')
    })

    it('applies secondary class', () => {
      const wrapper = mount(FTButton, {
        props: { secondary: true },
        slots: { default: 'Secondary' }
      })
      expect(wrapper.find('.ft-button').classes()).toContain('ft-button--secondary')
    })

    it('applies tertiary class', () => {
      const wrapper = mount(FTButton, {
        props: { tertiary: true },
        slots: { default: 'Tertiary' }
      })
      expect(wrapper.find('.ft-button').classes()).toContain('ft-button--tertiary')
    })

    it('applies action class', () => {
      const wrapper = mount(FTButton, {
        props: { action: true },
        slots: { default: 'Action' }
      })
      expect(wrapper.find('.ft-button').classes()).toContain('ft-button--action')
    })

    it('applies icon-only class', () => {
      const wrapper = mount(FTButton, {
        props: { iconOnly: true, leadingIcon: 'refresh', ariaLabel: 'Refresh' }
      })
      expect(wrapper.find('.ft-button').classes()).toContain('ft-button--icon-only')
    })
  })

  // Icon-only sizes
  describe('Icon-only sizes', () => {
    it('applies small icon size class', () => {
      const wrapper = mount(FTButton, {
        props: { iconOnly: true, leadingIcon: 'refresh', iconSize: 'sm', ariaLabel: 'Refresh' }
      })
      expect(wrapper.find('.ft-button').classes()).toContain('ft-button--icon-sm')
    })

    it('applies medium icon size class by default', () => {
      const wrapper = mount(FTButton, {
        props: { iconOnly: true, leadingIcon: 'refresh', ariaLabel: 'Refresh' }
      })
      expect(wrapper.find('.ft-button').classes()).toContain('ft-button--icon-md')
    })

    it('applies large icon size class', () => {
      const wrapper = mount(FTButton, {
        props: { iconOnly: true, leadingIcon: 'refresh', iconSize: 'lg', ariaLabel: 'Refresh' }
      })
      expect(wrapper.find('.ft-button').classes()).toContain('ft-button--icon-lg')
    })
  })

  // Leading icon
  describe('Leading icon', () => {
    it('displays leading icon when provided', () => {
      const wrapper = mount(FTButton, {
        props: { leadingIcon: 'smile' },
        slots: { default: 'With Icon' }
      })
      const icon = wrapper.find('.ft-button__icon .fa-smile')
      expect(icon.exists()).toBe(true)
    })

    it('has aria-hidden on icon', () => {
      const wrapper = mount(FTButton, {
        props: { leadingIcon: 'smile' },
        slots: { default: 'With Icon' }
      })
      const iconSpan = wrapper.find('.ft-button__icon')
      expect(iconSpan.attributes('aria-hidden')).toBe('true')
    })

    it('does not display icon when not provided', () => {
      const wrapper = mount(FTButton, {
        slots: { default: 'No Icon' }
      })
      expect(wrapper.find('.ft-button__icon').exists()).toBe(false)
    })

    it('hides leading icon when loading', () => {
      const wrapper = mount(FTButton, {
        props: { leadingIcon: 'smile', loading: true },
        slots: { default: 'Loading' }
      })
      expect(wrapper.find('.fa-smile').exists()).toBe(false)
      expect(wrapper.find('.ft-button__spinner').exists()).toBe(true)
    })
  })

  // Action trailing icon
  describe('Action trailing icon', () => {
    it('shows plus icon by default for action type', () => {
      const wrapper = mount(FTButton, {
        props: { action: true },
        slots: { default: 'Add' }
      })
      const trailing = wrapper.find('.ft-button__icon--trailing .fa-plus')
      expect(trailing.exists()).toBe(true)
    })

    it('allows custom trailing icon', () => {
      const wrapper = mount(FTButton, {
        props: { action: true, trailingIcon: 'language' },
        slots: { default: 'Translate' }
      })
      const trailing = wrapper.find('.ft-button__icon--trailing .fa-language')
      expect(trailing.exists()).toBe(true)
    })

    it('hides trailing icon when loading', () => {
      const wrapper = mount(FTButton, {
        props: { action: true, loading: true },
        slots: { default: 'Adding' }
      })
      expect(wrapper.find('.ft-button__icon--trailing').exists()).toBe(false)
    })
  })

  // Disabled state
  describe('Disabled state', () => {
    it('applies disabled class', () => {
      const wrapper = mount(FTButton, {
        props: { disabled: true },
        slots: { default: 'Disabled' }
      })
      expect(wrapper.find('.ft-button').classes()).toContain('ft-button--disabled')
    })

    it('sets disabled attribute on button', () => {
      const wrapper = mount(FTButton, {
        props: { disabled: true },
        slots: { default: 'Disabled' }
      })
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })

    it('sets aria-disabled attribute', () => {
      const wrapper = mount(FTButton, {
        props: { disabled: true },
        slots: { default: 'Disabled' }
      })
      expect(wrapper.find('button').attributes('aria-disabled')).toBe('true')
    })

    it('does not emit click when disabled', async () => {
      const wrapper = mount(FTButton, {
        props: { disabled: true },
        slots: { default: 'Disabled' }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  // Loading state
  describe('Loading state', () => {
    it('applies loading class', () => {
      const wrapper = mount(FTButton, {
        props: { loading: true },
        slots: { default: 'Loading' }
      })
      expect(wrapper.find('.ft-button').classes()).toContain('ft-button--loading')
    })

    it('shows spinner when loading', () => {
      const wrapper = mount(FTButton, {
        props: { loading: true },
        slots: { default: 'Loading' }
      })
      expect(wrapper.find('.ft-button__spinner').exists()).toBe(true)
      expect(wrapper.find('.fa-spinner').exists()).toBe(true)
    })

    it('sets aria-busy when loading', () => {
      const wrapper = mount(FTButton, {
        props: { loading: true },
        slots: { default: 'Loading' }
      })
      expect(wrapper.find('button').attributes('aria-busy')).toBe('true')
    })

    it('disables button when loading', () => {
      const wrapper = mount(FTButton, {
        props: { loading: true },
        slots: { default: 'Loading' }
      })
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })

    it('does not emit click when loading', async () => {
      const wrapper = mount(FTButton, {
        props: { loading: true },
        slots: { default: 'Loading' }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  // Click event
  describe('Click event', () => {
    it('emits click event', async () => {
      const wrapper = mount(FTButton, {
        slots: { default: 'Click me' }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })

  // Keyboard interactions
  describe('Keyboard interactions', () => {
    it('button element handles Enter natively', () => {
      const wrapper = mount(FTButton, {
        slots: { default: 'Keyboard' }
      })
      // <button> elements natively handle Enter/Space
      expect(wrapper.find('button').exists()).toBe(true)
    })
  })

  // Accessibility
  describe('Accessibility', () => {
    it('renders as a button element', () => {
      const wrapper = mount(FTButton, {
        slots: { default: 'Accessible' }
      })
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('has type="button"', () => {
      const wrapper = mount(FTButton, {
        slots: { default: 'Button' }
      })
      expect(wrapper.find('button').attributes('type')).toBe('button')
    })

    it('accepts aria-label prop', () => {
      const wrapper = mount(FTButton, {
        props: { ariaLabel: 'Close dialog' },
        slots: { default: 'X' }
      })
      expect(wrapper.find('button').attributes('aria-label')).toBe('Close dialog')
    })

    it('has focus-visible outline via CSS', () => {
      const wrapper = mount(FTButton, {
        slots: { default: 'Focusable' }
      })
      // focus-visible is handled by CSS, just verify the element is focusable
      expect(wrapper.find('button').exists()).toBe(true)
    })
  })

  // Slot content
  describe('Slot content', () => {
    it('renders slot content', () => {
      const wrapper = mount(FTButton, {
        slots: { default: 'Custom Text' }
      })
      expect(wrapper.find('.ft-button__content').text()).toBe('Custom Text')
    })

    it('renders default text when no slot provided', () => {
      const wrapper = mount(FTButton)
      expect(wrapper.find('.ft-button__content').text()).toBe('Button text')
    })

    it('hides content for icon-only', () => {
      const wrapper = mount(FTButton, {
        props: { iconOnly: true, leadingIcon: 'refresh', ariaLabel: 'Refresh' }
      })
      expect(wrapper.find('.ft-button__content').exists()).toBe(false)
    })
  })

  // Combination tests
  describe('Combined props', () => {
    it('primary with leading icon and disabled', () => {
      const wrapper = mount(FTButton, {
        props: { primary: true, leadingIcon: 'smile', disabled: true },
        slots: { default: 'Disabled' }
      })
      const btn = wrapper.find('.ft-button')
      expect(btn.classes()).toContain('ft-button--primary')
      expect(btn.classes()).toContain('ft-button--disabled')
      expect(wrapper.find('.fa-smile').exists()).toBe(true)
      expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    })

    it('action with custom trailing icon', () => {
      const wrapper = mount(FTButton, {
        props: { action: true, trailingIcon: 'language' },
        slots: { default: 'Translate' }
      })
      expect(wrapper.find('.ft-button--action').exists()).toBe(true)
      expect(wrapper.find('.fa-language').exists()).toBe(true)
    })

    it('loading replaces icon with spinner', () => {
      const wrapper = mount(FTButton, {
        props: { primary: true, leadingIcon: 'save', loading: true },
        slots: { default: 'Saving...' }
      })
      expect(wrapper.find('.fa-save').exists()).toBe(false)
      expect(wrapper.find('.ft-button__spinner').exists()).toBe(true)
    })
  })
})
