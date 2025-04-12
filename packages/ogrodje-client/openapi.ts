export const openapi = {
	openapi: "3.1.0",
	info: {
		title: "Ogrodje Goo",
		version: "1.0",
	},
	paths: {
		"/events": {
			get: {
				description: "All Events\n\n",
				parameters: [
					{
						name: "limit",
						in: "query",
						schema: {
							type: "integer",
							format: "int32",
						},
						allowReserved: false,
						style: "form",
					},
					{
						name: "offset",
						in: "query",
						schema: {
							type: "integer",
							format: "int32",
						},
						allowReserved: false,
						style: "form",
					},
				],
				responses: {
					"200": {
						content: {
							"application/json": {
								schema: {
									type: "array",
									items: {
										$ref: "#/components/schemas/Event",
									},
								},
							},
						},
					},
				},
			},
		},
		"/meetups": {
			get: {
				description: "All meetups\n\n",
				parameters: [
					{
						name: "limit",
						in: "query",
						schema: {
							type: "integer",
							format: "int32",
						},
						allowReserved: false,
						style: "form",
					},
					{
						name: "offset",
						in: "query",
						schema: {
							type: "integer",
							format: "int32",
						},
						allowReserved: false,
						style: "form",
					},
				],
				responses: {
					"200": {
						content: {
							"application/json": {
								schema: {
									type: "array",
									items: {
										$ref: "#/components/schemas/Meetup",
									},
								},
							},
						},
					},
				},
			},
		},
		"/meetups/{meetup_id}/events": {
			get: {
				description: "All events for a meetup\n\n",
				parameters: [
					{
						name: "limit",
						in: "query",
						schema: {
							type: "integer",
							format: "int32",
						},
						allowReserved: false,
						style: "form",
					},
					{
						name: "offset",
						in: "query",
						schema: {
							type: "integer",
							format: "int32",
						},
						allowReserved: false,
						style: "form",
					},
					{
						name: "meetup_id",
						in: "path",
						required: true,
						schema: {
							type: "string",
						},
						style: "simple",
					},
				],
				responses: {
					"200": {
						content: {
							"application/json": {
								schema: {
									type: "array",
									items: {
										$ref: "#/components/schemas/Event",
									},
								},
							},
						},
					},
				},
			},
		},
		"/timeline": {
			get: {
				description: "Events timeline\n\n",
				responses: {
					"200": {
						content: {
							"application/json": {
								schema: {
									type: "array",
									items: {
										$ref: "#/components/schemas/TimelineEvent",
									},
								},
							},
						},
					},
				},
			},
		},
	},
	components: {
		schemas: {
			Event: {
				type: "object",
				properties: {
					sourceURL: {
						type: "string",
					},
					source: {
						$ref: "#/components/schemas/Source",
					},
					meetupID: {
						type: "string",
					},
					startDateTime: {
						type: "string",
					},
					eventURL: {
						type: ["string", "null"],
						description:
							"If not set, this field defaults to the value of the default annotation.",
						default: null,
					},
					locationAddress: {
						type: ["string", "null"],
						description:
							"If not set, this field defaults to the value of the default annotation.",
						default: null,
					},
					id: {
						type: "string",
					},
					locationName: {
						type: ["string", "null"],
						description:
							"If not set, this field defaults to the value of the default annotation.",
						default: null,
					},
					updatedAt: {
						type: ["string", "null"],
						description:
							"If not set, this field defaults to the value of the default annotation.",
						default: null,
					},
					hasEndTime: {
						type: "boolean",
						description:
							"If not set, this field defaults to the value of the default annotation.",
						default: true,
					},
					description: {
						type: ["string", "null"],
						description:
							"If not set, this field defaults to the value of the default annotation.",
						default: null,
					},
					endDateTime: {
						type: ["string", "null"],
						description:
							"If not set, this field defaults to the value of the default annotation.",
						default: null,
					},
					title: {
						type: "string",
					},
					hasStartTime: {
						type: "boolean",
						description:
							"If not set, this field defaults to the value of the default annotation.",
						default: true,
					},
				},
				required: [
					"id",
					"meetupID",
					"source",
					"sourceURL",
					"title",
					"startDateTime",
				],
			},
			Meetup: {
				type: "object",
				properties: {
					meetupUrl: {
						type: ["string", "null"],
					},
					icalUrl: {
						type: ["string", "null"],
					},
					homepageUrl: {
						type: ["string", "null"],
					},
					id: {
						type: "string",
					},
					kompotUrl: {
						type: ["string", "null"],
					},
					createdAt: {
						type: "string",
					},
					discordUrl: {
						type: ["string", "null"],
					},
					linkedinUrl: {
						type: ["string", "null"],
					},
					eventbriteUrl: {
						type: ["string", "null"],
					},
					stage: {
						type: ["string", "null"],
					},
					name: {
						type: "string",
					},
					updatedAt: {
						type: "string",
					},
				},
				required: ["id", "name", "createdAt", "updatedAt"],
			},
			Source: {
				type: "string",
				enum: [
					"Meetup",
					"Eventbrite",
					"TehnoloskiParkLjubljana",
					"PrimorskiTehnoloskiPark",
					"GZS",
					"StartupSi",
					"ICal",
				],
			},
			TimelineEvent: {
				type: "object",
				properties: {
					sourceURL: {
						type: "string",
					},
					hasEndTime: {
						type: "boolean",
					},
					source: {
						$ref: "#/components/schemas/Source",
					},
					meetupID: {
						type: "string",
					},
					startDateTime: {
						type: "string",
					},
					eventURL: {
						type: ["string", "null"],
					},
					id: {
						type: "string",
					},
					locationName: {
						type: ["string", "null"],
					},
					description: {
						type: ["string", "null"],
					},
					endDateTime: {
						type: "string",
					},
					meetupName: {
						type: "string",
					},
					locationAddress: {
						type: ["string", "null"],
					},
					title: {
						type: "string",
					},
					hasStartTime: {
						type: "boolean",
					},
				},
				required: [
					"id",
					"meetupID",
					"source",
					"sourceURL",
					"title",
					"meetupName",
					"startDateTime",
					"hasStartTime",
					"endDateTime",
					"hasEndTime",
				],
			},
		},
	},
} as const;
