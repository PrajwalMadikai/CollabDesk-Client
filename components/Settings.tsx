import { API } from "@/app/api/handle-token-expire";
import { RootState } from "@/store/store";
import { Briefcase, User } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

const SettingsModal = ({ isOpen, onClose, workspaceId, workspaceName }:{isOpen:boolean,onClose:()=>void,workspaceId:string,workspaceName:string}) => {
 
   const user=useSelector((state:RootState)=>state.user)
   
 
  const [permission, setPermission] = useState<"shared"|"private">( "private");
  let [collaborators,setcollaborators]=useState<{id:string,name:string,email:string}[]>([])
  let [newUser,setNewUser]=useState('')

  const handleCollaboratorsAdd=async()=>{
    try {

      let response=await API.post('/workspace/add-collaborator',{email:newUser,workspaceId},{withCredentials:true})
      if(response.status==200)
      {
        const workspace = response.data.user;
        setcollaborators(
          workspace.userDetails.map((user: any) => ({
            id: user.userId,
            name: user.name ,
            email: user.userEmail,
          }))
        );
        setNewUser('')
      }
      
    } catch (error) {
      console.log(error);
      
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 h-[600px] rounded-[4px] p-6 w-[500px] relative">
        <h2 className="text-white text-lg font-semibold mb-4">Settings</h2>

        {/* Workspace Section */}
        <div className="mb-4">
          <h3 className="text-gray-300  flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Workspace
          </h3>
          <label className="text-gray-400 text-sm block mt-2">Name</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-800 text-white rounded-[2px] mt-1 h-12 pl-5  outline-none"
            value={workspaceName}
          />
        </div>

        {/* Permissions Section */}
        {/* <div className="mb-4">
          <h3 className="text-gray-300">Permissions</h3>
          <div className="flex gap-4 mt-2">
            <button
              className={`flex items-center gap-2 p-2 rounded-md border ${
                permission === "private" ? "border-white bg-gray-800" : "border-gray-600"
              }`}
              onClick={() => setPermission("private")}
            >
              <Lock className="h-4 w-4 text-gray-300" />
              <span className="text-gray-300">Private</span>
            </button>
            <button
              className={`flex items-center gap-2 p-2 rounded-md border ${
                permission === "shared" ? "border-white bg-gray-800" : "border-gray-600"
              }`}
              onClick={() => setPermission("shared")}
            >
              <Upload className="h-4 w-4 text-gray-300" />
              <span className="text-gray-300">Shared</span>
            </button>
          </div>
        </div> */}

        {/* Collaborators Section */}
        <div className="mb-4 py-3">
          <input type="text" name="" value={newUser} id="" onChange={(e)=>setNewUser(e.target.value)} className="w-full p-2 bg-gray-800 text-white rounded-[2px] mt-1 h-12 pl-5  outline-none" />
        <button className="w-full my-3 bg-white text-black py-2 rounded-md" onClick={handleCollaboratorsAdd}>
            + Add Collaborators
          </button>
          <h3 className="text-gray-300 text-[16px]">Collaborators</h3>
          <div className="max-h-40 min-h-12 overflow-y-auto bg-gray-800 rounded-[3px] p-2 mt-2">
            {collaborators.map((user) => (
              <div
                key={user.email}
                className="flex items-center justify-between bg-gray-800 border border-gray-700  p-2 rounded-[5px] mb-2"
              >
                <div>
                  <p className="text-white text-xs">{user.email}</p>
                </div>
                <button className="text-red-600 text-sm">
                  Remove
                </button>
              </div>
            ))}
          </div>
          
        </div>

        {/* Profile Section */}
        <div className="mb-4  border-t border-gray-700 pt-4">
          <h3 className="text-gray-300 flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </h3>
          <label className="text-gray-400 text-sm block mt-2">Preferred Name</label>
          <div className="flex items-center bg-gray-800 p-2 rounded-md">
            <User className="h-5 w-5 text-gray-300" />
            <input
              type="text"
              className="bg-transparent text-white outline-none ml-2 flex-1"
              value="Prajwal"
            />
          </div>
          <p className="text-gray-400 mt-2">prajwalmadikai@gmail.com</p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition duration-200"
        >
          <span className="text-sm">Cancel</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
