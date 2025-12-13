# Tests

This directory contains test files for the React Native Expo App.

## Structure

```
__tests__/
├── components/     # Component tests
├── hooks/         # Custom hook tests
└── utils/         # Utility function tests
```

## Running Tests

To run tests, you'll need to install testing dependencies first:

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
```

Then add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

Run tests:
```bash
npm test
```

## Writing Tests

### Component Tests

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../src/components/Button';

describe('Button', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <Button title="Click Me" onPress={() => {}} />
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when clicked', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={onPress} />
    );
    fireEvent.press(getByText('Click Me'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Hook Tests

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useStorage } from '../../src/hooks/useStorage';

describe('useStorage', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useStorage('key', 'default'));
    expect(result.current.storedValue).toBe('default');
  });
});
```

## Test Coverage

Sample tests are provided for:
- ✅ Utility functions (validators, formatters)
- ⏳ Components (to be implemented)
- ⏳ Hooks (to be implemented)
- ⏳ Screens (to be implemented)

## Best Practices

1. Test user behavior, not implementation details
2. Keep tests simple and focused
3. Use descriptive test names
4. Mock external dependencies
5. Aim for high coverage but prioritize critical paths
6. Test edge cases and error scenarios

## CI/CD Integration

Tests should be run automatically in CI/CD pipelines before deployment.
