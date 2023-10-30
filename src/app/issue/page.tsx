"use client";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useEnsName } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

export default function Issue() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();

  const { enqueueSnackbar } = useSnackbar();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [PDA, setPDA] = useState<{ data: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const issuePDA = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/create-request", {
        method: "POST",
        body: JSON.stringify({
          address,
        }),
      });

      const { id, error } = await response.json();

      if (error) {
        if (
          error === "Cannot convert object to primitive value" ||
          error === `User ${address} not found`
        ) {
          setError("No matching PDAs found for this request");
          enqueueSnackbar("No matching PDAs found for this request", {
            variant: "warning",
          });
          setIsLoading(false);
          return;
        }

        setError(`Error creating request: ${error}`);
        enqueueSnackbar(`Error creating request: ${error}`, {
          variant: "error",
        });
        setIsLoading(false);
        return;
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="space-around"
      direction="row"
      flex={1}
      width="100%"
    >
      {/** Actions */}
      <Card variant="outlined">
        <CardHeader
          title="Actions"
          titleTypographyProps={{
            variant: "subtitle1",
            fontWeight: "bold",
          }}
        />
        <CardContent>
          <Stack>
            <Typography fontWeight="bold">Your wallet:</Typography>
            <Typography>
              {isConnected ? ensName || address : "🛑 Not Connected"}
            </Typography>
          </Stack>
          <Stack direction="row" marginTop={4}>
            {isConnected ? (
              <Button
                variant="contained"
                onClick={() => disconnect()}
                sx={{
                  mr: 2,
                }}
              >
                Disconnect
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => connect()}
                sx={{
                  mr: 2,
                }}
              >
                Connect
              </Button>
            )}
            <Button
              variant="contained"
              onClick={() => issuePDA()}
              disabled={!isConnected || isLoading}
            >
              {isLoading ? "Loading..." : "Issue PDA"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
      {/** Proof */}
      <Card variant="outlined">
        <CardHeader
          title="PDA Content"
          titleTypographyProps={{
            variant: "subtitle1",
            fontWeight: "bold",
          }}
        />
        <CardContent>
          <pre>
            {PDA
              ? JSON.stringify(PDA, null, 2)
              : "You haven't issued a PDA yet"}
          </pre>
          {PDA && !PDA?.data?.dataAsset && (
            <Typography fontWeight="bold">
              Requested PDAs not found, go to X link to get them
            </Typography>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
