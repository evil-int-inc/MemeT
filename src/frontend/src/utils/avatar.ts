const defaultAvatarPathById = {
  pepe: "/assets/images/avatar-pepe.png",
} as const;
type DefaultAvatarId = keyof typeof defaultAvatarPathById;
const defaultAvatar: DefaultAvatarId = "pepe";

type ProfileAvatarSource = {
  defaultAvatar?: string | null;
  photos?: Array<{
    blob: {
      getDirectURL: () => string;
    };
  }> | null;
};

export function getDefaultAvatarId(avatar?: string | null): DefaultAvatarId {
  return avatar != null && avatar in defaultAvatarPathById
    ? (avatar as DefaultAvatarId)
    : defaultAvatar;
}

export function getDefaultAvatarUrl(avatar?: string | null): string {
  return defaultAvatarPathById[getDefaultAvatarId(avatar)];
}

export function getProfileAvatarUrl(
  profile?: ProfileAvatarSource | null,
): string {
  return (
    profile?.photos?.[0]?.blob.getDirectURL() ??
    getDefaultAvatarUrl(profile?.defaultAvatar)
  );
}
