// import { Liveblocks } from "@liveblocks/node";
// import { NextRequest } from "next/server";

// const liveblocks = new Liveblocks({
//   secret: process.env.LIVEBLOCKS_SECRET_KEY!,
// });

// export async function POST(request: NextRequest) {
 
//  const user=localStorage.getItem('user')
//  let userId=null
//  if(user)
//  {
//     let userData=JSON.parse(user)
//      userId=userData.id
//  }

//   try {
//     // Make API call to your backend to verify the token and get user info
//     const userResponse = await fetch('http://your-backend-url/api/auth/verify', {
      
//     });

//     if (!userResponse.ok) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     const userData = await userResponse.json();
    
//     const session = liveblocks.prepareSession(userId, {
//         userInfo: {
//           name: userData.fullname,
//         },
//       });
      
//       // Grant access to the room
//       session.allow(fileId, session.FULL_ACCESS);
      
//       // Authorize session and return token
//       const { token } = await session.authorize();
//       return new Response(JSON.stringify({ token }), { status: 200 });
      
      
//   } catch (error) {
//     console.error("Auth error:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }