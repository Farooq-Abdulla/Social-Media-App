import { FollowingInfo } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function useFollowingInfo(
  userId: string,
  initialState: FollowingInfo
) {
  const query = useQuery<FollowingInfo>({
    queryKey: ['following-info', userId],
    queryFn: async () => {
      const res = await axios.get(`/api/users/${userId}/following`);
      return res.data.json();
    },
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
}
