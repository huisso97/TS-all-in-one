type Brand<K, T> = K & { _brand: T };

type EUR = Brand<number, "EURO">;
type USD = Brand<number, "USD">;
type KRW = Brand<number, "KR">;

const usd = 10 as USD;
const eur = 10 as EUR;
const krw = 200 as KRW;
function euroToUsd(euro: EUR): number {
  return euro * 1.18;
}
euroToUsd(eur);
