import ProfileTypes "profile";
import AdTypes "advertisement";

module {
  public type Favourite = {
    id : Text;
    adId : Text;
    userPrincipal : Principal;
    createdAt : Int;
  };

  // Public projection (same shape for now)
  public type FavouritePublic = {
    id : Text;
    adId : Text;
    userPrincipal : Principal;
    createdAt : Int;
  };

  // Favourite paired with full ad data (mirrors JoinRequestWithAd pattern)
  public type FavouriteWithAd = {
    favourite : FavouritePublic;
    ad : ?AdTypes.AdvertisementPublic;
  };
};
