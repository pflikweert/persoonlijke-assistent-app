#!/usr/bin/env node
import {
  assertLocalTarget,
  createServiceRoleClient,
  findOrCreateLocalSmokeUser,
  resolveLocalAuthSmokeContext,
  resolveSmokeEmail,
} from "./_shared/local-auth-smoke-utils.mjs";

const FIXTURE_SOURCE = "local-page-swipe-smoke";
const DAY_DATES = ["2026-07-01", "2026-07-02"];
const WEEK_STARTS = ["2026-06-22", "2026-06-29"];
const MONTH_STARTS = ["2026-06-01", "2026-07-01"];

const LONG_LINES = Array.from(
  { length: 14 },
  (_, index) => `Regel ${index + 1} voor swipe-scroll bewijs.`,
).join("\n");

function longText(prefix) {
  return `${prefix}\n\nDeze fixture maakt de pagina bewust langer zodat Playwright eerst verticaal kan scrollen en daarna horizontaal kan swipen.\n\n${LONG_LINES}`;
}

function addDaysUtc(day, days) {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function monthEnd(monthStart) {
  const date = new Date(`${monthStart}T00:00:00.000Z`);
  date.setUTCMonth(date.getUTCMonth() + 1, 0);
  return date.toISOString().slice(0, 10);
}

async function cleanupFixtureRows(supabase, userId) {
  const { error: dayError } = await supabase
    .from("day_journals")
    .delete()
    .eq("user_id", userId)
    .in("journal_date", DAY_DATES);

  if (dayError) {
    throw dayError;
  }

  const { error: reflectionError } = await supabase
    .from("period_reflections")
    .delete()
    .eq("user_id", userId)
    .in("period_start", [...WEEK_STARTS, ...MONTH_STARTS]);

  if (reflectionError) {
    throw reflectionError;
  }
}

async function seedFixture({ context, email }) {
  assertLocalTarget(context);
  const userId = await findOrCreateLocalSmokeUser(context, email, {
    smoke_fixture: FIXTURE_SOURCE,
  });
  const supabase = await createServiceRoleClient(context);

  await cleanupFixtureRows(supabase, userId);

  const firstDaySummary = "Eerste dag swipe smoke samenvatting.";
  const secondDaySummary = "Tweede dag swipe smoke samenvatting.";
  const firstWeekSummary = "Eerste week swipe smoke samenvatting.";
  const secondWeekSummary = "Tweede week swipe smoke samenvatting.";
  const firstMonthSummary = "Eerste maand swipe smoke samenvatting.";
  const secondMonthSummary = "Tweede maand swipe smoke samenvatting.";

  const { error: dayInsertError } = await supabase.from("day_journals").insert([
    {
      user_id: userId,
      journal_date: DAY_DATES[0],
      summary: firstDaySummary,
      narrative_text: longText("Eerste dag swipe smoke verhaal."),
      sections: ["Eerste dag kernpunt.", "Tweede dag kernpunt."],
      generation_meta: { source: FIXTURE_SOURCE },
    },
    {
      user_id: userId,
      journal_date: DAY_DATES[1],
      summary: secondDaySummary,
      narrative_text: longText("Tweede dag swipe smoke verhaal."),
      sections: ["Volgende dag kernpunt.", "Tweede volgende dag kernpunt."],
      generation_meta: { source: FIXTURE_SOURCE },
    },
  ]);

  if (dayInsertError) {
    throw dayInsertError;
  }

  const { error: reflectionInsertError } = await supabase
    .from("period_reflections")
    .insert([
      {
        user_id: userId,
        period_type: "week",
        period_start: WEEK_STARTS[0],
        period_end: addDaysUtc(WEEK_STARTS[0], 6),
        summary_text: firstWeekSummary,
        narrative_text: longText("Eerste week swipe smoke verhaal."),
        highlights_json: ["Eerste week highlight."],
        reflection_points_json: ["Eerste week reflectiepunt."],
        model_version: "local-smoke",
        generation_meta: { source: FIXTURE_SOURCE },
      },
      {
        user_id: userId,
        period_type: "week",
        period_start: WEEK_STARTS[1],
        period_end: addDaysUtc(WEEK_STARTS[1], 6),
        summary_text: secondWeekSummary,
        narrative_text: longText("Tweede week swipe smoke verhaal."),
        highlights_json: ["Tweede week highlight."],
        reflection_points_json: ["Tweede week reflectiepunt."],
        model_version: "local-smoke",
        generation_meta: { source: FIXTURE_SOURCE },
      },
      {
        user_id: userId,
        period_type: "month",
        period_start: MONTH_STARTS[0],
        period_end: monthEnd(MONTH_STARTS[0]),
        summary_text: firstMonthSummary,
        narrative_text: longText("Eerste maand swipe smoke verhaal."),
        highlights_json: ["Eerste maand highlight."],
        reflection_points_json: ["Eerste maand reflectiepunt."],
        model_version: "local-smoke",
        generation_meta: { source: FIXTURE_SOURCE },
      },
      {
        user_id: userId,
        period_type: "month",
        period_start: MONTH_STARTS[1],
        period_end: monthEnd(MONTH_STARTS[1]),
        summary_text: secondMonthSummary,
        narrative_text: longText("Tweede maand swipe smoke verhaal."),
        highlights_json: ["Tweede maand highlight."],
        reflection_points_json: ["Tweede maand reflectiepunt."],
        model_version: "local-smoke",
        generation_meta: { source: FIXTURE_SOURCE },
      },
    ]);

  if (reflectionInsertError) {
    throw reflectionInsertError;
  }

  const appUrl = context.appUrl.replace(/\/+$/, "");
  return {
    email,
    dayUrl: `${appUrl}/day/${DAY_DATES[0]}`,
    nextDayUrlPath: `/day/${DAY_DATES[1]}`,
    weekUrl: `${appUrl}/reflections?period=week&anchorDate=${WEEK_STARTS[0]}`,
    monthUrl: `${appUrl}/reflections?period=month&anchorDate=${MONTH_STARTS[0]}`,
    firstDaySummary,
    secondDaySummary,
    firstWeekSummary,
    secondWeekSummary,
    firstMonthSummary,
    secondMonthSummary,
  };
}

async function main() {
  const context = resolveLocalAuthSmokeContext();
  const email = process.env.SMOKE_TEST_EMAIL || resolveSmokeEmail(process.env.SMOKE_TEST_EMAIL_PROFILE);
  const cleanupOnly = process.argv.includes("--cleanup");

  assertLocalTarget(context);
  const userId = await findOrCreateLocalSmokeUser(context, email, {
    smoke_fixture: FIXTURE_SOURCE,
  });
  const supabase = await createServiceRoleClient(context);

  if (cleanupOnly) {
    await cleanupFixtureRows(supabase, userId);
    console.log(`PASS page-swipe-smoke-cleanup email=${email}`);
    return;
  }

  const result = await seedFixture({ context, email });
  console.log("PASS page-swipe-smoke-seed");
  console.log(formatEnv("SMOKE_TEST_EMAIL", result.email));
  console.log(formatEnv("PAGE_SWIPE_E2E_DAY_URL", result.dayUrl));
  console.log(formatEnv("PAGE_SWIPE_E2E_NEXT_DAY_PATH", result.nextDayUrlPath));
  console.log(formatEnv("PAGE_SWIPE_E2E_WEEK_URL", result.weekUrl));
  console.log(formatEnv("PAGE_SWIPE_E2E_MONTH_URL", result.monthUrl));
  console.log(formatEnv("PAGE_SWIPE_E2E_FIRST_DAY_SUMMARY", result.firstDaySummary));
  console.log(formatEnv("PAGE_SWIPE_E2E_SECOND_DAY_SUMMARY", result.secondDaySummary));
  console.log(formatEnv("PAGE_SWIPE_E2E_FIRST_WEEK_SUMMARY", result.firstWeekSummary));
  console.log(formatEnv("PAGE_SWIPE_E2E_SECOND_WEEK_SUMMARY", result.secondWeekSummary));
  console.log(formatEnv("PAGE_SWIPE_E2E_FIRST_MONTH_SUMMARY", result.firstMonthSummary));
  console.log(formatEnv("PAGE_SWIPE_E2E_SECOND_MONTH_SUMMARY", result.secondMonthSummary));
}

function formatEnv(name, value) {
  return `${name}=${JSON.stringify(value)}`;
}

main().catch((error) => {
  console.error("FAIL page-swipe-smoke-seed:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
