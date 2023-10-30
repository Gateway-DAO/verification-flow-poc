import Logo from "@/components/logo/logo";
import { Stack } from "@mui/material";

import { ThemeProvider } from "@/theme";
import { SnackbarProvider } from "notistack";

import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import Providers from "./providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Stack minHeight="100vh">
            <Stack
              alignSelf="flex-start"
              sx={{
                padding: "1rem",
                backgroundColor: "#FFF",
                width: "100%",
                zIndex: 10,
              }}
            >
              <Logo />
            </Stack>
            {children}
          </Stack>
        </Providers>
      </body>
    </html>
  );
}
