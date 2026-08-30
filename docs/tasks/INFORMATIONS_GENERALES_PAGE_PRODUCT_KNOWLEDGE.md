# Informations générales — Page Product Knowledge

## 1. Purpose

La page **Informations générales** sert de base de connaissance centrale du restaurant dans YUTA.

Son rôle n’est pas seulement de stocker une fiche descriptive de l’établissement. Elle doit permettre au restaurateur de renseigner ce que YUTA doit connaître sur son restaurant afin que ces informations puissent être réutilisées par d’autres fonctionnalités.

La valeur attendue pour le restaurateur est de :

- renseigner une information une fois au lieu de la répéter dans plusieurs modules ;
- décrire son restaurant, son concept, sa cuisine, son savoir-faire, son équipe, son approche client et son identité de communication ;
- permettre à YUTA de produire des réponses et contenus plus cohérents avec la réalité du restaurant ;
- enrichir progressivement cette connaissance dans le temps ;
- garder une validation humaine sur les nouvelles connaissances proposées par YUTA.

La page a été positionnée comme un **Restaurant Knowledge Hub** / centre de connaissance contextuelle de l’établissement.

---

## 2. Scope

Le périmètre confirmé comprend trois grandes familles d’informations.

### 2.1. Données factuelles et structurées de l’établissement / entreprise

Informations de référence sur l’établissement ou l’entreprise qui peuvent être réutilisées par d’autres fonctionnalités, notamment les formalités et contrats.

Ces données sont considérées comme des informations fiables de référence.

### 2.2. Connaissance du restaurant

La page doit pouvoir contenir des informations telles que :

- concept ;
- histoire ;
- description de la cuisine ;
- savoir-faire ;
- éléments faits maison ;
- particularités du restaurant ;
- expérience client recherchée ;
- manière d’accueillir ou de se comporter avec les clients ;
- esprit d’équipe ;
- valeurs et culture ;
- identité et style de communication ;
- autres connaissances utiles que le restaurateur veut transmettre à YUTA.

### 2.3. Connaissances proposées à partir de l’usage

YUTA peut détecter des informations potentiellement réutilisables à partir de l’usage du produit, notamment :

- réponses aux avis ;
- réponses aux commentaires ;
- corrections apportées par le restaurateur ;
- informations données directement à YUTA.

Ces informations ne deviennent pas automatiquement des connaissances validées. Elles doivent être proposées au restaurateur pour validation.

---

## 3. Non-goals

Les éléments suivants ont été explicitement exclus du rôle de cette base lorsqu’ils appartiennent déjà à un module spécialisé :

- recopier toute la carte ou les prix des plats ;
- recopier les paramètres de réservation ;
- recopier les données des salariés ;
- dupliquer une donnée dont un autre module est déjà la source canonique.

Le principe fixé est :

> **Une donnée → une source canonique → plusieurs consommateurs.**

Ainsi, `Informations générales` peut utiliser ou contextualiser des données venant d’autres modules, mais ne doit pas devenir une copie parallèle de ces données.

### Éléments mentionnés comme devant rester dans des pages spécialisées

Les éléments suivants ont été mentionnés dans la conversation comme relevant de pages dédiées plutôt que d’`Informations générales` :

- horaires d’ouverture ;
- services ;
- salle & tables ;
- réservation ;
- carte & menus.

**NEEDS REVIEW** : cette séparation a été énoncée dans le cadrage initial de la conversation mais n’a pas fait l’objet d’une validation détaillée champ par champ.

---

## 4. Page Structure

Les sections / blocs suivants ont été discutés pour organiser la page :

- **Identité & coordonnées**
- **Concept & histoire**
- **Cuisine & savoir-faire**
- **Expérience client**
- **Équipe & culture**
- **Identité de communication**
- **Connaissances YUTA**
  - Connaissances enregistrées
  - Suggestions à valider
  - Historique

Un en-tête de page a également été proposé avec :

- titre `Informations générales` ;
- sous-titre du type : « Tout ce que YUTA doit connaître sur votre établissement » ;
- indicateur de complétude ;
- accès à l’action `+ Apprendre quelque chose à YUTA` ;
- éventuel indicateur du nombre de suggestions à valider.

