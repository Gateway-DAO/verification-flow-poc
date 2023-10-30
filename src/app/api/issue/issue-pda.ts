import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  const data = {
    query: `
    mutation createPDA($title: String!, $description: String!, $organization: String!, $owner: String!, $dataModelId: String!, $claim: String!, $image: String!) {
        createPDA(
            input: {
                title: $title,
                description: $description,
                owner: {
                    type: EVM
                    value: $owner
                }
                organization: {
                	type: GATEWAY_ID
                	value: $organization
                }
                dataModelId: $dataModelId
                image: $image
                expirationDate: null
                claim: $claim
            }
        ) {
            id
            arweaveUrl
            dataAsset {
                owner {
                    id
                    gatewayId
                }
                issuer {
                    id
                    gatewayId
                }
            }
        }
    }    
    `,
    variables: {
      title: JSON.parse(body).title,
      description: JSON.parse(body).description,
      organization: process.env.ORG_GATEWAY_ID,
      owner: JSON.parse(body).address,
      dataModelId: process.env.DATA_MODEL_ID,
      claim: JSON.parse(body).claim,
      image: JSON.parse(body).image,
    },
  };

  const api = await fetch(process.env.API_URL as string, {
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
    console.log(JSON.stringify(returnData.errors, null, 4));
    return res.status(500).json({ error: returnData.errors[0].message });
  }

  return res.json({
    pda: returnData.data?.createPDA,
  });
}
