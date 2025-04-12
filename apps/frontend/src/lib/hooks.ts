import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getConversation, initializeWidget, getConversations, getPaymentIntent } from "./actions";
import type { ConversationId, PaymentIntentId, WorkspaceId } from "typeid";

export const useConversation = (props: {
  conversationId: ConversationId;
  enabled?: boolean;
}) => {
  const { conversationId, enabled = true } = props;
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversation({ conversationId }),
    enabled: enabled && !!conversationId,
  });
  return { data, isLoading, error, refetch };
};

export const useGetConversations = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
  return { data, isLoading, error, refetch };
};

export const useInitializeWidget = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, data } = useMutation({
    mutationFn: async (props: { walletAddress: string; workspaceId: WorkspaceId }) => {
      return initializeWidget(props);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (data?.id) {
         queryClient.setQueryData(["conversation", data.id], data);
      }
      console.log("Widget initialized successfully", data);
    },
    onError: (error) => {
      console.error("Failed to initialize widget:", error);
    },
  });

  return { initialize: mutate, initializeAsync: mutateAsync, isInitializing: isPending, error, data };
};


export const usePaymentIntent = (props: {
  paymentIntentId: PaymentIntentId | undefined;
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    enabled: !!props.paymentIntentId,
    queryKey: ["paymentIntent", props.paymentIntentId],
    queryFn: () => getPaymentIntent({ paymentIntentId: props.paymentIntentId as PaymentIntentId }),
  });
  return { data, isLoading, error, refetch };
};
