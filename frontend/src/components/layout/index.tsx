import React from "react";
// Import ThemedSiderV2 directly from the library
import { ThemedLayoutV2, ThemedSiderV2 } from "@refinedev/antd";

import { Header } from "./header";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <ThemedLayoutV2
        Header={Header}
        // Use the imported ThemedSiderV2 component
        Sider={() => <ThemedSiderV2 fixed />}
        Title={() => null}
      >
        {children}
      </ThemedLayoutV2>
    </>
  );
};