# Bolt's Journal ⚡

This journal is for CRITICAL, codebase-specific performance learnings ONLY.

---
## 2024-07-25 - The `useCallback` Trap

**Learning:** Adding `useCallback` to every function inside a component is a premature optimization and can be incorrect. It only provides a performance benefit if the wrapped function is a dependency to another hook (like `useEffect`) or if it's passed as a prop to a memoized child component (`React.memo`). Wrapping a 'getter' function that's called directly in the render body is pointless, as the function call itself isn't memoized, only its definition is. This adds complexity for no gain.

**Action:** Before using `useCallback`, I will verify that it's actually preventing a re-render of an expensive child component. I will prioritize moving pure helper functions outside the component scope, which is a clearer and more consistently beneficial optimization.
