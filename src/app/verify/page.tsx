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
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useSignMessage,
} from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

export default function Verify() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const { enqueueSnackbar } = useSnackbar();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [proof, setProof] = useState<{ data: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createRequest = async () => {
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

      getAndSign(id);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const getAndSign = async (id: string) => {
    try {
      const response = await fetch("/api/get-nonce", {
        method: "POST",
        body: JSON.stringify({
          id,
        }),
      });

      const { message, error } = await response.json();

      if (error) {
        setError(`Error getting nonce: ${error}`);
        enqueueSnackbar(`Error getting nonce: ${error}`, { variant: "error" });
        setIsLoading(false);
        return;
      }

      const signature = await signMessageAsync({ message });

      const response2 = await fetch("/api/create-proof", {
        method: "POST",
        body: JSON.stringify({
          id,
          signature,
        }),
      });

      const { proof, error: error2 } = await response2.json();

      if (error2) {
        if (error2 === "NO_MATCHING_PDAS") {
          setError("No matching PDAs found for this request");
          enqueueSnackbar("No matching PDAs found for this request", {
            variant: "warning",
          });
          setIsLoading(false);
          return;
        }
        setError(`Error creating proof: ${error2}`);
        enqueueSnackbar(`Error creating proof: ${error2}`, {
          variant: "error",
        });
        setIsLoading(false);
        return;
      }

      setProof(proof);
      setIsLoading(false);
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
              onClick={() => createRequest()}
              disabled={!isConnected || isLoading}
            >
              {isLoading ? "Loading..." : "Create Request"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
      {/** Proof */}
      <Card variant="outlined">
        <CardHeader
          title="Proof Content"
          titleTypographyProps={{
            variant: "subtitle1",
            fontWeight: "bold",
          }}
        />
        <CardContent>
          <pre>
            {proof
              ? JSON.stringify(proof, null, 2)
              : "You haven't created a proof yet"}
          </pre>
          {proof && !proof?.data?.PDAs?.length && (
            <Typography fontWeight="bold">
              Requested PDAs not found, go to X link to get them
            </Typography>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
