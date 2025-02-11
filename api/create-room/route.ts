import { liveblocks } from '@/lib/liveblocks';
import { NextApiRequest, NextApiResponse } from 'next';
 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, email, title,roomId } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    

    const metadata = {
      userId,
      email,
      title: title || 'Untitled',
    };

    const usersAccesses:RoomAccesses={
        [email]:['room:write']
    }

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ['room:write'],
    });

    return res.status(200).json({ room });
  } catch (error) {
    console.error('Error creating room:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}