import { route } from "@fal-ai/serverless-proxy/nextjs";
import { type NextRequest } from "next/server";

const URL_ALLOW_LIST = ["https://rest.alpha.fal.ai/tokens/"];

// Add a helper function to handle image generation
async function generateImage(req: NextRequest) {
  const headers = {
    'Authorization': `Key ${process.env.FAL_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await route.POST(req);
    return response;
  } catch (error) {
    console.error('Image generation failed:', error);
    return new Response("Image generation failed", { status: 500 });
  }
}

export const POST = async (req: NextRequest) => {
  const url = req.headers.get("x-fal-target-url");
  if (!url) {
    return new Response("Not found", { status: 404 });
  }

  if (!URL_ALLOW_LIST.includes(url)) {
    return new Response("Not allowed", { status: 403 });
  }

  const appCheckCookie = req.cookies.get("fal-app");
  if (!appCheckCookie || !appCheckCookie.value) {
    return new Response("Not allowed", { status: 403 });
  }

  return generateImage(req);
};

export const GET = (req: NextRequest) => {
  return route.GET(req);
};
