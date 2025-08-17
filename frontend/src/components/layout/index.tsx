import React from "react";

import { ThemedLayoutV2 } from "@refinedev/antd";

import { Header } from "./header";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <ThemedLayoutV2
        Header={Header}
        // This change removes the logo and text from the sidebar.
        Title={() => null}
      >
        {children}
      </ThemedLayoutV2>
    </>
  );
};