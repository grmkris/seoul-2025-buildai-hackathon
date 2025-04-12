import { useQuery } from "@tanstack/react-query";

export const useConversation = (props: { address?: string }) => {
  const { address } = props;
  const { data, isLoading, error } = useQuery({
    queryKey: ["conversation", address],
    queryFn: () => getConversation(address),
  });
};