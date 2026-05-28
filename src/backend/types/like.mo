import AdTypes "advertisement";

module {
  // A like on an advertisement
  public type AdLike = {
    id : Text;
    adId : Text;
    userPrincipal : Principal;
    createdAt : Int;
  };

  // AdLike paired with the full ad data
  public type AdLikeWithAd = {
    like : AdLike;
    ad : ?AdTypes.AdvertisementPublic;
  };

  // A like on a user profile
  public type ProfileLike = {
    id : Text;
    profilePrincipal : Principal;
    likerPrincipal : Principal;
    createdAt : Int;
  };
};
