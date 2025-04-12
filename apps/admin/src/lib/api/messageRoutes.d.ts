import { z } from "zod";
export declare const ListMessagesSchema: z.ZodObject<{
    limit: z.ZodOptional<z.ZodString>;
    offset: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit?: string | undefined;
    offset?: string | undefined;
}, {
    limit?: string | undefined;
    offset?: string | undefined;
}>;
export type ListMessagesSchema = z.infer<typeof ListMessagesSchema>;
declare const messageRoutes: import("hono/hono-base").HonoBase<{
    Variables: import("../../types").ContextVariables;
} & {
    Variables: import("../../types").ContextVariables;
}, {
    "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId/messages/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId/messages": {};
} | import("hono/types").MergeSchemaPath<{
    "/conversations/:conversationId/messages": {
        $get: {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                query: {
                    limit?: string | undefined;
                    offset?: string | undefined;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                query: {
                    limit?: string | undefined;
                    offset?: string | undefined;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                query: {
                    limit?: string | undefined;
                    offset?: string | undefined;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                query: {
                    limit?: string | undefined;
                    offset?: string | undefined;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                query: {
                    limit?: string | undefined;
                    offset?: string | undefined;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                query: {
                    limit?: string | undefined;
                    offset?: string | undefined;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: {
                    content: string;
                    id: string;
                    createdAt?: string | undefined;
                    role: "system" | "user" | "assistant" | "data";
                    reasoning?: string | undefined;
                    experimental_attachments?: {
                        name?: string | undefined;
                        contentType?: string | undefined;
                        url: string;
                    }[] | undefined;
                    toolInvocations?: ({
                        state: "partial-call";
                        step?: number | undefined;
                        toolCallId: string;
                        toolName: string;
                        args: any;
                    } | {
                        state: "call";
                        step?: number | undefined;
                        toolCallId: string;
                        toolName: string;
                        args: any;
                    } | {
                        state: "result";
                        step?: number | undefined;
                        toolCallId: string;
                        toolName: string;
                        args: any;
                        result: any;
                    })[] | undefined;
                    parts?: ({
                        type: "text";
                        text: string;
                    } | {
                        type: "reasoning";
                        reasoning: string;
                        details: ({
                            type: "text";
                            text: string;
                            signature?: string | undefined;
                        } | {
                            type: "redacted";
                            data: string;
                        })[];
                    } | {
                        type: "tool-invocation";
                        toolInvocation: {
                            state: "partial-call";
                            step?: number | undefined;
                            toolCallId: string;
                            toolName: string;
                            args: any;
                        } | {
                            state: "call";
                            step?: number | undefined;
                            toolCallId: string;
                            toolName: string;
                            args: any;
                        } | {
                            state: "result";
                            step?: number | undefined;
                            toolCallId: string;
                            toolName: string;
                            args: any;
                            result: any;
                        };
                    } | {
                        type: "source";
                        source: {
                            sourceType: "url";
                            id: string;
                            url: string;
                            title?: string | undefined;
                            providerMetadata?: {
                                [x: string]: {
                                    [x: string]: any;
                                };
                            } | undefined;
                        };
                    } | {
                        type: "file";
                        mimeType: string;
                        data: string;
                    } | {
                        type: "step-start";
                    })[] | undefined;
                };
                conversationId: `cnv_${string}`;
                id: `msg_${string}`;
                createdAt: string;
                updatedAt: string;
                createdBy: `mbr_${string}`;
                updatedBy: `mbr_${string}`;
                workspaceId: `wsp_${string}`;
            }[];
            outputFormat: "json";
            status: 200;
        };
    };
}, "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId/messages"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $post: {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    message: Omit<import("ai").Message, "data" | "annotations">;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    message: Omit<import("ai").Message, "data" | "annotations">;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    message: Omit<import("ai").Message, "data" | "annotations">;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    message: Omit<import("ai").Message, "data" | "annotations">;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    message: Omit<import("ai").Message, "data" | "annotations">;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    message: Omit<import("ai").Message, "data" | "annotations">;
                };
            };
            output: {};
            outputFormat: string;
            status: 200;
        };
    };
}, "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId/messages"> | import("hono/types").MergeSchemaPath<{
    "/conversations/:conversationId/messages/:messageId": {
        $patch: {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    content: string;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    content: string;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    content: string;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    content: string;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    content: string;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    content: string;
                };
            };
            output: {
                message: {
                    content: string;
                    id: string;
                    createdAt?: string | undefined;
                    role: "system" | "user" | "assistant" | "data";
                    reasoning?: string | undefined;
                    experimental_attachments?: {
                        name?: string | undefined;
                        contentType?: string | undefined;
                        url: string;
                    }[] | undefined;
                    toolInvocations?: ({
                        state: "partial-call";
                        step?: number | undefined;
                        toolCallId: string;
                        toolName: string;
                        args: any;
                    } | {
                        state: "call";
                        step?: number | undefined;
                        toolCallId: string;
                        toolName: string;
                        args: any;
                    } | {
                        state: "result";
                        step?: number | undefined;
                        toolCallId: string;
                        toolName: string;
                        args: any;
                        result: any;
                    })[] | undefined;
                    parts?: ({
                        type: "text";
                        text: string;
                    } | {
                        type: "reasoning";
                        reasoning: string;
                        details: ({
                            type: "text";
                            text: string;
                            signature?: string | undefined;
                        } | {
                            type: "redacted";
                            data: string;
                        })[];
                    } | {
                        type: "tool-invocation";
                        toolInvocation: {
                            state: "partial-call";
                            step?: number | undefined;
                            toolCallId: string;
                            toolName: string;
                            args: any;
                        } | {
                            state: "call";
                            step?: number | undefined;
                            toolCallId: string;
                            toolName: string;
                            args: any;
                        } | {
                            state: "result";
                            step?: number | undefined;
                            toolCallId: string;
                            toolName: string;
                            args: any;
                            result: any;
                        };
                    } | {
                        type: "source";
                        source: {
                            sourceType: "url";
                            id: string;
                            url: string;
                            title?: string | undefined;
                            providerMetadata?: {
                                [x: string]: {
                                    [x: string]: any;
                                };
                            } | undefined;
                        };
                    } | {
                        type: "file";
                        mimeType: string;
                        data: string;
                    } | {
                        type: "step-start";
                    })[] | undefined;
                };
                conversationId: `cnv_${string}`;
                id: `msg_${string}`;
                createdAt: string;
                updatedAt: string;
                createdBy: `mbr_${string}`;
                updatedBy: `mbr_${string}`;
                workspaceId: `wsp_${string}`;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId/messages/:messageId"> | import("hono/types").MergeSchemaPath<{
    "/conversations/:conversationId/messages/:messageId": {
        $delete: {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    conversationId: string;
                    organizationId: string;
                    workspaceId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId/messages/:messageId">, "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId/messages">;
export { messageRoutes };
