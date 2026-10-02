import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Exact preserved snapshots for the separately approved quick formatter gate.
// This gate does not certify generated reproducibility or close the full policy change.
// Both recorded Git-object and checkout identities are explicit raw-byte identities.
const preservedArtifacts = [
  {
    path: '.agents/skills/openspec-apply-change/SKILL.md',
    sha256: [
      '7c79315715da88639e60f05268206ba72939ef9bf298c6f3195152d09d20b3fe',
    ],
  },
  {
    path: '.agents/skills/openspec-archive-change/SKILL.md',
    sha256: [
      'e0ffaacdb982e7440e97979422a91178cc93220a5805bd07cbdaef82c33284ac',
    ],
  },
  {
    path: '.agents/skills/openspec-continue-change/SKILL.md',
    sha256: [
      '0176d962032c6c36011db0ef30c1cd6130ef6c34ebf359d64cdb21c958949972',
    ],
  },
  {
    path: '.agents/skills/openspec-explore/SKILL.md',
    sha256: [
      '95ed31936b538cbf44b5e3f7f81da50defd256d96048ee370d82b36e8ff5c486',
    ],
  },
  {
    path: '.agents/skills/openspec-new-change/SKILL.md',
    sha256: [
      '84374cb8ab0c6e076933126f688bc7f59abdfa7aced7bb710743dd3bf72e3383',
    ],
  },
  {
    path: '.agents/skills/openspec-propose/SKILL.md',
    sha256: [
      '0c95777dd8cc28f52dc4d6e2a51beeb1917a6638bed51baa710735721784d731',
    ],
  },
  {
    path: '.agents/skills/openspec-sync-specs/SKILL.md',
    sha256: [
      'da0ae40869be60ceff6cd231c75976487875675a7eca390b61a932b081aa91d4',
    ],
  },
  {
    path: '.agents/skills/openspec-update-change/SKILL.md',
    sha256: [
      '23bd9d7d95cc34caee693f7f3671ec8d49f8eca436483d3e29bea43e511b87d5',
    ],
  },
  {
    path: '.agents/skills/openspec-verify-change/SKILL.md',
    sha256: [
      'a049b171b9728a684d901f5e0d6f523bdcd768bc083277a1f6bb9b556cd24b9c',
    ],
  },
  {
    path: 'docs/archive/knowledge-normalization/tasks/YUTA_KNOWLEDGE_AUDIT_TASK.md',
    sha256: [
      'b64b2552f443f934fcbce610742ba096121a21e1bcd6e72f60815d86f99737d1',
    ],
  },
  {
    path: 'docs/archive/knowledge-normalization/tasks/YUTA_STEP_1_AUTHORITY_MODEL_TASK.md',
    sha256: [
      'd2868540f14588fc63a1023a4d4c656ade4c87a11d13b1c912a4bc7d35e47716',
    ],
  },
  {
    path: 'docs/archive/knowledge-normalization/tasks/YUTA_STEP_2_LIFECYCLE_STATUS_MODEL_TASK.md',
    sha256: [
      '91bd52894d8a47298e413c82c14930ed947ff7ae509381a19af21f5dbe4eabd1',
    ],
  },
  {
    path: 'docs/archive/knowledge-normalization/tasks/YUTA_STEP_3_MODULE_REGISTRY_TASK.md',
    sha256: [
      'b67b76d8e6b68a94164849e06abcac607136ef5d6fd0847bca69dd87eabb4aaf',
    ],
  },
  {
    path: 'docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_1_PERSONNEL_PRODUCT_KNOWLEDGE_HOME_TASK.md',
    sha256: [
      'c3233400c564b178bfea043a3377ce9dbdf6eef129c974c30ce6cd54a0cd061f',
    ],
  },
  {
    path: 'docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_2_TODAY_PRODUCT_KNOWLEDGE_HOME_TASK.md',
    sha256: [
      'eaaba0ec35c84752b6611e83956a7ee940c7e95c58dabb602add33d8843fa5e1',
    ],
  },
  {
    path: 'docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_3_ESTABLISHMENT_PRODUCT_KNOWLEDGE_HOME_TASK.md',
    sha256: [
      '076ce2c81cd01f730712bbd99b17ccfce2c295659bdcc4d48e20db33838a2297',
    ],
  },
  {
    path: 'docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_4_IDENTITY_ACCESS_PRODUCT_KNOWLEDGE_HOME_TASK.md',
    sha256: [
      'a32137c77beb979e58e6ef302dd6a40260c582da7975917d6234b85d74bfe89f',
    ],
  },
  {
    path: 'docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_5_SITE_AGENT_PRODUCT_KNOWLEDGE_HOME_TASK.md',
    sha256: [
      'ce8aae0936e8da8cf2612d0c7800467f1767c1df880365f4b6fa0d91e471fda2',
    ],
  },
  {
    path: 'docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_6_DISPLAY_PRODUCT_KNOWLEDGE_HOME_TASK.md',
    sha256: [
      '0e897d0298b1edb364fb8d30af347a7b571a50c5de6bf555a1f1aa7cd6b88799',
    ],
  },
  {
    path: 'docs/archive/yuta-workflow/tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md',
    sha256: [
      '26cfc8e0e0805a2a716909a18cfb86407f85eb508eefe5657e5c50a64e158ff6',
    ],
  },
  {
    path: 'docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md',
    sha256: [
      '44f10bc1956b130d26fbe2a5ca37bcbba8e12e571608d6448ced5be26af52e6b',
    ],
  },
  {
    path: 'docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md',
    sha256: [
      '3bff5078465adc49a91db004dc527cd9fdedf0b3ef435e34affb0824b2a83550',
    ],
  },
  {
    path: 'docs/archive/yuta-workflow/tasks/YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md',
    sha256: [
      '1c09d910450fd7d1e32b35c6c86f0beabd683b2bae6247fef73b30e71fa7ec36',
    ],
  },
  {
    path: 'docs/archive/yuta-workflow/tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md',
    sha256: [
      'eab95cce27be4f9e76b2eb3e854d01bde059066f9ac60a39fc9645dbb2a01269',
    ],
  },
  {
    path: 'docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md',
    sha256: [
      '98b375dee27a9a112377ed2feaabe1f7d505ef5c37ab6ec60f6e40c335559880',
    ],
  },
  {
    path: 'docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md',
    sha256: [
      'd226560949cd6ca073b907fdddae71d3bc17e7e161846fcc9c1703873e985e62',
    ],
  },
  {
    path: 'docs/archive/yuta-workflow/tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md',
    sha256: [
      'd48f8dca326d38b874867dcd20f641eaa9c6385333010ab6224cd04a57c3f289',
    ],
  },
  {
    path: 'docs/archive/yuta-workflow/tasks/YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md',
    sha256: [
      '7843820f9cf323127c7024e2e44530ad330c741832983b7a3685708793503012',
    ],
  },
  {
    path: 'docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md',
    sha256: [
      '34f4264630ea7d07428fa58e6409e7a4eb7815250848d27b193225630e49fd0c',
    ],
  },
  {
    path: 'docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md',
    sha256: [
      'e2a5517077d2234001c8cb7c0e9b8027b099b409b04d6b26aaa55d2574465f39',
    ],
  },
  {
    path: 'docs/archive/yuta-workflow/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md',
    sha256: [
      '14538a6aeb70c26552811935cabe5f3729608a6b2d462ab78c05017aaa19dfba',
    ],
  },
  {
    path: 'docs/reviews/async-interaction-feedback-foundation/01-analysis-review.md',
    sha256: [
      '03cbb892029eb01c8bac8b48e7c301458e21acde4940c4c5f71f2a08eea6c15c',
    ],
  },
  {
    path: 'docs/reviews/async-interaction-feedback-foundation/02-specs-review.md',
    sha256: [
      '221fa3040d8c5756c5f00dd9a0d42ec18c314bb00c8f0b286c4f1c3eab628b92',
    ],
  },
  {
    path: 'docs/reviews/development-usability-and-iteration-control/01-analysis-review.md',
    sha256: [
      '08f94604c4067d24b4cb474c576681bfda5eb9a05f5e3ca71c6be50cba7602c4',
    ],
  },
  {
    path: 'docs/reviews/federated-control-towers-foundation/decisions/3e0ae16ff4c99e0ab4a5f7c6f5c86f1f0cfaf8ef9024046a18df2ae21a00cae5.json',
    sha256: [
      '2401269f4926f4ceb5e7a44b2e82ef07a786f60616f98aa8f67269d4aacd561f',
    ],
  },
  {
    path: 'docs/reviews/federated-control-towers-foundation/decisions/7da6f31b3cf326bf0de69d3471c4790f081505bdfdd1f8933ef23818bf00c96a.json',
    sha256: [
      '861c7c6a55042c6f0475b737f73695a2c552c894a495cc93fe9df5dc0838c8e2',
    ],
  },
  {
    path: 'docs/reviews/federated-control-towers-foundation/decisions/approvals/0077c5d0e3eaaa9174b6484491d3c1b8b9fe9cb3dc293e698dd95e7a39fa86e8.json',
    sha256: [
      '7268d42ecce2558749876cf9cc1954ef7a2f2a55cb480928373667675ae5d6a6',
    ],
  },
  {
    path: 'docs/reviews/federated-control-towers-foundation/decisions/approvals/f6528d67d6e8a3ae136648f85289c83959fc52e564bcba99542477487cd45509.json',
    sha256: [
      'f070a25a3fe3c1af4971237d0825e081afcb402603760e31226999f648121f41',
    ],
  },
  {
    path: 'docs/reviews/federated-control-towers-foundation/decisions/descriptors/3e0ae16ff4c99e0ab4a5f7c6f5c86f1f0cfaf8ef9024046a18df2ae21a00cae5.json',
    sha256: [
      '8703c93c8d71aa08a939aa1806fbf37d5a5dab8a54cbd78eb5922e4f317bfd41',
    ],
  },
  {
    path: 'docs/reviews/federated-control-towers-foundation/decisions/descriptors/3f7fe12fe410242dad1f6540f983e777d33be078ed3e1cc2dd2aae1a6299438b.json',
    sha256: [
      'd2c3da1488f4addad6d550fdfd81ac975d53ac0fb9109db9e1de9ef8d5fccef5',
    ],
  },
  {
    path: 'docs/reviews/federated-control-towers-foundation/decisions/descriptors/7da6f31b3cf326bf0de69d3471c4790f081505bdfdd1f8933ef23818bf00c96a.json',
    sha256: [
      '806ec98f08894db431d33a243c583995fd8fdafa735fa9453db1567976fdf54b',
    ],
  },
  {
    path: 'docs/reviews/federated-control-towers-foundation/decisions/gate-results/2662ef55bda62f13625432cd9714f3f471886525230e2e957cd055a3d11d602d.json',
    sha256: [
      'd2a48df34c6920e7580036aa6491e713685b04b658af252c9ecbe4e2f979f563',
    ],
  },
  {
    path: 'docs/reviews/federated-control-towers-foundation/decisions/gate-results/e4c19e317eec009354fe5ed9137f48a6a8181ab884db1ba17791dabbc6ba9f8c.json',
    sha256: [
      '7b674802606208e69914bc6b97beecfe19af02c73fb580cacc438e6c169a2444',
    ],
  },
  {
    path: 'docs/reviews/personnel-reconstructable-value-history/04-knowledge-consolidation-review.md',
    sha256: [
      '134888250a8ee9a874d142866d19209dbad23066a1dd633f6d88434a320d4769',
    ],
  },
  {
    path: 'docs/reviews/pointage-usable-raw-clocking/02b-design-review.md',
    sha256: [
      'a6d41924a4a073962fb63213ab1695448f502afa60e3148274b7e89bcc14aac4',
    ],
  },
  {
    path: 'docs/reviews/product-version-management-foundation/01-analysis-review-preapproval.md',
    sha256: [
      'a63d9a499eaf62de7914b6913fdfddfa6264baeefdb3acbf2cb29dc86f93823a',
    ],
  },
  {
    path: 'docs/reviews/product-version-management-foundation/01-analysis-review.md',
    sha256: [
      'fd4b1f47ab87be02cda632228f4d27838cb4f77fb0ca6cb3b109346144900564',
    ],
  },
  {
    path: 'docs/reviews/product-version-management-foundation/02-specs-review-preapproval.md',
    sha256: [
      '26c8fbee8965196ca98c117204d407b44875a0b11df2ab797d7d7243157970c4',
    ],
  },
  {
    path: 'docs/reviews/product-version-management-foundation/02-specs-review-preclarification.md',
    sha256: [
      '0be340fd72edbb0dda189f137ecadc804784621caec23b483ee0f2b9d5ef676d',
    ],
  },
  {
    path: 'docs/reviews/product-version-management-foundation/02-specs-review.md',
    sha256: [
      '3d18c72596a250e6ae85a1f75b54ef2f5b0c164a0c2333903cc8f32ede9c25a7',
    ],
  },
  {
    path: 'docs/reviews/restaurant-knowledge-communication-identity/04-knowledge-consolidation-review.md',
    sha256: [
      '258c4405bff05a27a87d631b5fbd42f50148485c8ca72a60e7a1ce2b1cf49c0e',
    ],
  },
  {
    path: 'docs/reviews/restaurant-knowledge-team-culture/04-knowledge-consolidation-review.md',
    sha256: [
      'c2ec96123ca08b5e78c682e2fe5d0f87a13a1f543c3cff390c0399a7e4cea1f3',
    ],
  },
  {
    path: 'docs/reviews/restaurant-knowledge-validated-knowledge/02-specs-review.md',
    sha256: [
      '894efffdcb38fedab5956f925968ac0b1cc177a9eed212b30164c2c5f4c286ef',
    ],
  },
  {
    path: 'docs/reviews/restaurant-knowledge-validated-knowledge/02b-design-review.md',
    sha256: [
      '56eb5f4807b82d500ac9b323c60506e2040c25586356beb90b632fbd6b0d9a4d',
    ],
  },
  {
    path: 'docs/reviews/restaurant-knowledge-validated-knowledge/04-knowledge-consolidation-review.md',
    sha256: [
      '82a4470c3b4f3d415db7964eb514919b9fc30e0ecab6897745145add28a4b306',
    ],
  },
  {
    path: 'docs/reviews/review-reply-form-pending-state/01-analysis-review.md',
    sha256: [
      'e4f2d04bbebd549021871f90263822b9fe38689bdc50cd90f0c739b8e087a625',
    ],
  },
  {
    path: 'docs/reviews/review-reply-form-pending-state/02b-design-review.md',
    sha256: [
      'e39d37f7b1f54820b156aff85f20b3b81d74fa346dd2ff2f96eb39c68a62bf3b',
      '67a660529ccac343c7f859a7690b204dd1aaa139f128b75317e81660b0a5b331',
    ],
  },
  {
    path: 'openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/analysis.md',
    sha256: [
      'cc46c4f9d3881f6fb930f88264f8a7c4021c0afe05a9b6dd48b899fbf3aaa0a2',
    ],
  },
  {
    path: 'openspec/changes/archive/2026-09-24-development-usability-and-iteration-control/analysis.md',
    sha256: [
      '2bc75fe68b51986341b32088ba387ac07cfa23684b95a28d216b73dad15e9508',
    ],
  },
  {
    path: 'openspec/changes/archive/2026-09-24-development-usability-and-iteration-control/design.md',
    sha256: [
      '91dea8fdf6df5faa451a484b9163f61bde3dc53a55e06549b03825c4d8740b3f',
    ],
  },
  {
    path: 'openspec/changes/archive/2026-09-24-development-usability-and-iteration-control/tasks.md',
    sha256: [
      '5949aac2207531a664cb59bfd2ea65504e4cdc1f61e955cb892346905ec29875',
    ],
  },
  {
    path: 'openspec/changes/archive/2026-09-25-review-reply-form-pending-state/analysis.md',
    sha256: [
      'e038230d05014147275d5468123ca830697f053563715c4dd5e5d250a1a9b7e8',
    ],
  },
  {
    path: 'openspec/changes/archive/2026-09-27-product-version-management-foundation/analysis.md',
    sha256: [
      'f2721e6a41223b1283e79becbe98f62818580cbfdc6a22550d3199b180256d29',
    ],
  },
  {
    path: 'openspec/changes/archive/2026-09-27-product-version-management-foundation/specs/product-release/identity/spec.md',
    sha256: [
      'bf3923c420a10918bbd6233a9c3102b3f8da896ee5908e6764b8d2102b69d95d',
    ],
  },
  {
    path: 'openspec/changes/async-interaction-feedback-foundation/analysis.md',
    sha256: [
      '7535665d3bfac7bc328217fa418d045750eaeaa4d8da852613a351b030f3df39',
    ],
  },
  {
    path: 'openspec/changes/pointage-manual-test-environment/tasks.md',
    sha256: [
      '243dd847fde2f9b9eee7b3f4874ef671eb3a7e12ef4846f2c501d7fe27cdad7c',
    ],
  },
  {
    path: 'packages/db-cloud/test/fixtures/pointage-raw-clocking/0021_snapshot.json',
    sha256: [
      '71052147af479bfb5f480f0981859a7af7235ff21a0be69a427a6faaeb06f4bf',
      'a6ccaa77bf4445c0336366708763ade2410ecca6faceca52db26242886fbc4bb',
    ],
  },
];
const ignorePolicySha256 =
  '2a5ee4e5f62cba4406295d3f5d5d0ae5c7b38dd010b4eee95e916fa5b9c04d58';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

export function checkFormatPreservation(repositoryRoot) {
  const errors = [];
  try {
    const ignoreText = readFileSync(
      resolve(repositoryRoot, '.prettierignore'),
      'utf8',
    ).replace(/\r\n/g, '\n');
    if (sha256(ignoreText) !== ignorePolicySha256)
      errors.push(
        '.prettierignore: policy differs from the reviewed exact exclusions',
      );
  } catch {
    errors.push('.prettierignore: missing or unreadable');
  }
  for (const artifact of preservedArtifacts) {
    try {
      const actual = sha256(
        readFileSync(resolve(repositoryRoot, artifact.path)),
      );
      if (!artifact.sha256.includes(actual))
        errors.push(artifact.path + ': preserved bytes changed');
    } catch {
      errors.push(artifact.path + ': missing or unreadable');
    }
  }
  return { preservedCount: preservedArtifacts.length, errors };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const result = checkFormatPreservation(process.cwd());
  if (result.errors.length) {
    console.error('Format preservation failed:\n' + result.errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(
      'Format preservation passed (' + result.preservedCount + ' exact paths).',
    );
  }
}
