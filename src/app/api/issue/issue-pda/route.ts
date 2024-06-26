import { Gateway, UserIdentifierType } from "@gateway-dao/sdk";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const gateway = new Gateway({
      apiKey: process.env.API_KEY as string,
      token: process.env.BEARER as string,
      url: process.env.API_URL as string,
    });
    const data = await gateway.pda.createPDA({
      title: body.title,
      description: body.description,
      owner: { type: UserIdentifierType.EVM, value: body.address },
      dataModelId: process.env.DATA_MODEL_ID as string,
      claim: body.claim,
      image: body?.image,
    });

    return Response.json({
      pda: data?.createPDA,
    });
  } catch (error) {
    console.log(error);
    console.log(JSON.stringify(error, null, 4));

    return Response.json({ error }, { status: 500 });
  }
}
