import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useFollowerInfo(userId:string, initialState:FollowerInfo){
    const query= useQuery<FollowerInfo>({
        queryKey:["follower-info", userId],
        queryFn: async()=> {
            const res=await axios.get(`/api/users/${userId}/followers`)
            return res.data.json()
        },
        initialData:initialState,
        staleTime: Infinity,
    })

    return query;
}