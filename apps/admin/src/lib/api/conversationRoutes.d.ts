import { z } from "zod";
export declare const ORDER_DIRECTIONS: readonly ["asc", "desc"];
export declare const ORDER_BY_FIELDS: readonly ["title", "createdAt", "updatedAt"];
export declare const OrderDirection: z.ZodEnum<["asc", "desc"]>;
export declare const OrderByField: z.ZodEnum<["title", "createdAt", "updatedAt"]>;
export type OrderDirection = z.infer<typeof OrderDirection>;
export type OrderByField = z.infer<typeof OrderByField>;
export declare const ListConversationsSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    orderBy: z.ZodOptional<z.ZodEnum<["title", "createdAt", "updatedAt"]>>;
    orderDirection: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    limit?: string | undefined;
    orderBy?: "createdAt" | "updatedAt" | "title" | undefined;
    page?: string | undefined;
    orderDirection?: "asc" | "desc" | undefined;
}, {
    search?: string | undefined;
    limit?: string | undefined;
    orderBy?: "createdAt" | "updatedAt" | "title" | undefined;
    page?: string | undefined;
    orderDirection?: "asc" | "desc" | undefined;
}>;
export type ListConversationsSchema = z.infer<typeof ListConversationsSchema>;
export declare const ListConversationsRouteSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<z.objectUtil.extendShape<{
        createdBy: z.ZodEffects<z.ZodString, `mbr_${string}`, string>;
        updatedBy: z.ZodEffects<z.ZodString, `mbr_${string}`, string>;
        workspaceId: z.ZodEffects<z.ZodString, `wsp_${string}`, string>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        id: z.ZodEffects<z.ZodString, `cnv_${string}`, string>;
        title: z.ZodString;
    }, {
        lastMessage: z.ZodOptional<import("drizzle-zod").BuildSchema<"select", {
            createdBy: import("drizzle-orm/pg-core").PgColumn<{
                name: string;
                tableName: "messages";
                dataType: "custom";
                columnType: "PgCustomColumn";
                data: `mbr_${string}`;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: undefined;
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {
                pgColumnBuilderBrand: "PgCustomColumnBuilderBrand";
            }>;
            updatedBy: import("drizzle-orm/pg-core").PgColumn<{
                name: string;
                tableName: "messages";
                dataType: "custom";
                columnType: "PgCustomColumn";
                data: `mbr_${string}`;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: undefined;
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {
                pgColumnBuilderBrand: "PgCustomColumnBuilderBrand";
            }>;
            workspaceId: import("drizzle-orm/pg-core").PgColumn<{
                name: string;
                tableName: "messages";
                dataType: "custom";
                columnType: "PgCustomColumn";
                data: `wsp_${string}`;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: undefined;
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {
                pgColumnBuilderBrand: "PgCustomColumnBuilderBrand";
            }>;
            createdAt: import("drizzle-orm/pg-core").PgColumn<{
                name: string;
                tableName: "messages";
                dataType: "date";
                columnType: "PgTimestamp";
                data: Date;
                driverParam: string;
                notNull: true;
                hasDefault: true;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: undefined;
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {}>;
            updatedAt: import("drizzle-orm/pg-core").PgColumn<{
                name: string;
                tableName: "messages";
                dataType: "date";
                columnType: "PgTimestamp";
                data: Date;
                driverParam: string;
                notNull: true;
                hasDefault: true;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: undefined;
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {}>;
            id: import("drizzle-orm/pg-core").PgColumn<{
                name: string;
                tableName: "messages";
                dataType: "custom";
                columnType: "PgCustomColumn";
                data: `msg_${string}`;
                driverParam: string;
                notNull: true;
                hasDefault: true;
                isPrimaryKey: true;
                isAutoincrement: false;
                hasRuntimeDefault: true;
                enumValues: undefined;
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {
                pgColumnBuilderBrand: "PgCustomColumnBuilderBrand";
                $type: `msg_${string}`;
            }>;
            conversationId: import("drizzle-orm/pg-core").PgColumn<{
                name: string;
                tableName: "messages";
                dataType: "custom";
                columnType: "PgCustomColumn";
                data: `cnv_${string}`;
                driverParam: string;
                notNull: true;
                hasDefault: false;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: undefined;
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {
                pgColumnBuilderBrand: "PgCustomColumnBuilderBrand";
                $type: `cnv_${string}`;
            }>;
            message: import("drizzle-orm/pg-core").PgColumn<{
                name: "message";
                tableName: "messages";
                dataType: "json";
                columnType: "PgJsonb";
                data: import("ai").Message;
                driverParam: unknown;
                notNull: true;
                hasDefault: false;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: undefined;
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {
                $type: import("ai").Message;
            }>;
        }, {
            id: z.ZodEffects<z.ZodString, `msg_${string}`, string>;
            conversationId: z.ZodEffects<z.ZodString, `cnv_${string}`, string>;
            message: z.ZodType<Omit<import("ai").Message, "data" | "annotations">, z.ZodTypeDef, Omit<import("ai").Message, "data" | "annotations">>;
            createdAt: z.ZodDate;
            updatedAt: z.ZodDate;
            createdBy: z.ZodEffects<z.ZodString, `mbr_${string}`, string>;
            updatedBy: z.ZodEffects<z.ZodString, `mbr_${string}`, string>;
            workspaceId: z.ZodEffects<z.ZodString, `wsp_${string}`, string>;
        }>>;
    }>, "strip", z.ZodTypeAny, {
        id: `cnv_${string}`;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        createdBy: `mbr_${string}`;
        updatedBy: `mbr_${string}`;
        workspaceId: `wsp_${string}`;
        lastMessage?: {
            message: Omit<import("ai").Message, "data" | "annotations">;
            id: `msg_${string}`;
            createdAt: Date;
            updatedAt: Date;
            createdBy: `mbr_${string}`;
            updatedBy: `mbr_${string}`;
            workspaceId: `wsp_${string}`;
            conversationId: `cnv_${string}`;
        } | undefined;
    }, {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        createdBy: string;
        updatedBy: string;
        workspaceId: string;
        lastMessage?: {
            message: Omit<import("ai").Message, "data" | "annotations">;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            updatedBy: string;
            workspaceId: string;
            conversationId: string;
        } | undefined;
    }>, "many">;
    pagination: z.ZodObject<{
        currentPage: z.ZodNumber;
        totalPages: z.ZodNumber;
        pageSize: z.ZodNumber;
        totalCount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalCount: number;
    }, {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalCount: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        id: `cnv_${string}`;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        createdBy: `mbr_${string}`;
        updatedBy: `mbr_${string}`;
        workspaceId: `wsp_${string}`;
        lastMessage?: {
            message: Omit<import("ai").Message, "data" | "annotations">;
            id: `msg_${string}`;
            createdAt: Date;
            updatedAt: Date;
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
}, {
    data: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        createdBy: string;
        updatedBy: string;
        workspaceId: string;
        lastMessage?: {
            message: Omit<import("ai").Message, "data" | "annotations">;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            createdBy: string;
            updatedBy: string;
            workspaceId: string;
            conversationId: string;
        } | undefined;
    }[];
    pagination: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalCount: number;
    };
}>;
export type ListConversationsRouteSchema = z.infer<typeof ListConversationsRouteSchema>;
export declare const CreateConversationSchema: z.ZodObject<{
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
}, {
    title: string;
}>;
export type CreateConversationSchema = z.infer<typeof CreateConversationSchema>;
export declare const UpdateConversationSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
}, {
    title?: string | undefined;
}>;
export type UpdateConversationSchema = z.infer<typeof UpdateConversationSchema>;
export declare const GetConversationSchema: import("drizzle-zod").BuildSchema<"select", {
    createdBy: import("drizzle-orm/pg-core").PgColumn<{
        name: string;
        tableName: "conversations";
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: `mbr_${string}`;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        pgColumnBuilderBrand: "PgCustomColumnBuilderBrand";
    }>;
    updatedBy: import("drizzle-orm/pg-core").PgColumn<{
        name: string;
        tableName: "conversations";
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: `mbr_${string}`;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        pgColumnBuilderBrand: "PgCustomColumnBuilderBrand";
    }>;
    workspaceId: import("drizzle-orm/pg-core").PgColumn<{
        name: string;
        tableName: "conversations";
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: `wsp_${string}`;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        pgColumnBuilderBrand: "PgCustomColumnBuilderBrand";
    }>;
    createdAt: import("drizzle-orm/pg-core").PgColumn<{
        name: string;
        tableName: "conversations";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    updatedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: string;
        tableName: "conversations";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    id: import("drizzle-orm/pg-core").PgColumn<{
        name: string;
        tableName: "conversations";
        dataType: "custom";
        columnType: "PgCustomColumn";
        data: `cnv_${string}`;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: true;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        pgColumnBuilderBrand: "PgCustomColumnBuilderBrand";
        $type: `cnv_${string}`;
    }>;
    title: import("drizzle-orm/pg-core").PgColumn<{
        name: "title";
        tableName: "conversations";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 255;
    }>;
}, {
    id: z.ZodEffects<z.ZodString, `cnv_${string}`, string>;
    workspaceId: z.ZodEffects<z.ZodString, `wsp_${string}`, string>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    createdBy: z.ZodEffects<z.ZodString, `mbr_${string}`, string>;
    updatedBy: z.ZodEffects<z.ZodString, `mbr_${string}`, string>;
}>;
export type GetConversationSchema = z.infer<typeof GetConversationSchema>;
declare const conversationRoutes: import("hono/hono-base").HonoBase<{
    Variables: import("../../types").ContextVariables;
} & {
    Variables: import("../../types").ContextVariables;
}, {
    "/api/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/*": {};
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
            status: 500;
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
                id: `cnv_${string}`;
                createdAt: string;
                updatedAt: string;
                title: string;
                createdBy: `mbr_${string}`;
                updatedBy: `mbr_${string}`;
                workspaceId: `wsp_${string}`;
            };
            outputFormat: "json";
            status: 201;
        };
    };
}, "/api/organizations/:organizationId/workspaces/:workspaceId/chat/conversations"> | import("hono/types").MergeSchemaPath<{
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
                    limit?: string | undefined;
                    orderBy?: "createdAt" | "updatedAt" | "title" | undefined;
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
                    limit?: string | undefined;
                    orderBy?: "createdAt" | "updatedAt" | "title" | undefined;
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
                    limit?: string | undefined;
                    orderBy?: "createdAt" | "updatedAt" | "title" | undefined;
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
                    limit?: string | undefined;
                    orderBy?: "createdAt" | "updatedAt" | "title" | undefined;
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
                    limit?: string | undefined;
                    orderBy?: "createdAt" | "updatedAt" | "title" | undefined;
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
                    limit?: string | undefined;
                    orderBy?: "createdAt" | "updatedAt" | "title" | undefined;
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
                    id: `cnv_${string}`;
                    createdAt: string;
                    updatedAt: string;
                    title: string;
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
}, "/api/organizations/:organizationId/workspaces/:workspaceId/chat/conversations"> | import("hono/types").MergeSchemaPath<{
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
                id: `cnv_${string}`;
                createdAt: string;
                updatedAt: string;
                title: string;
                createdBy: `mbr_${string}`;
                updatedBy: `mbr_${string}`;
                workspaceId: `wsp_${string}`;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId"> | import("hono/types").MergeSchemaPath<{
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
                id: `cnv_${string}`;
                createdAt: string;
                updatedAt: string;
                title: string;
                createdBy: `mbr_${string}`;
                updatedBy: `mbr_${string}`;
                workspaceId: `wsp_${string}`;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId"> | import("hono/types").MergeSchemaPath<{
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
}, "/api/organizations/:organizationId/workspaces/:workspaceId/chat/conversations/:conversationId">, "/api/organizations/:organizationId/workspaces/:workspaceId/chat/conversations">;
export { conversationRoutes };
