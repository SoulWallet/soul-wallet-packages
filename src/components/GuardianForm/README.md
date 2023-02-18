# How to Use `<GuardianForm/>`

-   No init data

```tsx
import GuardianForm from "@src/components/GuardianForm";

// ...
<GuardianForm />;
// ...
```

-   with init data

```tsx
import GuardianForm from "@src/components/GuardianForm";
import { nanoid } from "nanoid";

const initData = [{ name: "John Doe", address: "0x12345678909876543211234567", id: nanoid() }];

// ...
<GuardianForm guardians={initData} />;
// ...
```

<!--
-   Provider side

```tsx
import GuardianForm from "@src/components/GuardianForm";
import { nanoid } from "nanoid";
import { GuardianContext } from "@src/context/hooks/useGuardianContext";
import { GuardianState, createGuardianStore } from "@src/store/guardian";
import React, { useRef } from "react";

export default function Provider() {
    // 1. create ref for store
    const storeRef = useRef<GuardianState>();

    // 2. pass initial data to store
    if (!storeRef.current) {
        // // 3.a. create empty guardian store
        // storeRef.current = createGuardianStore();

        // 3.b. create guardian store with initial data
        storeRef.current = createGuardianStore({
            // assign unique id for each guardian using nanoid()
            guardians: [{ name: "John Doe", address: "0x12345678909876543211234567", id: nanoid() }],
        });
    }

    return (
        // 4. pass store to provider
        <GuardianContext.Provider value={storeRef.current}>
            <GuardianForm />
        </GuardianContext.Provider>
    );
}
```

-   Consumer side

```tsx
import { useGuardianContext } from "@src/context/hooks/useGuardianContext";

export default function Consumer({ id, name, address }: IProps) {
    const { guardians } = useGuardianContext((s) => s.guardians);

    // ...
}
``` -->
