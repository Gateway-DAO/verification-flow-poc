import {
  Gateway,
  OrganizationIdentifierType,
  UserIdentifierType,
} from "@gateway-dao/sdk";

export async function POST(req: Request) {
  try {
    const dataRequestTemplateId = process.env.TEMPLATE_ID!;

    const body = await req.json();

    const gateway = new Gateway({
      apiKey: process.env.API_KEY as string,
      token: process.env.BEARER as string,
      url: process.env.API_URL as string,
    });

    const data = await gateway.request.createDataRequest({
      dataRequestTemplateId,
      owner: { type: UserIdentifierType.EVM, value: body.address },
      dataUse:
        "To ensure humanhood and offer personalized experiences based on how well-versed you are with crypto.",
    });

    return Response.json({
      id: data?.createDataRequest?.id,
      arweaveUrl: data?.createDataRequest?.arweaveUrl,
    });
  } catch (error: any) {
    console.log(error);

    console.log(JSON.stringify(error, null, 4));

    return Response.json(
      { message: error?.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
