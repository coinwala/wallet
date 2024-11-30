import { useState, useEffect } from "react";
import axios from "axios";

export interface TokenApiList {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  tags: string[];
  daily_volume: number;
  freeze_authority: string | null;
  mint_authority: string | null;
}

const cachedTokens: TokenApiList[] | null = null;
export const useFetchTokens = () => {
  const [tokens, setTokens] = useState<TokenApiList[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      if (!cachedTokens) {
        try {
          const response = await axios.get<TokenApiList[]>(
            "https://tokens.jup.ag/tokens?tags=verified"
          );
          setTokens(response.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching token data:", err);
          setError("Error fetching token data");
          setLoading(false);
        }
      } else {
        setTokens(cachedTokens);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { tokens, loading, error };
};
