import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const PRODUCT_EMPIRE_PACK = 'empire_pack';
export const PRODUCT_COINS_1000 = 'coins_1000';

export function useBilling(addViralCoins: (n: number) => void) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const CdvPurchase = (window as any).CdvPurchase;
    if (!CdvPurchase || !CdvPurchase.store) return;
    const store = CdvPurchase.store;

    store.register([
      { id: PRODUCT_EMPIRE_PACK, type: CdvPurchase.ProductType.NON_CONSUMABLE, platform: CdvPurchase.Platform.GOOGLE_PLAY },
      { id: PRODUCT_COINS_1000, type: CdvPurchase.ProductType.CONSUMABLE, platform: CdvPurchase.Platform.GOOGLE_PLAY },
    ]);

    store.when().approved((tx: any) => {
      if (tx.productId === PRODUCT_COINS_1000) addViralCoins(1000);
      tx.verify();
      tx.finish();
    });

    store.ready(() => setIsReady(true));
    store.initialize([CdvPurchase.Platform.GOOGLE_PLAY]);
  }, [addViralCoins]);

  const purchase = (id: string) => {
    const CdvPurchase = (window as any).CdvPurchase;
    if (!CdvPurchase) return toast.error("Not on device");

    const store = CdvPurchase.store;
    const p = store.get(id);

    if (p) {
        store.order(p);
    } else {
        store.update(); // Try to sync
        toast.info("Connecting to Google Play Store... please try again in a moment.");
    }
  };

  return { isReady, purchase };
}
