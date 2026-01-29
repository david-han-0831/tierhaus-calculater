/**
 * 원물 시드 데이터 (docs/data/raw-materials.json과 동일)
 * "시드 데이터 불러오기" 시 Firestore에 추가되는 목록
 */
export const rawMaterialsSeed = [
  { name: "열빙어", unit: "kg", pricePerUnit: 8400 },
  { name: "오리목뼈", unit: "kg", pricePerUnit: 1500 },
  { name: "오리날개", unit: "kg", pricePerUnit: 1800 },
  { name: "닭안심", unit: "kg", pricePerUnit: 3400 },
  { name: "칠면조목뼈", unit: "kg", pricePerUnit: 3400 },
  { name: "오리안심", unit: "kg", pricePerUnit: 5800 },
  { name: "닭발", unit: "kg", pricePerUnit: 3800 },
  { name: "오리도가니", unit: "kg", pricePerUnit: 1500 },
  { name: "소고기", unit: "kg", pricePerUnit: 16000 },
  { name: "사슴고기", unit: "kg", pricePerUnit: 15500 },
  { name: "칠면조안심", unit: "kg", pricePerUnit: 11500 },
  { name: "오리장각", unit: "kg", pricePerUnit: 6500 },
  { name: "말고기", unit: "kg", pricePerUnit: 7900 },
  { name: "초록입홍합", unit: "kg", pricePerUnit: 17000 },
  { name: "연어", unit: "kg", pricePerUnit: 6000 },
  { name: "한우 간", unit: "kg", pricePerUnit: 2300 },
  { name: "말꼬리", unit: "kg", pricePerUnit: 8500 },
  { name: "메추리", unit: "한마리", pricePerUnit: 1300 },
] as const;
