/**
 * Regressiecheck voor Prompt Assist semantics en output-parsing.
 * One-shot uitvoerbaar: node scripts/test-prompt-assist-semantics.mjs
 *
 * Dekt:
 * 1. layerSemantics bouwen per laagtype
 * 2. readOnlyContext correcte filtering (target excluded)
 * 3. invariants per taskKey
 * 4. allowedChangeKinds per actie + laag
 * 5. Layer-leakage detectie server-side (simulatie)
 * 6. LayerNoticeInfo correcte badgeLabels
 */

// ── 1. Minimal inline re-implementations of helpers for validation ──────────

function getLayerRoleForLayerType(layerType) {
  if (layerType === 'system') return 'high_precedence_instruction';
  if (layerType === 'general') return 'task_goal';
  return 'field_rule';
}

function getLayerPrecedence(layerType) {
  if (layerType === 'system') return 'high';
  return 'normal';
}

function buildLayerSemantics(sections) {
  return sections.map((section) => ({
    key: section.key,
    label: section.label,
    layerType: section.layerType,
    runtimeRole: getLayerRoleForLayerType(section.layerType),
    precedence: getLayerPrecedence(section.layerType),
    purpose: `Test purpose for ${section.key}`,
    preserveRules: [],
    forbiddenMoves: [],
  }));
}

function buildReadOnlyContext(sections, targetKey, sectionValues) {
  return sections
    .filter((s) => s.key !== targetKey)
    .map((s) => ({
      key: s.key,
      label: s.label,
      layerType: s.layerType,
      runtimeRole: getLayerRoleForLayerType(s.layerType),
      text: sectionValues[s.key] ?? '',
    }));
}

function buildAllowedChangeKinds(actionId, layerType) {
  if (actionId === 'verdeel_over_velden') return ['redistribute_with_explicit_justification'];
  const base = ['rewrite_within_layer'];
  if (actionId === 'compacter') return [...base, 'tighten_wording'];
  if (actionId === 'ontdubbelen') return [...base, 'dedupe_within_layer'];
  if (actionId === 'verhelderen' || actionId === 'maak_strikter') return [...base, 'clarify_execution', 'tighten_wording'];
  if (actionId === 'check_contract' || actionId === 'check_overlap' || actionId === 'check_outputvorm') {
    if (layerType === 'system') return ['tighten_wording'];
    return [...base, 'clarify_execution'];
  }
  if (actionId === 'verplaats_naar_juiste_laag') return [...base, 'clarify_execution'];
  return base;
}

function buildInvariants(taskKey) {
  const base = [{ id: 'no_external_sources', mustRemainHighPrecedence: true }];
  if (taskKey === 'entry_cleanup') {
    return [...base, { id: 'json_only_output', mustRemainHighPrecedence: true }, { id: 'no_summarization_of_body', mustRemainHighPrecedence: false }];
  }
  if (taskKey === 'day_summary') {
    return [...base, { id: 'no_therapy_language', mustRemainHighPrecedence: true }];
  }
  if (taskKey === 'week_summary') {
    return [...base, { id: 'source_bound_synthesis', mustRemainHighPrecedence: true }, { id: 'no_action_items', mustRemainHighPrecedence: false }];
  }
  return base;
}

function getLayerNoticeInfo(layerType, label) {
  if (layerType === 'system') {
    return { badgeLabel: 'Systeemlaag', isHighPrecedence: true };
  }
  if (layerType === 'general') {
    return { badgeLabel: 'Algemene instructie', isHighPrecedence: false };
  }
  return { badgeLabel: 'Veldlaag', isHighPrecedence: false };
}

// ── 2. Test helpers ─────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ ${label}`);
    failed++;
  }
}

// ── 3. Tests ─────────────────────────────────────────────────────────────────

const sections = [
  { key: 'systemRulesInstruction', label: 'Systeemregels', layerType: 'system' },
  { key: 'generalInstruction', label: 'Algemene instructie', layerType: 'general' },
  { key: 'titleInstruction', label: 'Titel', layerType: 'field' },
  { key: 'bodyInstruction', label: 'Body', layerType: 'field' },
];

const sectionValues = {
  systemRulesInstruction: 'Geen tekst buiten JSON.',
  generalInstruction: 'Opschonen van entry.',
  titleInstruction: 'Geef een korte titel.',
  bodyInstruction: 'Bewaar volledige tekst.',
};

// Test 1: layerSemantics bouwen
console.log('\n[1] buildLayerSemantics');
const semantics = buildLayerSemantics(sections);
assert(semantics.length === 4, 'Alle 4 lagen aanwezig');
assert(semantics[0].runtimeRole === 'high_precedence_instruction', 'system → high_precedence_instruction');
assert(semantics[0].precedence === 'high', 'system → high precedence');
assert(semantics[1].runtimeRole === 'task_goal', 'general → task_goal');
assert(semantics[1].precedence === 'normal', 'general → normal precedence');
assert(semantics[2].runtimeRole === 'field_rule', 'field → field_rule');
assert(semantics[3].runtimeRole === 'field_rule', 'field → field_rule (body)');

