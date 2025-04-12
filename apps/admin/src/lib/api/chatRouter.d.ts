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
                createdAt: string;
                updatedAt: string;
                message: {
                    createdAt?: string | undefined;
                    content: string;
                    id: string;
                    reasoning?: string | undefined;
                    experimental_attachments?: {
                        name?: string | undefined;
                        contentType?: string | undefined;
                        url: string;
                    }[] | undefined;
                    role: "system" | "user" | "assistant" | "data";
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
                createdBy: `usr_${string}`;
                updatedBy: `usr_${string}`;
                workspaceId: `wsp_${string}`;
                conversationId: `cnv_${string}`;
            }[];
            outputFormat: "json";
            status: 200;
        };
    };
}, "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId/messages">, "/"> & import("hono/types").MergeSchemaPath<{
    "/admin/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/*": {};
} | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    search?: string | undefined;
                    orderBy?: "title" | "createdAt" | "updatedAt" | undefined;
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
                    page?: string | undefined;
                    limit?: string | undefined;
                    search?: string | undefined;
                    orderBy?: "title" | "createdAt" | "updatedAt" | undefined;
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
                    createdAt: string;
                    updatedAt: string;
                    id: `cnv_${string}`;
                    createdBy: `usr_${string}`;
                    updatedBy: `usr_${string}`;
                    workspaceId: `wsp_${string}`;
                    lastMessage?: {
                        createdAt: string;
                        updatedAt: string;
                        message: {
                            createdAt?: string | undefined;
                            content: string;
                            id: string;
                            reasoning?: string | undefined;
                            experimental_attachments?: {
                                name?: string | undefined;
                                contentType?: string | undefined;
                                url: string;
                            }[] | undefined;
                            role: "system" | "user" | "assistant" | "data";
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
                        createdBy: `usr_${string}`;
                        updatedBy: `usr_${string}`;
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
        } | {
            input: {
                param: {
                    organizationId: string;
                    workspaceId: string;
                };
            } & {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    search?: string | undefined;
                    orderBy?: "title" | "createdAt" | "updatedAt" | undefined;
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
                    page?: string | undefined;
                    limit?: string | undefined;
                    search?: string | undefined;
                    orderBy?: "title" | "createdAt" | "updatedAt" | undefined;
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
                    page?: string | undefined;
                    limit?: string | undefined;
                    search?: string | undefined;
                    orderBy?: "title" | "createdAt" | "updatedAt" | undefined;
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
                    page?: string | undefined;
                    limit?: string | undefined;
                    search?: string | undefined;
                    orderBy?: "title" | "createdAt" | "updatedAt" | undefined;
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
                createdAt: string;
                updatedAt: string;
                id: `cnv_${string}`;
                createdBy: `usr_${string}`;
                updatedBy: `usr_${string}`;
                workspaceId: `wsp_${string}`;
                messages: {
                    createdAt: string;
                    updatedAt: string;
                    message: {
                        createdAt?: string | undefined;
                        content: string;
                        id: string;
                        reasoning?: string | undefined;
                        experimental_attachments?: {
                            name?: string | undefined;
                            contentType?: string | undefined;
                            url: string;
                        }[] | undefined;
                        role: "system" | "user" | "assistant" | "data";
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
                    createdBy: `usr_${string}`;
                    updatedBy: `usr_${string}`;
                    workspaceId: `wsp_${string}`;
                    conversationId: `cnv_${string}`;
                }[];
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
