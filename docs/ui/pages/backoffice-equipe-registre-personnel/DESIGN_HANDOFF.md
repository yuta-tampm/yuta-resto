# Backoffice Équipe — Registre du personnel — Design Handoff

Status: Approved design references and Phase 5 local as-built evidence

Visibility: Engineering

## Phase 0 source

The containing `/equipe/salaries` page is integrated; this proposed register
route and its domain are absent. Classification is `NEW_PAGE` under
`NEW_CAPABILITY_DISCOVERY`. Baseline status is `NOT_APPLICABLE`; current
Salariés Wave D as-built images were supplied only as shell/context references.

## Shared UI context resolution

Shared context status: `RESOLVED`.

| Layer         | Owner/source                      | Status   | Decision                                            |
| ------------- | --------------------------------- | -------- | --------------------------------------------------- |
| YUTA global   | shared UI/tokens/Geist            | APPROVED | Reuse typography, tokens, primitives                |
| Backoffice    | current authenticated shell       | APPROVED | Reuse topbar/sidebar/account/establishment selector |
| Équipe        | current Salariés route/navigation | APPROVED | Keep Salariés selected; no new sidebar item         |
| Register page | this pack                         | APPROVED | Phase 1 presentation direction only                 |

Shell mode: `REUSE_APPROVED_SHARED_SHELL`.

## Design-generation prompt

Design prompt status: `EXECUTED`; execution was authorized and completed on
2026-08-17.

```text
Conçois uniquement des maquettes DRAFT, sans code, pour la nouvelle page YUTA
Backoffice « Registre du personnel » proposée à /equipe/registre-personnel.
Elle est ouverte depuis une action secondaire de /equipe/salaries. Réutilise
exactement le shell Backoffice authentifié fourni : topbar, sidebar, sélecteur
d'établissement, compte, typographie, densité et tokens. Garde « Salariés »
sélectionné et n'ajoute aucun item de sidebar.

Utilisateur : OWNER de l'établissement actif uniquement. Le registre appartient
à un établissement. Montre un retour vers Salariés, le titre, « Établissement
LUNA », « DRAFT — exploration sans données réelles », une explication neutre,
une carte « Préparation du registre », une liste canonique numérotée, une partie
séparée « Stagiaires et service civique », une action désactivée « Exporter en
PDF » et une notice d'accès protégé/conservation à valider.

La carte de préparation montre exactement des exemples fictifs : « 2 dossiers
exploitables », « 3 informations manquantes » et « Stagiaires et service civique
non disponibles ». Les lignes utilisent seulement « Camille Martin » et « Noah
Bernard » et regroupent emploi, qualification, entrée, sortie, contrat et temps
de travail. Affiche « Information manquante » pour nationalité, date de naissance
et sexe au lieu d'inventer une valeur. Le registre structuré est la source ; le
PDF est seulement une représentation protégée.

Produis 1440x1000, 1024x768, 768x1024 et 390x844. Utilise un tableau compact à
1440/1024 et des cartes ordonnées à 768/390. Conserve les cibles tactiles de
44 px, le focus visible, le texte lisible, le retour à la ligne et aucun
débordement horizontal. Tous les états sont textuels, jamais couleur seule.

Interdictions : badge « Conforme », sceau/certification/signature, horodatage de
confiance, édition ou correction destructive, archive PDF, partage/email/lien
public, import/export en masse, portail CSE/inspection, vue organisation,
manager, self-service, Documents, OCR, ChatGPT/IA, remplissage automatique,
Formalités, DPAE/DSN, paie, Planning, Pointage, fournisseur ou nouvelle navigation.
Le design ne définit ni route runtime, ni champ, ni permission, ni schéma, ni API,
ni règle juridique et n'autorise aucune implementation.
```

## Handoff result

Four responsive references are retained in `references/`. The initial
desktop output was rejected because it invented a sidebar item and deletion
copy. The corrected retained set removes both. Product approved it for the local
typed-fixture prototype on 2026-08-18. No reference authorizes real-data
integration or later phases.

## Phase 5 as-built reconciliation

The final local implementation preserves the approved shell, title hierarchy,
canonical-order explanation, protected export treatment, unsupported-category
separation, responsive stacking, and semantic visual tone. Intentional
repository-backed differences from the Phase 1 reference are:

- real empty-register and candidate-review states replace fictional rows and counts;
- the local production-lock warning replaces the obsolete DRAFT disclosure;
- reviewed inscription/correction actions reflect the approved later phases;
- the establishment remains represented by the trusted shared-shell selector
  rather than duplicating browser-provided scope inside page content.

These differences do not add a sidebar item, compliance claim, public link,
destructive action, or unapproved production capability. The stable Phase 5
evidence is listed in `references/README.md`.
