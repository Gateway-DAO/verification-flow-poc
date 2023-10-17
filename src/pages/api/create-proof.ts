import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  const api2 = await fetch(process.env.API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY as string,
      Authorization: process.env.BEARER as string,
    },
    body: JSON.stringify(data2),
  });

  const returnData2 = await api2.json();

  if (returnData2.errors) {
    console.log(JSON.stringify(returnData2.errors, null, 4));
    return res.status(500).json({ error: returnData2.errors[0].message });
  }

  return res.json({
    proof: returnData2.data?.proof,
  });
}
