"use client";
import NextLink from "next/link";
import { PropsWithChildren } from "react";

import { Link } from "@mui/material";

export default function LogoContainer({ children }: PropsWithChildren<{}>) {
  return (
    <Link
      component={NextLink}
      sx={{ flexDirection: "row", display: "flex", textDecoration: "none" }}
      href={"/"}
      alignItems={"center"}
    >
      {children}
    </Link>
  );
}