**NEEDS REVIEW** : la structure en 7 sections, la navigation interne, l’indicateur de complétude, le compteur de suggestions et les sous-onglets de `Connaissances YUTA` ont été proposés lors de la discussion UI/UX mais n’ont pas été explicitement confirmés comme structure finale.

---

## 5. Functional Overview

### 5.1. Identité & coordonnées

#### Objectif

Centraliser les informations factuelles et structurées de référence sur l’établissement et l’entreprise.

#### Actions discutées

Le restaurateur peut renseigner et modifier les informations générales de son établissement / entreprise.

#### Informations discutées

Deux ensembles ont été distingués :

- informations de l’établissement ;
- informations de l’entreprise.

Ces informations peuvent être réutilisées notamment pour les formalités et les contrats.

#### Règles connues

- Les informations factuelles ne doivent pas être modifiées automatiquement par l’IA.
- Elles ne doivent pas être exposées dans un contexte public si leur usage est administratif ou interne.
- La source de vérité doit rester unique.

**NEEDS REVIEW** : la liste finale des champs, leurs obligations, leurs validations et leur ownership précis ne sont pas encore décidés.

---

### 5.2. Concept & histoire

#### Objectif

Permettre à YUTA de comprendre ce qu’est le restaurant au-delà des données administratives.

#### Informations discutées

- concept ;
- histoire ;
- origine du projet ;
- ce qui différencie le restaurant ;
- valeurs.

#### Actions discutées

Le restaurateur peut renseigner ces informations directement.

Une saisie naturelle assistée par IA a été proposée afin d’éviter un long formulaire : le restaurateur peut décrire son restaurant librement, puis YUTA peut proposer une structuration de ce contenu pour validation.

#### Règles connues

- La page doit éviter une expérience d’onboarding composée d’un grand nombre de champs lourds à remplir.
- Les informations proposées par l’IA doivent rester sous contrôle du restaurateur.

---

### 5.3. Cuisine & savoir-faire

#### Objectif

Donner à YUTA une connaissance suffisamment précise de la cuisine et des particularités du restaurant pour améliorer les réponses clients et les contenus.

#### Informations discutées

- description générale de la cuisine ;
- inspirations ou style culinaire ;
- savoir-faire ;
- faits maison ;
- méthodes ou particularités importantes ;
- produits ou éléments distinctifs.

#### Exemple utilisé dans la conversation

Une connaissance comme :

> « Le pain Gua Bao est travaillé avec du vrai fruit du dragon à chair rose. »

peut appartenir à cette base.

#### Boundary

Les informations de carte telles que le prix d’un article ne doivent pas être recopiées ici si elles appartiennent à `Carte & menus`.

---

### 5.4. Expérience client

#### Objectif

Décrire la manière dont le restaurant souhaite accueillir et traiter ses clients, et fournir des informations utiles à YUTA pour répondre correctement aux avis et commentaires.

#### Informations discutées

- manière d’accueillir les clients ;
- expérience recherchée ;
- comportement attendu envers les clients ;
- informations factuelles utiles au service ou aux réponses clients.

#### Exemple utilisé dans la conversation

Une information telle que :

> « Citron et piment disponibles sur demande. »

peut servir à enrichir les réponses aux avis ou commentaires lorsqu’elle est validée comme connaissance du restaurant.

#### Règles connues

- Un avis client n’est pas une vérité sur le restaurant.
- Les remarques clients peuvent produire un signal ou une suggestion, mais pas une modification automatique de la connaissance validée.

---

### 5.5. Équipe & culture

#### Objectif

Permettre à YUTA de comprendre l’identité collective et les principes de fonctionnement humain du restaurant.

#### Informations discutées

- esprit d’équipe ;
- valeurs internes ;
- manière de travailler ensemble ;
- comportement attendu avec les clients.

#### Boundary

Les données individuelles des salariés restent dans le module `Salariés`.

**NEEDS REVIEW** : les futurs usages de cette connaissance pour onboarding, formation ou fiches de poste ont été évoqués comme possibilités, mais n’ont pas été validés comme fonctionnalités du périmètre actuel.

---

### 5.6. Identité de communication

#### Objectif

