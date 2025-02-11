// 'user server';
// import { nanoid } from 'nanoid';
// import { revalidatePath } from 'next/cache';
// import { liveblocks } from '../liveblocks';
// import { parseStringify } from '../utils';
// export const createRoom=async({userId,email}:{userId:string,email:string})=>
// {
//     const roomId=

//     try {
//         const metadata={
//             userId,
//             email,
//             title:'Untitled'
//         }
//         const usersAccesses:RoomAccesses={
//             [email]:['room:write']
//         }
//         const room=await liveblocks.createRoom(roomId,{
//             metadata,
//             usersAccesses,
//             defaultAccesses:['room:write']
//         })
//         revalidatePath('/')
//         return parseStringify(room)
//     } catch (error) {
//         console.log('Error happend in creating room',error);
        
//     }
// }