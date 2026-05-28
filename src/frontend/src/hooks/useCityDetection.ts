import { NOMINATIM_URL } from "@/constants";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  county?: string;
}

interface NominatimResponse {
  address: NominatimAddress;
}

export function useCityDetection() {
  const { t } = useTranslation();
  const [city, setCity] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectCity = useCallback(() => {
    if (!navigator.geolocation) {
      setError(t("errors.geolocationNotSupported"));
      return;
    }

    setIsDetecting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const url = `${NOMINATIM_URL}/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;
          const res = await fetch(url, {
            headers: { "Accept-Language": "en" },
          });
          if (!res.ok) throw new Error("Geocoding request failed");
          const data: NominatimResponse = await res.json();
          const detected =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county ||
            null;
          if (detected) {
            setCity(detected);
          } else {
            setError(t("errors.geocodingFailed"));
          }
        } catch {
          setError(t("errors.geocodingFailed"));
        } finally {
          setIsDetecting(false);
        }
      },
      (geoError) => {
        setIsDetecting(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError(t("errors.locationDenied"));
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          setError(t("errors.locationUnavailable"));
        } else {
          setError(t("errors.locationTimeout"));
        }
      },
      { timeout: 10000, maximumAge: 300000 },
    );
  }, [t]);

  return { detectCity, city, isDetecting, error };
}