Définir comment YUTA doit parler au nom du restaurant.

#### Informations discutées

- ton ;
- style ;
- niveau d’humour ;
- vocabulaire à privilégier ;
- vocabulaire ou formulations à éviter ;
- tutoiement / vouvoiement ;
- utilisation éventuelle d’emojis ;
- signature ;
- éléments de marque à mettre en avant.

#### Utilisations confirmées

Cette connaissance doit pouvoir servir à :

- répondre aux avis et commentaires ;
- créer des textes pour Facebook ;
- créer des textes pour Instagram ;
- produire des contenus cohérents avec l’identité du restaurant.

**NEEDS REVIEW** : aucun modèle de ton, enum ou champ obligatoire n’a été arrêté.

---

### 5.7. Connaissances YUTA

#### Objectif

Permettre à la base de connaissance du restaurant de s’enrichir progressivement avec l’usage.

#### Comportement confirmé

YUTA peut identifier une information potentiellement utile à partir :

- d’une correction faite par le restaurateur ;
- d’une réponse à un avis ;
- d’une réponse à un commentaire ;
- d’une information donnée directement à YUTA.

Cette information doit être proposée au restaurateur avant d’être intégrée.

Le restaurateur doit pouvoir :

- valider l’ajout ;
- modifier la proposition ;
- ignorer la proposition.

#### Action `Apprendre quelque chose à YUTA`

Le concept d’une action permettant au restaurateur de saisir naturellement une nouvelle information a été retenu dans le périmètre.

Exemple discuté :

> « Nos pains Gua Bao sont colorés naturellement avec du fruit du dragon. »

YUTA peut analyser l’information et proposer comment la ranger / la réutiliser, avec validation du restaurateur.

#### Règles connues

- La connaissance doit évoluer dans le temps.
- L’apprentissage doit rester maîtrisé.
- Les avis/commentaires clients ne doivent jamais être transformés automatiquement en vérités.
- Une suggestion IA n’est pas une connaissance validée tant que le restaurateur ne l’a pas acceptée.

#### Sous-sections discutées

- Connaissances enregistrées ;
- Suggestions à valider ;
- Historique.

**NEEDS REVIEW** : la présence obligatoire d’un historique et le détail des métadonnées affichées n’ont pas été confirmés.

---

## 6. Data / Fields

La conversation a nommé les champs / informations suivants.

### 6.1. Informations d’établissement discutées

| Champ / information | Signification | Required / Optional | Editable / Read-only | Public / Internal / Administrative | Validation / règle |
|---|---|---|---|---|---|
| Nom commercial | Nom utilisé commercialement | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW |
| Nom de l’établissement | Identification de l’établissement | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW |
| Logo | Identité visuelle de l’établissement | NEEDS REVIEW | NEEDS REVIEW | Public envisagé | NEEDS REVIEW |
| Adresse | Adresse de l’établissement | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW |
| Téléphone | Coordonnée du restaurant | NEEDS REVIEW | NEEDS REVIEW | Public possible | NEEDS REVIEW |
| Email | Coordonnée du restaurant | NEEDS REVIEW | NEEDS REVIEW | Public possible | NEEDS REVIEW |
| Site internet | Site du restaurant | NEEDS REVIEW | NEEDS REVIEW | Public possible | NEEDS REVIEW |
| Réseaux sociaux principaux | Liens / présence sociale | NEEDS REVIEW | NEEDS REVIEW | Public possible | NEEDS REVIEW |
| Description du restaurant | Présentation générale | NEEDS REVIEW | Editable envisagé | Public possible | NEEDS REVIEW |
| Langue(s) utilisée(s) | Langue(s) du restaurant / communication | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW |
| Informations de contact public | Coordonnées destinées au public | NEEDS REVIEW | NEEDS REVIEW | Public | NEEDS REVIEW |
| Type de service | Type de fonctionnement / service | NEEDS REVIEW | NEEDS REVIEW | NEEDS REVIEW | **NEEDS REVIEW** : ownership non confirmé dans le périmètre final |

### 6.2. Informations d’entreprise discutées

