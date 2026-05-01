import { route } from "@fal-ai/serverless-proxy/nextjs";

/** Proxies fal REST calls from the browser; adds `Authorization: Key …` via server-only `FAL_KEY`. */
export const GET = route.GET;
export const POST = route.POST;
