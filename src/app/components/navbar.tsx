"use client";

import Logo from "@/components/logo/logo";
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Stack
      alignSelf="flex-start"
      alignItems="center"
      direction="row"
      justifyContent="space-between"
      sx={{
        padding: "1rem",
        backgroundColor: "#FFF",
        width: "100%",
        zIndex: 10,
      }}
    >
      <Logo />
      <Stack
        direction="row"
        justifyContent="space-between"
        textAlign="right"
        sx={{
          "& a": {
            textDecoration: "none",
            color: "#000",
            marginLeft: "1.5rem",
          },
        }}
      >
        <Link href="/issue">
          <Typography
            fontWeight={pathname == "/issue" ? "bold" : "normal"}
            color={pathname == "/issue" ? "#771AC9" : "#000"}
          >
            Issue
          </Typography>
        </Link>
        <Link href="/verify">
          <Typography
            fontWeight={pathname == "/verify" ? "bold" : "normal"}
            color={pathname == "/verify" ? "#771AC9" : "#000"}
          >
            Verify
          </Typography>
        </Link>
      </Stack>
    </Stack>
  );
}
