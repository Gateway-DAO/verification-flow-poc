import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const URL = "https://develop.protocol.mygateway.xyz/v1/graphql";

  const { body } = req;

  const data = {
    query: `
    mutation($requestId: String!, $signature: String!) {
        createProof(
            requestId: $requestId
            signature: $signature
        ) {
            id
        }
    }
    `,
    variables: {
      requestId: JSON.parse(body).id,
      signature: JSON.parse(body).signature,
    },
  };

  const api = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const returnData = await api.json();

  if (returnData.errors) {
    console.log(returnData.errors);
    return res.status(500).json({ error: returnData.errors[0].message });
  }

  const proofId = returnData.data?.createProof.id;

  const data2 = {
    query: `
    query($id: String!) {
        proof(
            id: $id
        ) {
            totalCost
            facilitationFee
            arweaveUrl
            status
            data {
                dataModels {
                    id
                    title
                    consumptionPrice
                }
                PDAs {
                    id
                    claim
                    title
                    dataModel {
                        id
                    }
                    issuer {
                        id
                        gatewayId
                    }
                    organization {
                        id
                        name
                        gatewayId
                        image
                    }
                    owner {
                        id
                    }
                }
            }
        }
    }
    `,
    variables: {
      id: proofId,
    },
  };

  const api2 = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "f9p_9z3V3WZfv3IT_fnFTSXBxlAmhhz-",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm90b2NvbF9pZCI6IjExYzAwNDc1LTIxNDQtNDJlOS04ODhkLWFmMTdiMzhlZDdhMyIsImhhc3VyYV9pZCI6IjE2ZWNlNTJmLWZkNmMtNDVkMi04MWVkLTA4ZTk1OWEzNTAzMCIsImF1dGgiOnsiaWQiOiJkY2IwMzkxZi00NjI2LTRlMzItYWY0Mi1kNTk2NGZiZWQxMjgiLCJ0eXBlIjoiRU1BSUwifSwiY3J5cHRvIjp7InB1YmxpY1BlbSI6Ii0tLS0tQkVHSU4gUFVCTElDIEtFWS0tLS0tXHJcbk1JSUNJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBZzhBTUlJQ0NnS0NBZ0VBeStpNkVjWmpyZE5hUDF2OXZwNjJcclxuQTNKeEM3ZTI2MzdrZldqZ3Bvb2dNK1NGM2M0WWpaSmNFL20yK2pHblltbE9iQ0x0bWYxalJaaW4xZVdWSjgyK1xyXG42TDdLNVVTamsySGhkNTMvWjF3aVdZTGhFRkhVbGk2aEwxNDFRa1JERDBaVXVIbGFaa2tqeXd1c3NoQTNwcVU3XHJcblBkYUFac1R5Ym54OEpQd2hiR2hzbWZ1amtONkM3TlhkSmpGQ1V1dVFBZmJyeGcrOVlnYVpjMDZsb0hrREtHbkxcclxuME1zYmRhRGRBcVUxNzNhZmRkSmtXYi9zK0p3VFpSSjBQditBMlRPTEhiY0VsZGdjVXo0a3Q0MWp6aVpuOVprOVxyXG4yN2g5L1ZTeXBEeTJsaDUxRjZyeG5RdHNyNFpNQmkrelNKbms0ckx6U00xK1Zqa3JmaDNVbEJGYTFFSndxRSsxXHJcbmt6dy9hekNHVXQyRmEzSlN6ajJ1TjBPc3FSNnFyaFN4QkNOeUxLeWVyOExNTUdjcVcxY3JpOGVqRzdDcXh4YUFcclxuaWhMUk44SHFib3BqZENNa2QwZUIyQ1BJZnhGL1B5NG1zK3UweWEzdEdWQ3hBeTZrN0xqZUcvRElQeGI2dDUrVFxyXG5wQVNhaVNEeTF2MTkxS082cFNBQVRpODBpbzJrQjRGbTRnbnplUEJlcy9HelVvdEx2TjAzbUZnRldVUFJkekcxXHJcbmhIRDh3dFAzZlJ3MWFaR3BHcm1HZStyZHlUYWFRbzlUV2JhanVTenlrODQ2aVlHQjMyNEN5ZDRGUFNwcU05WlBcclxubDZRV2FLMWJKcmhtNGVqYmdKWDJDUWVQS2I4bVRRL0NhK09Lbnc1UDFNZ3FlMkVOM2pZeFNhRkdMbnd4bkUwZFxyXG5EQWIyRVRxN1JWM1JmL3ZxT3AxeG9OY0NBd0VBQVE9PVxyXG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS1cclxuIn0sImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJ1c2VyIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiMTZlY2U1MmYtZmQ2Yy00NWQyLTgxZWQtMDhlOTU5YTM1MDMwIn0sInR5cGUiOiJhdXRoX3Rva2VuIiwiaWF0IjoxNjk2NDM1ODg0fQ.sphcojQk8QuOocvw-T7BLq7Yqqxa-8nx69uCLzpXMQg",
    },
    body: JSON.stringify(data2),
  });

  const returnData2 = await api2.json();

  if (returnData2.errors) {
    console.log(returnData2.errors);
    return res.status(500).json({ error: returnData2.errors[0].message });
  }

  return res.json({
    proof: returnData2.data?.proof,
  });
}