| Champ / information | Signification | Required / Optional | Editable / Read-only | Public / Internal / Administrative | Validation / règle |
|---|---|---|---|---|---|
| Raison sociale | Identité légale de l’entreprise | NEEDS REVIEW | NEEDS REVIEW | Administrative | NEEDS REVIEW |
| Forme juridique | Forme légale de l’entreprise | NEEDS REVIEW | NEEDS REVIEW | Administrative | NEEDS REVIEW |
| SIREN / SIRET | Identifiants de l’entreprise / établissement | NEEDS REVIEW | NEEDS REVIEW | Administrative | NEEDS REVIEW |
| TVA intracommunautaire | Identifiant TVA | NEEDS REVIEW | NEEDS REVIEW | Administrative | NEEDS REVIEW |
| Adresse du siège | Adresse légale de l’entreprise | NEEDS REVIEW | NEEDS REVIEW | Administrative | NEEDS REVIEW |
| Représentant légal | Personne représentant légalement l’entreprise | NEEDS REVIEW | NEEDS REVIEW | Administrative | NEEDS REVIEW |
| Coordonnées administratives | Coordonnées servant à l’administration | NEEDS REVIEW | NEEDS REVIEW | Administrative | NEEDS REVIEW |

### 6.3. Informations de connaissance discutées

La conversation a confirmé des familles d’informations, mais pas encore des fields normalisés :

- concept ;
- histoire ;
- origine du projet ;
- éléments différenciants ;
- valeurs ;
- description de la cuisine ;
- style / inspirations culinaires ;
- savoir-faire ;
- fait maison ;
- particularités produits ;
- expérience client recherchée ;
- manière d’accueillir ;
- comportement envers les clients ;
- esprit d’équipe ;
- culture / valeurs internes ;
- ton de communication ;
- style de communication ;
- humour ;
- vocabulaire à privilégier ;
- éléments à éviter ;
- tutoiement / vouvoiement ;
- emojis ;
- signature ;
- connaissances complémentaires ajoutées par le restaurateur.

**NEEDS REVIEW** : aucun de ces éléments n’a encore de définition de champ, type, caractère obligatoire, longueur, validation ou format approuvé.

---

## 7. Roles & Permissions

Le rôle explicitement présent dans la conversation est le **restaurateur**, qui :

- renseigne les informations ;
- enrichit la connaissance ;
- valide, modifie ou ignore les suggestions de connaissance proposées par YUTA.

Aucune matrice détaillée de rôles / permissions n’a été décidée.

**NEEDS REVIEW**

À définir avant de spécifier des comportements dépendant des permissions :

- quels rôles peuvent consulter chaque catégorie d’information ;
- quels rôles peuvent modifier les données factuelles ;
- quels rôles peuvent valider une nouvelle connaissance ;
- quels rôles peuvent consulter les informations administratives ;
- quelles restrictions existent entre organisation / établissement.

Aucune permission ne doit être inventée par OpenSpec ou Codex à partir de ce document.

---

## 8. Relationships with Other Pages / Modules

### 8.1. Formalités / contrats

**Relationship confirmée : reads / consumes data**

Les informations d’entreprise peuvent être réutilisées pour produire des contrats ou autres formalités.

`Informations générales` sert donc de source de connaissance / référence pour ces usages.

**NEEDS REVIEW** : les champs exacts consommés par les contrats n’ont pas été décidés ici.

---

### 8.2. Avis & commentaires

**Relationship confirmée : consumes knowledge + contributes suggestions**

Les réponses aux avis / commentaires doivent pouvoir utiliser :

- le concept ;
- la cuisine ;
- les savoir-faire ;
- les informations de service pertinentes ;
- l’identité de communication ;
- les autres connaissances validées.

Les corrections ou réponses du restaurateur peuvent également faire apparaître de nouvelles connaissances potentielles.

Ces informations doivent passer par une validation humaine avant d’enrichir la base.

---

### 8.3. Marketing & contenu / Facebook / Instagram

**Relationship confirmée : consumes knowledge**

La base doit servir à la création des textes de contenus, notamment :

- Facebook ;
- Instagram.

Les contenus doivent pouvoir s’appuyer sur la connaissance validée du restaurant et son identité de communication.

---

### 8.4. Carte & menus

