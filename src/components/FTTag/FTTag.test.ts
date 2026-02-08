import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FTTag from './FTTag.vue'

describe('FTTag', () => {
  // Snapshot test
  it('renders correctly with default props', () => {
    const wrapper = mount(FTTag, {
      slots: {
        default: 'Default Tag'
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders correctly with solid variant', () => {
    const wrapper = mount(FTTag, {
      props: {
        solid: true
      },
      slots: {
        default: 'Solid Tag'
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders correctly with light variant', () => {
    const wrapper = mount(FTTag, {
      props: {
        solid: false
      },
      slots: {
        default: 'Light Tag'
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  // Size variants
  describe('Size variants', () => {
    it('applies small size class', () => {
      const wrapper = mount(FTTag, {
        props: { size: 'sm' },
        slots: { default: 'Small' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--sm')
    })

    it('applies medium size class', () => {
      const wrapper = mount(FTTag, {
        props: { size: 'md' },
        slots: { default: 'Medium' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--md')
    })

    it('applies large size class', () => {
      const wrapper = mount(FTTag, {
        props: { size: 'lg' },
        slots: { default: 'Large' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--lg')
    })

    it('defaults to medium size', () => {
      const wrapper = mount(FTTag, {
        slots: { default: 'Medium' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--md')
    })
  })

  // Color variants
  describe('Color variants', () => {
    it('applies pink color class', () => {
      const wrapper = mount(FTTag, {
        props: { color: 'pink' },
        slots: { default: 'Pink' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--pink')
    })

    it('applies blue color class', () => {
      const wrapper = mount(FTTag, {
        props: { color: 'blue' },
        slots: { default: 'Blue' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--blue')
    })

    it('applies green color class', () => {
      const wrapper = mount(FTTag, {
        props: { color: 'green' },
        slots: { default: 'Green' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--green')
    })

    it('applies red color class', () => {
      const wrapper = mount(FTTag, {
        props: { color: 'red' },
        slots: { default: 'Red' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--red')
    })

    it('applies orange color class', () => {
      const wrapper = mount(FTTag, {
        props: { color: 'orange' },
        slots: { default: 'Orange' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--orange')
    })

    it('applies purple color class', () => {
      const wrapper = mount(FTTag, {
        props: { color: 'purple' },
        slots: { default: 'Purple' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--purple')
    })

    it('applies aqua color class', () => {
      const wrapper = mount(FTTag, {
        props: { color: 'aqua' },
        slots: { default: 'Aqua' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--aqua')
    })

    it('defaults to default color', () => {
      const wrapper = mount(FTTag, {
        slots: { default: 'Default' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--default')
    })
  })

  // Solid/Light variants
  describe('Solid and light variants', () => {
    it('applies solid class when solid is true', () => {
      const wrapper = mount(FTTag, {
        props: { solid: true },
        slots: { default: 'Solid' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--solid')
    })

    it('applies light class when solid is false', () => {
      const wrapper = mount(FTTag, {
        props: { solid: false },
        slots: { default: 'Light' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--light')
    })

    it('defaults to solid variant', () => {
      const wrapper = mount(FTTag, {
        slots: { default: 'Default' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--solid')
    })
  })

  // Disabled state
  describe('Disabled state', () => {
    it('applies disabled class', () => {
      const wrapper = mount(FTTag, {
        props: { disabled: true },
        slots: { default: 'Disabled' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--disabled')
    })

    it('sets aria-disabled attribute', () => {
      const wrapper = mount(FTTag, {
        props: { disabled: true },
        slots: { default: 'Disabled' }
      })
      expect(wrapper.find('.ft-tag').attributes('aria-disabled')).toBe('true')
    })

    it('sets tabindex to -1 when disabled', () => {
      const wrapper = mount(FTTag, {
        props: { disabled: true },
        slots: { default: 'Disabled' }
      })
      expect(wrapper.find('.ft-tag').attributes('tabindex')).toBe('-1')
    })

    it('does not emit click event when disabled', async () => {
      const wrapper = mount(FTTag, {
        props: { disabled: true },
        slots: { default: 'Disabled' }
      })
      await wrapper.find('.ft-tag').trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  // Locked state
  describe('Locked state', () => {
    it('applies locked class', () => {
      const wrapper = mount(FTTag, {
        props: { locked: true },
        slots: { default: 'Locked' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--locked')
    })

    it('sets aria-readonly attribute', () => {
      const wrapper = mount(FTTag, {
        props: { locked: true },
        slots: { default: 'Locked' }
      })
      expect(wrapper.find('.ft-tag').attributes('aria-readonly')).toBe('true')
    })

    it('displays lock icon when locked', () => {
      const wrapper = mount(FTTag, {
        props: { locked: true },
        slots: { default: 'Locked' }
      })
      const icon = wrapper.find('.ft-tag__icon .fa-lock')
      expect(icon.exists()).toBe(true)
    })

    it('does not emit click event when locked', async () => {
      const wrapper = mount(FTTag, {
        props: { locked: true },
        slots: { default: 'Locked' }
      })
      await wrapper.find('.ft-tag').trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  // Removable state
  describe('Removable state', () => {
    it('applies removable class', () => {
      const wrapper = mount(FTTag, {
        props: { removable: true },
        slots: { default: 'Removable' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--removable')
    })

    it('displays remove button when removable', () => {
      const wrapper = mount(FTTag, {
        props: { removable: true },
        slots: { default: 'Removable' }
      })
      const removeBtn = wrapper.find('.ft-tag__remove')
      expect(removeBtn.exists()).toBe(true)
    })

    it('displays xmark icon in remove button', () => {
      const wrapper = mount(FTTag, {
        props: { removable: true },
        slots: { default: 'Removable' }
      })
      const icon = wrapper.find('.ft-tag__remove .fa-xmark')
      expect(icon.exists()).toBe(true)
    })

    it('emits remove event when remove button is clicked', async () => {
      const wrapper = mount(FTTag, {
        props: { removable: true },
        slots: { default: 'Removable' }
      })
      await wrapper.find('.ft-tag__remove').trigger('click')
      expect(wrapper.emitted('remove')).toBeTruthy()
      expect(wrapper.emitted('remove')).toHaveLength(1)
    })

    it('does not show remove button when locked', () => {
      const wrapper = mount(FTTag, {
        props: { removable: true, locked: true },
        slots: { default: 'Locked Removable' }
      })
      const removeBtn = wrapper.find('.ft-tag__remove')
      expect(removeBtn.exists()).toBe(false)
    })

    it('emits remove event on Delete key', async () => {
      const wrapper = mount(FTTag, {
        props: { removable: true },
        slots: { default: 'Removable' }
      })
      await wrapper.find('.ft-tag').trigger('keydown', { key: 'Delete' })
      expect(wrapper.emitted('remove')).toBeTruthy()
    })

    it('emits remove event on Backspace key', async () => {
      const wrapper = mount(FTTag, {
        props: { removable: true },
        slots: { default: 'Removable' }
      })
      await wrapper.find('.ft-tag').trigger('keydown', { key: 'Backspace' })
      expect(wrapper.emitted('remove')).toBeTruthy()
    })
  })

  // Leading icon
  describe('Leading icon', () => {
    it('displays leading icon when provided', () => {
      const wrapper = mount(FTTag, {
        props: { leadingIcon: 'star' },
        slots: { default: 'With Icon' }
      })
      const icon = wrapper.find('.ft-tag__icon--leading .fa-star')
      expect(icon.exists()).toBe(true)
    })

    it('has aria-hidden on leading icon', () => {
      const wrapper = mount(FTTag, {
        props: { leadingIcon: 'star' },
        slots: { default: 'With Icon' }
      })
      const iconSpan = wrapper.find('.ft-tag__icon--leading')
      expect(iconSpan.attributes('aria-hidden')).toBe('true')
    })

    it('does not display leading icon when not provided', () => {
      const wrapper = mount(FTTag, {
        slots: { default: 'No Icon' }
      })
      const icon = wrapper.find('.ft-tag__icon--leading')
      expect(icon.exists()).toBe(false)
    })
  })

  // Trailing icon
  describe('Trailing icon', () => {
    it('displays trailing icon when provided and not removable', () => {
      const wrapper = mount(FTTag, {
        props: { trailingIcon: 'arrow-right' },
        slots: { default: 'With Trailing' }
      })
      const icon = wrapper.find('.ft-tag__icon--trailing .fa-arrow-right')
      expect(icon.exists()).toBe(true)
    })

    it('has aria-hidden on trailing icon', () => {
      const wrapper = mount(FTTag, {
        props: { trailingIcon: 'arrow-right' },
        slots: { default: 'With Trailing' }
      })
      const iconSpan = wrapper.find('.ft-tag__icon--trailing')
      expect(iconSpan.attributes('aria-hidden')).toBe('true')
    })

    it('does not display trailing icon when removable', () => {
      const wrapper = mount(FTTag, {
        props: { trailingIcon: 'arrow-right', removable: true },
        slots: { default: 'Removable' }
      })
      const trailingIcon = wrapper.find('.ft-tag__icon--trailing .fa-arrow-right')
      expect(trailingIcon.exists()).toBe(false)
    })

    it('does not display trailing icon when not provided', () => {
      const wrapper = mount(FTTag, {
        slots: { default: 'No Icon' }
      })
      const icon = wrapper.find('.ft-tag__icon--trailing')
      expect(icon.exists()).toBe(false)
    })
  })

  // Slot content
  describe('Slot content', () => {
    it('renders slot content', () => {
      const wrapper = mount(FTTag, {
        slots: {
          default: 'Custom Content'
        }
      })
      expect(wrapper.find('.ft-tag__content').text()).toBe('Custom Content')
    })

    it('renders default text when no slot provided', () => {
      const wrapper = mount(FTTag)
      expect(wrapper.find('.ft-tag__content').text()).toBe('Tag')
    })

    it('renders HTML in slot', () => {
      const wrapper = mount(FTTag, {
        slots: {
          default: '<span class="custom">Custom HTML</span>'
        }
      })
      expect(wrapper.find('.custom').exists()).toBe(true)
    })
  })

  // Click event
  describe('Click event', () => {
    it('emits click event on button click', async () => {
      const wrapper = mount(FTTag, {
        slots: { default: 'Clickable' }
      })
      await wrapper.find('.ft-tag').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('does not emit click when disabled', async () => {
      const wrapper = mount(FTTag, {
        props: { disabled: true },
        slots: { default: 'Disabled' }
      })
      await wrapper.find('.ft-tag').trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('does not emit click when locked', async () => {
      const wrapper = mount(FTTag, {
        props: { locked: true },
        slots: { default: 'Locked' }
      })
      await wrapper.find('.ft-tag').trigger('click')
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  // Keyboard interactions
  describe('Keyboard interactions', () => {
    it('emits click event on Enter key', async () => {
      const wrapper = mount(FTTag, {
        slots: { default: 'Keyboard' }
      })
      await wrapper.find('.ft-tag').trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('emits click event on Space key', async () => {
      const wrapper = mount(FTTag, {
        slots: { default: 'Keyboard' }
      })
      await wrapper.find('.ft-tag').trigger('keydown', { key: ' ' })
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('does not emit click on Enter when disabled', async () => {
      const wrapper = mount(FTTag, {
        props: { disabled: true },
        slots: { default: 'Disabled' }
      })
      await wrapper.find('.ft-tag').trigger('keydown', { key: 'Enter' })
      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('does not emit click on Space when disabled', async () => {
      const wrapper = mount(FTTag, {
        props: { disabled: true },
        slots: { default: 'Disabled' }
      })
      await wrapper.find('.ft-tag').trigger('keydown', { key: ' ' })
      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  // Accessibility attributes
  describe('Accessibility', () => {
    it('sets role to button', () => {
      const wrapper = mount(FTTag, {
        slots: { default: 'Button' }
      })
      expect(wrapper.find('.ft-tag').attributes('role')).toBe('button')
    })

    it('is focusable by default', () => {
      const wrapper = mount(FTTag, {
        slots: { default: 'Focusable' }
      })
      expect(wrapper.find('.ft-tag').attributes('tabindex')).toBe('0')
    })

    it('is not focusable when disabled', () => {
      const wrapper = mount(FTTag, {
        props: { disabled: true },
        slots: { default: 'Not Focusable' }
      })
      expect(wrapper.find('.ft-tag').attributes('tabindex')).toBe('-1')
    })

    it('accepts aria-label prop', () => {
      const wrapper = mount(FTTag, {
        props: { ariaLabel: 'Status badge' },
        slots: { default: 'Active' }
      })
      expect(wrapper.find('.ft-tag').attributes('aria-label')).toBe('Status badge')
    })

    it('has correct aria-label on remove button', () => {
      const wrapper = mount(FTTag, {
        props: { removable: true, ariaLabel: 'Active tag' },
        slots: { default: 'Active' }
      })
      const removeBtn = wrapper.find('.ft-tag__remove')
      expect(removeBtn.attributes('aria-label')).toBe('Remove Active tag')
    })
  })

  // Combination tests
  describe('Combined props', () => {
    it('renders with all props applied', () => {
      const wrapper = mount(FTTag, {
        props: {
          solid: true,
          color: 'pink',
          size: 'lg',
          leadingIcon: 'star',
          trailingIcon: 'check',
          removable: true,
          ariaLabel: 'Priority tag'
        },
        slots: { default: 'High Priority' }
      })
      const tag = wrapper.find('.ft-tag')
      expect(tag.classes()).toContain('ft-tag--solid')
      expect(tag.classes()).toContain('ft-tag--pink')
      expect(tag.classes()).toContain('ft-tag--lg')
      expect(tag.classes()).toContain('ft-tag--removable')
      expect(wrapper.find('.fa-star').exists()).toBe(true)
      expect(wrapper.find('.ft-tag__remove').exists()).toBe(true)
    })

    it('handles disabled and removable together', () => {
      const wrapper = mount(FTTag, {
        props: { disabled: true, removable: true },
        slots: { default: 'Disabled Removable' }
      })
      expect(wrapper.find('.ft-tag').classes()).toContain('ft-tag--disabled')
      const removeBtn = wrapper.find('.ft-tag__remove')
      expect(removeBtn.attributes('disabled')).toBeDefined()
    })

    it('prioritizes lock icon over trailing icon', () => {
      const wrapper = mount(FTTag, {
        props: {
          locked: true,
          trailingIcon: 'arrow-right',
          removable: true
        },
        slots: { default: 'Locked' }
      })
      expect(wrapper.find('.fa-lock').exists()).toBe(true)
      expect(wrapper.find('.fa-arrow-right').exists()).toBe(false)
      expect(wrapper.find('.ft-tag__remove').exists()).toBe(false)
    })
  })
})
