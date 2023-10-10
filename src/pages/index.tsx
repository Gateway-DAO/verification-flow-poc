import { Button, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useSignMessage,
} from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [proof, setProof] = useState<{ data: any } | null>(null);

  const createRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-request", {
        method: "POST",
        body: JSON.stringify({
          address,
        }),
      });

      const { id } = await response.json();
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

      const { message } = await response.json();

      const signature = await signMessageAsync({ message });

      const response2 = await fetch("/api/create-proof", {
        method: "POST",
        body: JSON.stringify({
          id,
          signature,
        }),
      });

      const { proof } = await response2.json();

      setProof(proof);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  return (
    <Stack justifyContent="center" alignItems="center">
      <Stack direction="row">
        {isConnected ? (
          <Button
            variant="contained"
            onClick={() => disconnect()}
            sx={{
              backgroundColor: "gray",
              marginRight: "1rem",
              ":hover": {
                backgroundColor: "#000",
              },
            }}
          >
            Connected to {ensName || address}
          </Button>
        ) : (
          <Button variant="contained" onClick={() => connect()}>
            Connect
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() => createRequest()}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Create Request"}
        </Button>
      </Stack>
      {proof && (
        <Stack>
          <pre>{JSON.stringify(proof, null, 2)}</pre>
        </Stack>
      )}
      {proof && !proof?.data?.PDAs?.length && (
        <Stack>
          <p>Requested PDAs not found, go to X link to get them</p>
        </Stack>
      )}
    </Stack>
  );
}
