# Notification

The `useNotification` composable provides a simple way to display notification messages throughout your application. It supports multiple notification types, automatic dismissal, and flexible positioning.

## Usage

### Composition api (script setup)

```vue
<script setup lang="ts">
  import { useNotification } from '@fasttrack-solutions/vue-components-lib';

  const { notify } = useNotification();

  const showSuccess = () => {
    notify({
      message: 'Operation completed successfully!',
      type: 'success',
      duration: 3000
    });
  };
</script>
```

### Options api

```vue
<script>
  import { useNotification } from '@fasttrack-solutions/vue-components-lib';

  export default {
    setup() {
      const { notify } = useNotification();

      return {
        showSuccess() {
          notify({
            message: 'Operation completed successfully!',
            type: 'success'
          });
        }
      };
    }
  }
</script>
```

## Notification Types

The notification composable supports different notification types:

- **success** - Indicates a successful operation
- **error** - Indicates an error or failure
- **warning** - Warns about potential issues
- **info** - Displays informational messages

## Methods

### notify(options)

Displays a notification with the provided options.

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `message` | string | required | The notification message text |
| `type` | 'success' \| 'error' \| 'warning' \| 'info' | 'info' | Type of notification |
| `duration` | number | 3000 | Duration in milliseconds before auto-dismiss (0 to disable) |
| `position` | string | 'top-right' | Position on screen |

## Examples

### Success Notification

```vue
<script setup lang="ts">
  import { useNotification } from '@fasttrack-solutions/vue-components-lib';

  const { notify } = useNotification();

  const handleSave = async () => {
    try {
      // Save operation
      notify({
        message: 'Changes saved successfully!',
        type: 'success'
      });
    } catch (error) {
      notify({
        message: 'Failed to save changes',
        type: 'error'
      });
    }
  };
</script>
```

### Error Notification with Custom Duration

```vue
<script setup lang="ts">
  import { useNotification } from '@fasttrack-solutions/vue-components-lib';

  const { notify } = useNotification();

  const handleDelete = () => {
    notify({
      message: 'This action cannot be undone',
      type: 'warning',
      duration: 5000
    });
  };
</script>
```

### Warning Notification

```vue
<script setup lang="ts">
  import { useNotification } from '@fasttrack-solutions/vue-components-lib';

  const { notify } = useNotification();

  const checkConnection = () => {
    if (!navigator.onLine) {
      notify({
        message: 'You are offline. Some features may not work.',
        type: 'warning',
        duration: 0 // Persistent until manually dismissed
      });
    }
  };
</script>
```

## Best Practices

1. **Keep Messages Concise** - Notifications should be brief and informative
2. **Use Appropriate Types** - Match the notification type to the message importance
3. **Set Appropriate Durations** - Critical messages may need longer display times
4. **Avoid Notification Spam** - Don't show too many notifications at once
5. **Provide Actions** - For important messages, consider using modals or panels instead