**Relationship confirmée : separate owning module**

Les données de carte, comme les articles et leurs prix, ne doivent pas être dupliquées dans `Informations générales`.

`Carte & menus` reste la source canonique de ces données.

La base de connaissance peut contenir des informations transversales sur la cuisine ou le savoir-faire sans recopier les données opérationnelles de la carte.

---

### 8.5. Réservations

**Relationship confirmée au niveau du principe d’ownership**

Les paramètres et données propres aux réservations restent dans leur module propriétaire.

`Informations générales` ne doit pas créer de copie parallèle de ces informations.

Aucune autre intégration fonctionnelle avec Réservations n’a été décidée dans cette conversation.

---

### 8.6. Salariés

**Relationship confirmée au niveau du principe d’ownership**

Les données individuelles des salariés restent dans `Salariés`.

`Informations générales` peut contenir la culture ou l’esprit d’équipe, mais pas dupliquer les dossiers salariés.

---

### 8.7. Horaires / Services / Salle & tables

Ces domaines ont été mentionnés comme relevant de pages spécialisées.

**NEEDS REVIEW** : aucune relation fonctionnelle détaillée n’a été validée dans cette conversation.

---

### 8.8. Public Website / POS / Today

Aucune relation approuvée n’a été décidée dans cette conversation.

**NO RELATIONSHIP APPROVED IN THIS CONVERSATION**

---

## 9. Data Ownership / Boundaries

### Ownership confirmé

Le principe général suivant a été fixé :

> **Une donnée → une source canonique → plusieurs consommateurs.**

`Informations générales` ne doit donc pas recopier les informations opérationnelles déjà détenues par un autre module.

Exemples explicitement discutés :

- carte / prix → `Carte & menus` ;
- données de réservation → module Réservations ;
- données individuelles des salariés → `Salariés`.

### Catégories d’usage de l’information

Trois périmètres d’usage ont été retenus comme principe :

- **Public** : information pouvant être utilisée dans les réponses clients, publications ou autres contenus publics ;
- **Interne** : information destinée au fonctionnement interne ou aux agents YUTA ;
- **Administratif** : information destinée aux formalités et usages administratifs.

Règle importante :

- une information administrative ne doit pas être injectée dans un post Instagram ou une réponse publique simplement parce qu’elle existe dans la base.

### Cloud / local / runtime

Aucune décision n’a été prise dans cette conversation.

**NEEDS REVIEW**

### Organization / establishment scope

Aucune règle précise n’a été décidée dans cette conversation.

**NEEDS REVIEW**

---

## 10. UI / UX Decisions

### Décisions / principes confirmés

#### Éviter un long formulaire initial

Le restaurateur ne doit pas être obligé de remplir une très grande quantité de champs narratifs avant de pouvoir utiliser la page.

La connaissance doit pouvoir commencer avec peu d’informations puis s’enrichir progressivement.

#### Saisie naturelle assistée par IA

Le restaurateur doit pouvoir transmettre une information de manière naturelle.

Le principe d’une action du type :

`+ Apprendre quelque chose à YUTA`

a été retenu pour permettre cette saisie.

YUTA peut analyser l’information et proposer comment l’intégrer, mais le restaurateur garde la validation.

#### Validation humaine des suggestions

Pour une nouvelle connaissance détectée, les actions discutées sont :

- Ajouter / Enregistrer ;
- Modifier ;
- Ignorer.

### UI discutée mais non confirmée

Les éléments suivants ont été proposés mais n’ont pas été explicitement validés comme design final :

- navigation latérale interne entre les sections ;
- cartes de connaissance plutôt qu’une succession de champs ;
- indicateur de complétude du profil ;
- compteur de suggestions à valider ;
- sous-onglets `Connaissances enregistrées / Suggestions / Historique` ;
- affichage de métadonnées comme catégorie, provenance ou date d’ajout.

**NEEDS REVIEW**

### Edit / Save behavior

Hormis la validation explicite d’une nouvelle connaissance proposée par YUTA, aucun comportement global `edit/save` n’a été décidé.

**NEEDS REVIEW**

### Validation feedback

Non décidé.

**NEEDS REVIEW**

### Loading / error / success

Non décidé.

