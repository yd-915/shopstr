import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SimplePool } from "nostr-tools";
import parseTags, {
  ProductData,
} from "../components/utility/product-parser-functions";
import CheckoutPage from "../components/checkout-page";
import { getLocalStorageData } from "../components/utility/nostr-helper-functions";

const Checkout = () => {
  const router = useRouter();
  const [relays, setRelays] = useState<string[]>([]); // Provide a default value for relays
  const [productData, setProductData] = useState<ProductData | undefined>(
    undefined,
  );

  const { productId } = router.query;
  const productIdString = productId ? productId[0] : "";

  useEffect(() => {
    if (!productId) {
      router.push("/"); // if there isn't a productId, redirect to the home page
    }
  }, [productId, router]);

  useEffect(() => {
    let { relays } = getLocalStorageData();
    setRelays(relays ? relays : ["wss://relay.damus.io", "wss://nos.lol"]);
  }, []); // Empty dependency array to run only once when the component mounts

  useEffect(() => {
    const pool = new SimplePool();

    let subParams: { ids: string[]; kinds: number[] } = {
      ids: [productIdString],
      kinds: [30402],
    };

    let productSub = pool.sub(relays, [subParams]);

    productSub.on("event", (event) => {
      const parsedProductData = parseTags(event);
      setProductData(parsedProductData);
    });

    // Clean up the subscription when the component unmounts
    return () => {
      productSub.unsubscribe();
    };
  }, [relays, productIdString]); // Add dependencies to the dependency array

  return <CheckoutPage productData={productData} />;
};

export default Checkout;

