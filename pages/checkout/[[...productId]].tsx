import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SimplePool, Sub } from "nostr-tools";
import parseTags, {
  ProductData,
} from "../components/utility/product-parser-functions";
import CheckoutPage from "../components/checkout-page";
import { getLocalStorageData } from "../components/utility/nostr-helper-functions";

const Checkout = () => {
  const router = useRouter();
  const [relays, setRelays] = useState<string[]>([]);
  const [productData, setProductData] = useState<ProductData | undefined>(undefined);

  const { productId } = router.query;
  const productIdString = productId ? productId[0] : "";

  useEffect(() => {
    if (!productId) {
      router.push("/");
    }
  }, [productId, router]);

  useEffect(() => {
    let { relays } = getLocalStorageData();
    setRelays(relays ? relays : ["wss://relay.damus.io", "wss://nos.lol"]);
  }, []);

  useEffect(() => {
    const pool = new SimplePool();

    let subParams: { ids: string[]; kinds: number[] } = {
      ids: [productIdString],
      kinds: [30402],
    };

    let productSub: Sub<number> = pool.sub(relays, [subParams]);

    productSub.on("event", (event) => {
      const parsedProductData = parseTags(event);
      setProductData(parsedProductData);
    });

    return () => {
      // Assuming 'close' is the correct method
      productSub.close();
    };
  }, [relays, productIdString]);

  return <CheckoutPage productData={productData} />;
};

export default Checkout;
