import { YutaBrandMark, yutaLogoAsset } from '@yuta/ui';
import type { Establishment } from '../_lib/booking-types';

export function RestaurantBrand({
  establishment,
}: {
  establishment: Establishment;
  showWelcome?: boolean;
}) {
  const usesYutaLogo = !establishment.logoUrl;
  return (
    <div className="my-6 text-center">
      <div className="inline-flex items-center justify-center gap-2">
        {usesYutaLogo ? (
          <YutaBrandMark
            iconClassName="h-10 w-10"
            nameClassName="text-xl font-black tracking-[0.14em]"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={establishment.logoUrl ?? yutaLogoAsset.src}
            alt={`Logo ${establishment.name}`}
            className="h-14 max-w-36 object-contain"
          />
        )}
      </div>
    </div>
  );
}
