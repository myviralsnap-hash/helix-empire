import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Define product IDs
export const PRODUCT_EMPIRE_PACK = 'empire_pack';
export const PRODUCT_COINS_1000 = 'coins_1000';

export function useBilling(addViralCoins: (n: number) => void) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Safety check: make sure we are on a device and the plugin exists
    const CdvPurchase = (window as any).CdvPurchase;

    if (!CdvPurchase || !CdvPurchase.store) {
        console.warn("In-App Purchase plugin (CdvPurchase) not found. This hook only works on a real device.");
        return;
    }

    const store = CdvPurchase.store;

    try {
        // 2. Register Products (New v13+ Syntax)
        // We use the same IDs as in Google Play Console
        store.register([
          {
            id: PRODUCT_EMPIRE_PACK,
            type: CdvPurchase.ProductType.NON_CONSUMABLE,
            platform: CdvPurchase.Platform.GOOGLE_PLAY,
          },
          {
            id: PRODUCT_COINS_1000,
            type: CdvPurchase.ProductType.CONSUMABLE,
            platform: CdvPurchase.Platform.GOOGLE_PLAY,
          },
        ]);

        // 3. Handle Approvals (What happens when they pay)
        store.when().approved((transaction: any) => {
            console.log("Transaction approved:", transaction);
            if (transaction.productId === PRODUCT_COINS_1000) {
                toast.success("1,000 ViralCoins added!");
                addViralCoins(1000);
            } else if (transaction.productId === PRODUCT_EMPIRE_PACK) {
                toast.success("Empire Pack Activated!");
            }
            transaction.verify();
            transaction.finish();
        });

        // Handle Errors
        store.error((error: any) => {
          console.error('Store Error: ', error);
          if (error.code !== 6) { // 6 is user cancelled
            toast.error("Billing error: " + error.message);
          }
        });

        // 4. Initialize the store
        store.initialize([CdvPurchase.Platform.GOOGLE_PLAY]);

        store.ready(() => {
            console.log("Store is ready. Products:", store.products);
            setIsReady(true);
        });

    } catch (err) {
        console.error("Failed to initialize store:", err);
    }

  }, [addViralCoins]);

  const purchase = (productId: string) => {
    const CdvPurchase = (window as any).CdvPurchase;
    if (!CdvPurchase || !CdvPurchase.store) {
        return toast.error("Billing is only available on a real device.");
    }

    const store = CdvPurchase.store;
    // Try to find the product by ID
    const product = store.get(productId, CdvPurchase.Platform.GOOGLE_PLAY);

    if (product) {
        console.log("Ordering product:", product);
        toast.info("Opening Google Play...");
        store.order(product);
    } else {
        console.error("Product not found in store. Registered products:", store.products);
        toast.error("Product not found. Please wait for store to sync or check Play Console.");
    }
  };

  return { isReady, purchase };
}
