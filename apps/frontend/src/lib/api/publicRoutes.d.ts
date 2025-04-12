import type { ContextVariables } from "@/types";
import { type Message } from "ai";
export declare const publicRoutes: import("hono/hono-base").HonoBase<{
    Variables: ContextVariables;
}, {
    "*": {};
} | import("hono/types").MergeSchemaPath<{
    "/": {
        $post: {
            input: {
                json: {
                    walletAddress: string;
                    workspaceId: string;
                };
            };
            output: {
                title: string;
                workspaceId: `wsp_${string}`;
                id: `cnv_${string}`;
                createdAt: string;
                updatedAt: string;
                createdBy: `usr_${string}`;
                updatedBy: `usr_${string}`;
                messages: {
                    message: {
                        content: string;
                        id: string;
                        createdAt?: string | undefined;
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
                    workspaceId: `wsp_${string}`;
                    id: `msg_${string}`;
                    createdAt: string;
                    updatedAt: string;
                    createdBy: `usr_${string}`;
                    updatedBy: `usr_${string}`;
                    conversationId: `cnv_${string}`;
                }[];
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                json: {
                    walletAddress: string;
                    workspaceId: string;
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
                json: {
                    walletAddress: string;
                    workspaceId: string;
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
                json: {
                    walletAddress: string;
                    workspaceId: string;
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
                json: {
                    walletAddress: string;
                    workspaceId: string;
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
                json: {
                    walletAddress: string;
                    workspaceId: string;
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 500;
        };
    };
}, "/public/initialize"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {};
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {};
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 403;
        } | {
            input: {};
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 404;
        } | {
            input: {};
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {};
            output: {
                title: string;
                workspaceId: `wsp_${string}`;
                id: `cnv_${string}`;
                createdAt: string;
                updatedAt: string;
                createdBy: `usr_${string}`;
                updatedBy: `usr_${string}`;
                messages: {
                    message: {
                        content: string;
                        id: string;
                        createdAt?: string | undefined;
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
                    workspaceId: `wsp_${string}`;
                    id: `msg_${string}`;
                    createdAt: string;
                    updatedAt: string;
                    createdBy: `usr_${string}`;
                    updatedBy: `usr_${string}`;
                    conversationId: `cnv_${string}`;
                }[];
            }[];
            outputFormat: "json";
            status: 200;
        };
    };
}, "/public/conversations"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                param: {
                    conversationId: string;
                };
            };
            output: {
                title: string;
                workspaceId: `wsp_${string}`;
                id: `cnv_${string}`;
                createdAt: string;
                updatedAt: string;
                createdBy: `usr_${string}`;
                updatedBy: `usr_${string}`;
                messages: {
                    message: {
                        content: string;
                        id: string;
                        createdAt?: string | undefined;
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
                    workspaceId: `wsp_${string}`;
                    id: `msg_${string}`;
                    createdAt: string;
                    updatedAt: string;
                    createdBy: `usr_${string}`;
                    updatedBy: `usr_${string}`;
                    conversationId: `cnv_${string}`;
                }[];
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                param: {
                    conversationId: string;
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
                };
            };
            output: {
                requestId: `req_${string}`;
                message: string;
            };
            outputFormat: "json";
            status: 500;
        };
    };
}, "/public/conversations/:conversationId"> | import("hono/types").MergeSchemaPath<{
    "/": {
        $post: {
            input: {
                param: {
                    conversationId: string;
                };
            } & {
                json: {
                    message: Omit<Message, "data" | "annotations">;
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
                };
            } & {
                json: {
                    message: Omit<Message, "data" | "annotations">;
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
                };
            } & {
                json: {
                    message: Omit<Message, "data" | "annotations">;
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
                };
            } & {
                json: {
                    message: Omit<Message, "data" | "annotations">;
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
                };
            } & {
                json: {
                    message: Omit<Message, "data" | "annotations">;
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
                };
            } & {
                json: {
                    message: Omit<Message, "data" | "annotations">;
                };
            };
            output: {};
            outputFormat: string;
            status: 200;
        };
    };
}, "/public/conversations/:conversationId/messages">, "/public">;
export type PublicRoutes = typeof publicRoutes;
