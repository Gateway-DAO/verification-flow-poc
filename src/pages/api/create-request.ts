import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const URL = "https://develop.protocol.mygateway.xyz/v1/graphql";
  const dataRequestTemplateId = process.env.TEMPLATE_ID;
  const orgGatewayId = process.env.ORG_GATEWAY_ID;

  const { body } = req;

  const data = {
    query: `
    mutation($wallet: String!, $dataRequestTemplateId: String!, $orgGatewayId: String!) {
        createDataRequest(input: {
            dataRequestTemplateId: $dataRequestTemplateId,
            owner: {
                type: EVM,
                value: $wallet
            },
            organization: {
              type: GATEWAY_ID
              value: $orgGatewayId
            }
            dataUse: "Because I can"
        }) {
            arweaveUrl,
            id,
        }
    }
    `,
    variables: {
      wallet: JSON.parse(body).address,
      dataRequestTemplateId,
      orgGatewayId,
    },
  };

  const api = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY as string,
      Authorization: process.env.BEARER as string,
    },
    body: JSON.stringify(data),
  });

  const returnData = await api.json();

  if (returnData.errors) {
    return res.status(500).json({ error: returnData.errors[0].message });
  }

  return res.json({
    id: returnData.data?.createDataRequest?.id,
    arweaveUrl: returnData.data?.createDataRequest?.arweaveUrl,
  });
}
