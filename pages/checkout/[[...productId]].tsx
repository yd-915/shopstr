import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { SimplePool } from "nostr-tools";
import { parseTags, productData } from "../components/utility/product-parser-functions";
import CheckoutPage from "../components/checkout-page";
import { getLocalStorageData } from "../components/utility/nostr-helper-functions";

const Checkout = () => {
  const router = useRouter();
  const [relays, setRelays] = useState([]);
  const [productData, setProductData] = useState<productData | null>(null);

  const { productId } = router.query;
  const productIdString = productId ? productId[0] : "";

  useEffect(() => {
    if (!productId) {
      router.push("/"); // if there isn't a productId, redirect to home page
    }
  }, []);

  useEffect(() => {
    let { relays: storedRelays } = getLocalStorageData();
    setRelays(storedRelays ? storedRelays : ["wss://relay.damus.io", "wss://nos.lol"]);
  }, []);

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
  }, [relays]);

  return <CheckoutPage productData={productData} />;
};

export default Checkout;
