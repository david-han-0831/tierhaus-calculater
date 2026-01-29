/**
 * 생산제품 시드 데이터 (docs/data/products.json과 동일)
 * "시드 데이터 불러오기" 시 Firestore에 추가되는 목록
 */
export const productsSeed = [
  { name: "닭안심육포 80g", unit: "봉지", sellingPricePerUnit: 10000, packagingCostPerUnit: 0 },
  { name: "오리안심육포 60g", unit: "봉지", sellingPricePerUnit: 10000, packagingCostPerUnit: 0 },
  { name: "말고기 육포 80g", unit: "봉지", sellingPricePerUnit: 10000, packagingCostPerUnit: 0 },
] as const;
