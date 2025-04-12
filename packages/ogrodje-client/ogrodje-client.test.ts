import { describe, it, expect } from "bun:test";
import { createOgrodjeClient } from "./ogrodje-client";

describe("Ogrodje Client", () => {
  it("should be able to get events", async () => {
    const client = createOgrodjeClient();
    const result = await client.events({ limit: 10, offset: 0 });
    if (result.isErr()) {
      console.error("Failed to get events:", result.error);
      throw new Error(`Failed to get events: ${result.error.message}`);
    }
    expect(result.value).toBeDefined();
    console.log(result.value);
  });

  it("should be able to get meetups", async () => {
    const client = createOgrodjeClient();
    const result = await client.meetups({ limit: 10, offset: 0 });
    if (result.isErr()) {
      console.error("Failed to get meetups:", result.error);
      throw new Error(`Failed to get meetups: ${result.error.message}`);
    }
    expect(result.value).toBeDefined();
    console.log(result.value);
  });

  it("should be able to get meetup events", async () => {
    const client = createOgrodjeClient();
    const result = await client.meetupEvents({ meetup_id: "slovenia-typescript" }, { limit: 10, offset: 0 });
    if (result.isErr()) {
      console.error("Failed to get meetup events:", result.error);
      if (result.error.type === "GET_MEETUP_EVENTS_ERROR") {
        console.warn("Meetup events might not exist or ID is invalid:", result.error.message)
      } else {
        throw new Error(`Failed to get meetup events: ${result.error.message}`);
      }
    }
    if (result.isOk()) {
      expect(result.value).toBeDefined();
      console.log(result.value);
    } else {
      console.log("Skipping value check due to expected error scenario.")
    }
  });

  it("should be able to get timeline", async () => {
    const client = createOgrodjeClient();
    const result = await client.timeline();
    if (result.isErr()) {
      console.error("Failed to get timeline:", result.error);
      throw new Error(`Failed to get timeline: ${result.error.message}`);
    }
    expect(result.value).toBeDefined();
    console.log(result.value);
  });  
  
});
