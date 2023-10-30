import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body } = req;

  const data = {
    query: `
    mutation($requestId: String!) {
        createProofMessage(requestId: $requestId)
      }
    `,
    variables: {
      requestId: JSON.parse(body).id,
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
    message: returnData.data?.createProofMessage,
  });
}
