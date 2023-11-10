export async function POST(req: Request) {
  const body = await req.json();

  const data = {
    query: `
    mutation createPDA($title: String!, $description: String!, $organization: String!, $owner: String!, $dataModelId: String!, $claim: JSON!, $image: String!) {
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
      title: body.title,
      description: body.description,
      organization: process.env.ORG_GATEWAY_ID,
      owner: body.address,
      dataModelId: process.env.DATA_MODEL_ID,
      claim: body.claim,
      image: body?.image,
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

    return Response.json(
      { error: returnData.errors[0].message },
      { status: 500 }
    );
  }

  return Response.json({
    pda: returnData.data?.createPDA,
  });
}