// Test 2: readOnlyContext target excluded
console.log('\n[2] buildReadOnlyContext');
const ctx = buildReadOnlyContext(sections, 'bodyInstruction', sectionValues);
assert(ctx.length === 3, 'Target uitgesloten: 3 sibling-lagen');
assert(!ctx.some((c) => c.key === 'bodyInstruction'), 'bodyInstruction niet in read-only context');
assert(ctx[0].key === 'systemRulesInstruction', 'systemRulesInstruction eerste in context');
assert(ctx[0].runtimeRole === 'high_precedence_instruction', 'runtimeRole correct voor sibling system-laag');
assert(ctx[0].text === 'Geen tekst buiten JSON.', 'Text correct doorgegeven');

// Test 3: invariants per taskKey
console.log('\n[3] buildInvariants');
const entryInvariants = buildInvariants('entry_cleanup');
const highPrecEntry = entryInvariants.filter((i) => i.mustRemainHighPrecedence);
assert(highPrecEntry.length >= 2, 'entry_cleanup: minstens 2 high-precedence invariants');
assert(entryInvariants.some((i) => i.id === 'json_only_output'), 'json_only_output aanwezig voor entry_cleanup');
assert(entryInvariants.some((i) => i.id === 'no_summarization_of_body'), 'no_summarization_of_body aanwezig (niet high-precedence)');
assert(!entryInvariants.find((i) => i.id === 'no_summarization_of_body')?.mustRemainHighPrecedence, 'no_summarization_of_body is niet high-precedence');

const weekInvariants = buildInvariants('week_summary');
assert(weekInvariants.some((i) => i.id === 'no_action_items'), 'no_action_items aanwezig voor week_summary');

const baseInvariants = buildInvariants('unknown_task');
assert(baseInvariants.length === 1, 'Onbekende task: alleen base invariant');
assert(baseInvariants[0].id === 'no_external_sources', 'Base invariant aanwezig');

// Test 4: allowedChangeKinds per actie + laag
console.log('\n[4] buildAllowedChangeKinds');
const compacterField = buildAllowedChangeKinds('compacter', 'field');
assert(compacterField.includes('rewrite_within_layer'), 'compacter → rewrite_within_layer');
assert(compacterField.includes('tighten_wording'), 'compacter → tighten_wording');

const verdeelKinds = buildAllowedChangeKinds('verdeel_over_velden', 'general');
assert(verdeelKinds.length === 1 && verdeelKinds[0] === 'redistribute_with_explicit_justification', 'verdeel_over_velden → alleen redistribute');

const checkContractSystem = buildAllowedChangeKinds('check_contract', 'system');
assert(!checkContractSystem.includes('rewrite_within_layer'), 'check_contract op system → geen rewrite_within_layer');
assert(checkContractSystem.includes('tighten_wording'), 'check_contract op system → tighten_wording');

const checkContractField = buildAllowedChangeKinds('check_contract', 'field');
assert(checkContractField.includes('rewrite_within_layer'), 'check_contract op field → rewrite_within_layer');

// Test 5: Layer-leakage detectie (server-side simulatie)
console.log('\n[5] Layer leakage detectie');
const systemLikePattern = /response_format|geen tekst buiten json|json_object|output schema|technical_contract/i;

const safeFieldText = 'Bewaar de volledige tekst van de entry in dit veld.';
const leakyFieldText = 'Output moet als json_object worden teruggegeven. Geen tekst buiten JSON.';
const borderlineFieldText = 'Gebruik alleen de opgegeven bronvelden.';

assert(!systemLikePattern.test(safeFieldText), 'Veilig veld: geen system-patroon gedetecteerd');
assert(systemLikePattern.test(leakyFieldText), 'Leaky veld: system-patroon correct gedetecteerd');
assert(!systemLikePattern.test(borderlineFieldText), 'Borderline: sourcebinding is geen system-leakage');

// Test 6: LayerNoticeInfo correcte labels
console.log('\n[6] getLayerNoticeInfo');
const systemNotice = getLayerNoticeInfo('system', 'Systeemregels');
assert(systemNotice.badgeLabel === 'Systeemlaag', 'system badge correct');
assert(systemNotice.isHighPrecedence === true, 'system isHighPrecedence correct');

const generalNotice = getLayerNoticeInfo('general', 'Algemene instructie');
assert(generalNotice.badgeLabel === 'Algemene instructie', 'general badge correct');
assert(generalNotice.isHighPrecedence === false, 'general isHighPrecedence correct');

const fieldNotice = getLayerNoticeInfo('field', 'Body');
assert(fieldNotice.badgeLabel === 'Veldlaag', 'field badge correct');
assert(fieldNotice.isHighPrecedence === false, 'field isHighPrecedence correct');

// ── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
console.log(`Resultaat: ${passed} geslaagd, ${failed} mislukt`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('✅ Alle checks geslaagd.');
}
