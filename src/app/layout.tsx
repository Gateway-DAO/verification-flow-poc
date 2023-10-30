import { Stack } from "@mui/material";
import Providers from "./providers";
import Navbar from "./components/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Stack minHeight="100vh">
            <Navbar />
            {children}
          </Stack>
        </Providers>
      </body>
    </html>
  );
}
