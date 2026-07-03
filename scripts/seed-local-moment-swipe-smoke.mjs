#!/usr/bin/env node
import {
  assertLocalTarget,
  createServiceRoleClient,
  findOrCreateLocalSmokeUser,
  resolveLocalAuthSmokeContext,
  resolveSmokeEmail,
} from "./_shared/local-auth-smoke-utils.mjs";

const FIXTURE_SOURCE_TYPE = "local-moment-swipe-smoke";
const FIXTURE_SOURCE_REF = "moment-detail-swipe";

async function cleanupFixtureRows(supabase, userId) {
  const { error } = await supabase
    .from("entries_raw")
    .delete()
    .eq("user_id", userId)
    .eq("import_source_type", FIXTURE_SOURCE_TYPE)
    .eq("import_source_ref", FIXTURE_SOURCE_REF);

  if (error) {
    throw error;
  }
}

async function insertMoment(supabase, userId, input) {
  const { data: rawEntry, error: rawError } = await supabase
    .from("entries_raw")
    .insert({
      user_id: userId,
      source_type: "text",
      raw_text: input.body,
      captured_at: input.capturedAt,
      journal_date: input.journalDate,
      import_source_type: FIXTURE_SOURCE_TYPE,
      import_source_ref: FIXTURE_SOURCE_REF,
      import_file_name: "moment-swipe-smoke",
    })
    .select("id")
    .single();

  if (rawError) {
    throw rawError;
  }

  const { data: normalizedEntry, error: normalizedError } = await supabase
    .from("entries_normalized")
    .insert({
      user_id: userId,
      raw_entry_id: rawEntry.id,
      title: input.title,
      body: input.body,
      summary_short: input.summary,
      generation_meta: {
        source: FIXTURE_SOURCE_TYPE,
      },
    })
    .select("id")
    .single();

  if (normalizedError) {
    throw normalizedError;
  }

  return normalizedEntry.id;
}

async function seedMomentSwipeFixture({ context, email }) {
  assertLocalTarget(context);
  const userId = await findOrCreateLocalSmokeUser(context, email, {
    smoke_fixture: FIXTURE_SOURCE_TYPE,
  });
  const supabase = await createServiceRoleClient(context);

  await cleanupFixtureRows(supabase, userId);

  const journalDate = "2026-07-03";
  const firstId = await insertMoment(supabase, userId, {
    title: "Eerste swipe smoke moment",
    body: "Eerste lokaal testmoment voor swipe navigatie.",
    summary: "Eerste swipe smoke moment.",
    capturedAt: `${journalDate}T08:00:00.000Z`,
    journalDate,
  });
  const secondId = await insertMoment(supabase, userId, {
    title: "Tweede swipe smoke moment",
    body: "Tweede lokaal testmoment voor swipe navigatie.",
    summary: "Tweede swipe smoke moment.",
    capturedAt: `${journalDate}T09:00:00.000Z`,
    journalDate,
  });

  return {
    email,
    firstId,
    secondId,
    firstTitle: "Eerste swipe smoke moment",
    secondTitle: "Tweede swipe smoke moment",
    entryUrl: `${context.appUrl.replace(/\/+$/, "")}/entry/${firstId}`,
  };
}

async function main() {
  const context = resolveLocalAuthSmokeContext();
  const email = process.env.SMOKE_TEST_EMAIL || resolveSmokeEmail(process.env.SMOKE_TEST_EMAIL_PROFILE);
  const cleanupOnly = process.argv.includes("--cleanup");

  assertLocalTarget(context);
  const userId = await findOrCreateLocalSmokeUser(context, email, {
    smoke_fixture: FIXTURE_SOURCE_TYPE,
  });
  const supabase = await createServiceRoleClient(context);

  if (cleanupOnly) {
    await cleanupFixtureRows(supabase, userId);
    console.log(`PASS moment-swipe-smoke-cleanup email=${email}`);
    return;
  }

  const result = await seedMomentSwipeFixture({ context, email });
  console.log("PASS moment-swipe-smoke-seed");
  console.log(formatEnv("SMOKE_TEST_EMAIL", result.email));
  console.log(formatEnv("MOMENT_SWIPE_E2E_ENTRY_URL", result.entryUrl));
  console.log(formatEnv("MOMENT_SWIPE_E2E_START_TITLE", result.firstTitle));
  console.log(formatEnv("MOMENT_SWIPE_E2E_NEXT_TITLE", result.secondTitle));
  console.log(formatEnv("MOMENT_SWIPE_E2E_NEXT_ENTRY_ID", result.secondId));
}

function formatEnv(name, value) {
  return `${name}=${JSON.stringify(value)}`;
}

main().catch((error) => {
  console.error("FAIL moment-swipe-smoke-seed:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
