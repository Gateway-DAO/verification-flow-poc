export async function POST(req: Request) {
  const dataRequestTemplateId = process.env.TEMPLATE_ID;
  const orgGatewayId = process.env.ORG_GATEWAY_ID;

  const body = await req.json();

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
            dataUse: "To ensure humanhood and offer personalized experiences based on how well-versed you are with crypto."
        }) {
            arweaveUrl,
            id,
        }
    }
    `,
    variables: {
      wallet: body.address,
      dataRequestTemplateId,
      orgGatewayId,
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
    return Response.json({ error: returnData.errors[0].message });
  }

  return Response.json({
    id: returnData.data?.createDataRequest?.id,
    arweaveUrl: returnData.data?.createDataRequest?.arweaveUrl,
  });
}
