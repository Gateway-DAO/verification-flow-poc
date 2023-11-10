export async function POST(req: Request) {
  const body = await req.json();

  const data = {
    query: `
    mutation($requestId: String!) {
        createProofMessage(requestId: $requestId)
      }
    `,
    variables: {
      requestId: body.id,
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
    message: returnData.data?.createProofMessage,
  });
}
