"use client";

import { ThemeProvider } from "@/theme";
import { SnackbarProvider } from "notistack";

import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import React from "react";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ThemeProvider>
        <SnackbarProvider>{children}</SnackbarProvider>
      </ThemeProvider>
    </WagmiConfig>
  );
}