**NEEDS REVIEW**

### Responsive behavior

Non décidé.

**NEEDS REVIEW**

---

## 11. Key Business Rules

1. `Informations générales` est une base de connaissance centrale du restaurant, pas uniquement une fiche administrative.

2. Les données factuelles et structurées doivent être distinguées des connaissances narratives / contextuelles du restaurant.

3. Les informations factuelles de référence ne doivent pas être modifiées automatiquement par l’IA.

4. Une information détectée par YUTA à partir d’un avis, d’un commentaire ou d’une correction n’est jamais automatiquement considérée comme vraie.

5. Toute nouvelle connaissance proposée à partir de l’usage doit être soumise à validation humaine avant intégration.

6. Un avis client est une source de signal ou de suggestion, pas une source de vérité.

7. La base de connaissance doit pouvoir évoluer progressivement dans le temps.

8. Le restaurateur doit pouvoir ajouter directement de nouvelles informations à la connaissance de YUTA.

9. La page doit éviter la duplication des données déjà détenues par un autre module.

10. Une donnée doit avoir une source canonique unique et peut ensuite être consommée par plusieurs fonctionnalités.

11. Les données administratives, internes et publiques ne doivent pas être utilisées indistinctement.

12. La base doit pouvoir alimenter les contrats / formalités avec les informations appropriées de l’entreprise.

13. La base doit pouvoir alimenter les réponses aux avis et commentaires.

14. La base doit pouvoir alimenter la création de textes pour Facebook et Instagram.

15. La connaissance de l’identité de communication du restaurant doit permettre à YUTA de parler de manière cohérente au nom de l’établissement.

---

## 12. Confirmed Decisions

Les décisions suivantes ont été explicitement fixées dans la conversation :

- La page doit aller au-delà d’une simple fiche `Informations générales`.
- Elle sert de **Restaurant Knowledge Hub** de l’établissement.
- Le périmètre comprend :
  - données factuelles / structurées ;
  - connaissance du restaurant ;
  - connaissances suggérées à partir de l’usage.
- La connaissance inclut notamment :
  - concept ;
  - histoire ;
  - cuisine ;
  - savoir-faire ;
  - fait maison ;
  - expérience client ;
  - esprit / culture d’équipe ;
  - comportement envers les clients ;
  - identité de communication ;
  - connaissances complémentaires.
- Les informations peuvent être réutilisées par d’autres fonctionnalités.
- Les informations d’entreprise peuvent servir aux contrats / formalités.
- La connaissance du restaurant doit servir aux réponses aux avis / commentaires.
- La connaissance doit servir à la création des textes Facebook / Instagram.
- La base s’enrichit progressivement avec le temps.
- Le restaurateur peut ajouter directement de nouvelles informations.
- YUTA peut proposer de nouvelles connaissances à partir de l’usage.
- Les suggestions de YUTA nécessitent une validation humaine.
- Les avis et commentaires clients ne deviennent jamais automatiquement des vérités.
- Les données des autres modules ne doivent pas être dupliquées.
- Le principe `une donnée → une source canonique → plusieurs consommateurs` est retenu.
- Les usages `public`, `interne` et `administratif` doivent rester séparés.
- Le principe d’une saisie naturelle du type `Apprendre quelque chose à YUTA` fait partie du périmètre retenu.
- L’onboarding / la saisie ne doit pas devenir un long formulaire lourd.

---

## 13. NEEDS REVIEW / CONFLICT

### NEEDS REVIEW — Structure finale de page

La structure suivante a été proposée mais pas explicitement validée comme organisation finale :

- Identité & coordonnées ;
- Concept & histoire ;
- Cuisine & savoir-faire ;
- Expérience client ;
- Équipe & culture ;
- Identité de communication ;
- Connaissances YUTA.

Elle constitue actuellement la structure discutée, pas une requirement définitivement approuvée.

### NEEDS REVIEW — Champs exacts

La conversation a nommé plusieurs champs potentiels, mais n’a pas fixé :

- la liste finale ;
- les champs obligatoires ;
- les champs optionnels ;
- les validations ;
- les formats ;
- les longueurs ;
- les champs read-only ;
- les dépendances entre champs.

