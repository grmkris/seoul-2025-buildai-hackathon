import { OpenAPIHono } from "@hono/zod-openapi";
export declare const chatRouter: OpenAPIHono<import("hono").Env, import("hono/types").MergeSchemaPath<{
    "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId/messages/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId/messages": {};
} | import("hono/types").MergeSchemaPath<{
    "/conversations/:conversationId/messages": {
        $get: {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                    role: "system" | "user" | "assistant" | "data";
                    createdAt?: string | undefined;
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
                id: `msg_${string}`;
                createdAt: string;
                updatedAt: string;
                createdBy: `mbr_${string}`;
                updatedBy: `mbr_${string}`;
                workspaceId: `wsp_${string}`;
                conversationId: `cnv_${string}`;
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
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
                    role: "system" | "user" | "assistant" | "data";
                    createdAt?: string | undefined;
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
                id: `msg_${string}`;
                createdAt: string;
                updatedAt: string;
                createdBy: `mbr_${string}`;
                updatedBy: `mbr_${string}`;
                workspaceId: `wsp_${string}`;
                conversationId: `cnv_${string}`;
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
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                    messageId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
}, "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId/messages/:messageId">, "/"> & import("hono/types").MergeSchemaPath<{
    "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/*": {};
} | import("hono/types").MergeSchemaPath<{
    "/": {
        $post: {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    title: string;
                };
            };
            output: {
                title: string;
                id: `cnv_${string}`;
                createdAt: string;
                updatedAt: string;
                createdBy: `mbr_${string}`;
                updatedBy: `mbr_${string}`;
                workspaceId: `wsp_${string}`;
            };
            outputFormat: "json";
            status: 201;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    title: string;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    title: string;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    title: string;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    title: string;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    title: string;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 500;
        };
    };
}, "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                query: {
                    search?: string | undefined;
                    orderBy?: "title" | "createdAt" | "updatedAt" | undefined;
                    limit?: string | undefined;
                    page?: string | undefined;
                    orderDirection?: "asc" | "desc" | undefined;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                query: {
                    search?: string | undefined;
                    orderBy?: "title" | "createdAt" | "updatedAt" | undefined;
                    limit?: string | undefined;
                    page?: string | undefined;
                    orderDirection?: "asc" | "desc" | undefined;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                query: {
                    search?: string | undefined;
                    orderBy?: "title" | "createdAt" | "updatedAt" | undefined;
                    limit?: string | undefined;
                    page?: string | undefined;
                    orderDirection?: "asc" | "desc" | undefined;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                query: {
                    search?: string | undefined;
                    orderBy?: "title" | "createdAt" | "updatedAt" | undefined;
                    limit?: string | undefined;
                    page?: string | undefined;
                    orderDirection?: "asc" | "desc" | undefined;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                query: {
                    search?: string | undefined;
                    orderBy?: "title" | "createdAt" | "updatedAt" | undefined;
                    limit?: string | undefined;
                    page?: string | undefined;
                    orderDirection?: "asc" | "desc" | undefined;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                query: {
                    search?: string | undefined;
                    orderBy?: "title" | "createdAt" | "updatedAt" | undefined;
                    limit?: string | undefined;
                    page?: string | undefined;
                    orderDirection?: "asc" | "desc" | undefined;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                data: {
                    title: string;
                    id: `cnv_${string}`;
                    createdAt: string;
                    updatedAt: string;
                    createdBy: `mbr_${string}`;
                    updatedBy: `mbr_${string}`;
                    workspaceId: `wsp_${string}`;
                    lastMessage?: {
                        message: {
                            content: string;
                            id: string;
                            role: "system" | "user" | "assistant" | "data";
                            createdAt?: string | undefined;
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
                        id: `msg_${string}`;
                        createdAt: string;
                        updatedAt: string;
                        createdBy: `mbr_${string}`;
                        updatedBy: `mbr_${string}`;
                        workspaceId: `wsp_${string}`;
                        conversationId: `cnv_${string}`;
                    } | undefined;
                }[];
                pagination: {
                    currentPage: number;
                    totalPages: number;
                    pageSize: number;
                    totalCount: number;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations"> | import("hono/types").MergeSchemaPath<{
    "/:conversationId": {
        $get: {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                title: string;
                id: `cnv_${string}`;
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
}, "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $patch: {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    title?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    title?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    title?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    title?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    title?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            } & {
                json: {
                    title?: string | undefined;
                };
            };
            output: {
                title: string;
                id: `cnv_${string}`;
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
}, "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $delete: {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
                };
            } & {
                header: {
                    Authorization?: string | undefined;
                };
            };
            output: {
                message: string;
                requestId: `req_${string}`;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                    conversationId: string;
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
}, "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId">, "/">, "/">;
