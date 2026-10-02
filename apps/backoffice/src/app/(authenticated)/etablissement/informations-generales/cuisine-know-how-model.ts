export type CuisineKnowHowDraft = {
  cuisineDescription: string | null;
  knowHowParticularities: string | null;
  homemade: string | null;
};

export function cuisineKnowHowDraft(
  cuisineDescription: string | null,
  knowHowParticularities: string | null,
  homemade: string | null,
): CuisineKnowHowDraft {
  return { cuisineDescription, knowHowParticularities, homemade };
}

export function updateCuisineDescription(
  draft: CuisineKnowHowDraft,
  cuisineDescription: string,
): CuisineKnowHowDraft {
  return { ...draft, cuisineDescription };
}

export function updateKnowHowParticularities(
  draft: CuisineKnowHowDraft,
  knowHowParticularities: string,
): CuisineKnowHowDraft {
  return { ...draft, knowHowParticularities };
}

export function updateHomemade(
  draft: CuisineKnowHowDraft,
  homemade: string,
): CuisineKnowHowDraft {
  return { ...draft, homemade };
}