### NEEDS REVIEW — Données légales / entreprise

La page doit contenir des données structurées d’entreprise utilisables par les formalités / contrats, mais la frontière exacte entre :

- données entreprise ;
- données établissement ;
- données détenues ailleurs

n’a pas encore été détaillée.

### NEEDS REVIEW — Roles & permissions

Aucune matrice de permissions n’a été décidée.

### NEEDS REVIEW — Organization / establishment scope

Aucune règle précise de scope organisation / établissement n’a été discutée.

### NEEDS REVIEW — UI final

Les cartes, la navigation latérale, les indicateurs de complétude, le compteur de suggestions et l’historique ont été proposés mais pas validés.

### NEEDS REVIEW — Workflow complet de modification

Le comportement global de sauvegarde, validation, feedback, erreurs et annulation n’a pas été décidé.

### NEEDS REVIEW — Classification des connaissances

Le principe `public / interne / administratif` est retenu, mais il n’a pas été décidé :

- si cette classification est visible à l’utilisateur ;
- si elle est obligatoire pour chaque connaissance ;
- qui peut la modifier ;
- comment elle est déterminée.

### NEEDS REVIEW — Proposition IA vers un autre module

Il a été proposé qu’une information saisie dans `Apprendre quelque chose à YUTA` puisse être détectée comme appartenant à un autre module et que YUTA propose d’y effectuer la modification.

Exemple discuté : un changement d’horaire.

Ce comportement n’a pas été explicitement confirmé.

### NEEDS REVIEW — Historique

Un historique des connaissances / modifications a été proposé, mais sa présence et son périmètre ne sont pas confirmés.

### CONFLICT

Aucun conflit explicite n’a été identifié dans la conversation.

---

## 14. Suggested Capability Breakdown

Cette décomposition sert uniquement à préparer de futurs OpenSpec changes. Elle ne constitue pas une spec.

```text
Page: Informations générales
├── Capability A — Identité et informations de référence
├── Capability B — Concept et histoire du restaurant
├── Capability C — Cuisine, savoir-faire et fait maison
├── Capability D — Expérience et relation client
├── Capability E — Équipe et culture
├── Capability F — Identité de communication
├── Capability G — Ajout direct de connaissance
├── Capability H — Suggestions de connaissance issues de l’usage
├── Capability I — Validation / modification / rejet des suggestions
└── Capability J — Consommation de la connaissance par les autres fonctionnalités
```

**NEEDS REVIEW** : cette décomposition est une proposition de découpage des capabilities et ne signifie pas que chaque capability doit devenir un change séparé.

---

## 15. OpenSpec Usage Guidance

Ce document est un **PAGE-level Product Knowledge**.

Il sert à donner à Codex / OpenSpec le contexte produit actuel de la page `Informations générales`.

Pour tout OpenSpec change concernant cette page :

- l’`analysis` doit lire ce document avant de définir le changement ;
- les `specs` doivent décrire uniquement le comportement de la capability ou du change concerné ;
- les `specs` ne doivent pas recopier l’ensemble de ce document ;
- ce document ne doit pas être transformé automatiquement en spec technique ;
- les éléments marqués `NEEDS REVIEW` ne doivent pas être convertis en requirements par supposition ;
- si un `NEEDS REVIEW` affecte directement le requirement du change, l’analysis doit s’arrêter avant l’écriture des specs et demander une décision Product ;
- aucune permission, business rule, field, API, schema, component ou comportement non présent ici ne doit être inventé.

---

## 16. Source Boundary

**Source :** conversation actuelle `YuTa SARL - Informations générales v`.

Ce document doit rester limité aux informations réellement discutées, décidées ou confirmées dans cette conversation.

Il ne doit pas être complété avec :

- connaissances externes ;
- conventions supposées ;
- comportement d’autres produits ;
- implementation existante ;
- schéma de données ;
- hypothèses techniques ;
- décisions provenant d’autres conversations,

sauf si ces éléments sont ajoutés ultérieurement avec une source explicite et une validation Product.

Toute information pour laquelle la conversation ne fournit pas assez d’evidence doit rester marquée :

`NEEDS REVIEW`

et ne doit pas être complétée par supposition.
