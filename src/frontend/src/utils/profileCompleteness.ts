import type { UserProfile } from "@/types";

export interface CompletenessResult {
  /** 0–100 integer percent */
  percent: number;
  /** number of filled fields */
  filled: number;
  /** total required fields evaluated */
  total: number;
  /** translation keys of missing fields */
  missingKeys: string[];
}

/**
 * Evaluate how complete a user profile is.
 * Required fields: fullName, contact, bio, sex, language.
 * city is required unless virtualEventPreferred is true.
 */
export function calcProfileCompleteness(
  profile: UserProfile | null | undefined,
): CompletenessResult {
  if (!profile) {
    return {
      percent: 0,
      filled: 0,
      total: 6,
      missingKeys: [
        "profile.fullName",
        "profile.contactRequired",
        "profile.bio",
        "profile.sex",
        "profile.city",
        "profile.language",
      ],
    };
  }

  type Field = { key: string; filled: boolean };

  const cityRequired = true;

  const fields: Field[] = [
    { key: "profile.fullName", filled: !!profile.fullName?.trim() },
    {
      key: "profile.contactRequired",
      filled: !!(
        profile.phoneNumber?.[0]?.trim() ||
        profile.telegram?.[0]?.trim() ||
        profile.instagram?.[0]?.trim()
      ),
    },
    { key: "profile.bio", filled: !!profile.bio?.trim() },
    { key: "profile.sex", filled: !!profile.sex },
    { key: "profile.language", filled: !!profile.language?.trim() },
    ...(cityRequired
      ? [{ key: "profile.city", filled: !!profile.city?.trim() }]
      : []),
  ];

  const filled = fields.filter((f) => f.filled).length;
  const total = fields.length;
  const missingKeys = fields.filter((f) => !f.filled).map((f) => f.key);
  const percent = total === 0 ? 100 : Math.round((filled / total) * 100);

  return { percent, filled, total, missingKeys };
}
