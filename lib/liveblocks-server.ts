import { Liveblocks } from "@liveblocks/node";
if(!process.env.LIVEBLOCKS_SECRET_KEY)
{
  throw new Error('Liveblocks secret key is missing')
}
export const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});