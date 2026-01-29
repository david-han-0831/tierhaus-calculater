"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getProducts, type Product } from "@/lib/products";
import { getRawMaterials, type RawMaterial } from "@/lib/rawMaterials";
import html2canvas from "html2canvas";

const cardClass =
  "rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]";
const labelClass = "text-sm font-medium text-[var(--muted)] mb-1.5 block";
const inputClass =
  "w-full rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]/40 transition";
const selectClass =
  "w-full min-h-[44px] rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]/40 transition";

export default function CalculatorPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const [orderQtyDisplay, setOrderQtyDisplay] = useState("");
  const [costPerUnitDisplay, setCostPerUnitDisplay] = useState("");
  const [productionQtyDisplay, setProductionQtyDisplay] = useState("");
  const [sellingPriceDisplay, setSellingPriceDisplay] = useState("");
  const [packagingCostDisplay, setPackagingCostDisplay] = useState("");
  const [deliveryFeeDisplay, setDeliveryFeeDisplay] = useState("5000");

  const orderQty = Number(orderQtyDisplay) || 0;
  const costPerUnit = Number(costPerUnitDisplay) || 0;
  const productionQty = Number(productionQtyDisplay) || 0;
  const sellingPrice = Number(sellingPriceDisplay) || 0;
  const packagingCost = Number(packagingCostDisplay) || 0;
  const deliveryFee = Number(deliveryFeeDisplay) || 0;

  const handleNumberChange = (
    value: string,
    setter: (s: string) => void
  ) => {
    const digits = value.replace(/\D/g, "");
    if (digits === "") {
      setter("");
      return;
    }
    setter(digits.replace(/^0+/, "") || "0");
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const linkedRawMaterial = selectedProduct?.rawMaterialId
    ? rawMaterials.find((r) => r.id === selectedProduct.rawMaterialId)
    : undefined;

  const rawMaterialUnit = linkedRawMaterial?.unit ?? "kg";
  const productUnit = selectedProduct?.unit ?? "봉지";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productList, rawMaterialList] = await Promise.all([
        getProducts(),
        getRawMaterials(),
      ]);
      setProducts(productList);
      setRawMaterials(rawMaterialList);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!selectedProductId) return;
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;
    setSellingPriceDisplay(String(product.sellingPricePerUnit));
    setPackagingCostDisplay(String(product.packagingCostPerUnit));
    const raw = product.rawMaterialId
      ? rawMaterials.find((r) => r.id === product.rawMaterialId)
      : undefined;
    if (raw) setCostPerUnitDisplay(String(raw.pricePerUnit));
  }, [selectedProductId, products, rawMaterials]);

  const rawMaterialCost = orderQty * costPerUnit;
  const packagingTotal = productionQty * packagingCost;
  const expectedRevenue = productionQty * sellingPrice;
  const vat = Math.round(expectedRevenue * 0.1);
  const totalExpense = rawMaterialCost + packagingTotal + vat + deliveryFee;
  const expectedProfit = expectedRevenue - totalExpense;
  const profitPerUnit = productionQty > 0 ? Math.ceil(expectedProfit / productionQty) : 0;
  const costPerUnitProduct = productionQty > 0 ? Math.floor(totalExpense / productionQty) : 0;
  const profitRate =
    costPerUnitProduct > 0 ? Math.round((profitPerUnit / costPerUnitProduct) * 100) : 0;
  const costRatio =
    sellingPrice > 0 ? ((costPerUnitProduct / sellingPrice) * 100).toFixed(1) : "0";
  const marginRate =
    sellingPrice > 0 ? ((profitPerUnit / sellingPrice) * 100).toFixed(1) : "0";

  const captureRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);

  const handleScreenshot = async () => {
    if (!captureRef.current) return;
    setCapturing(true);
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      link.download = `수익률계산_${date}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setCapturing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center py-12">
        <p className="text-[var(--muted)] text-sm">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div ref={captureRef} className="space-y-6 bg-[var(--background)] p-1">
        <header>
          <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">
            수익률 계산
          </h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            상품을 선택하면 연결된 원물·상품 정보가 불러와집니다. 원가 주문량과 생산량을 입력하면 예상 지출과 기대 수익을 계산합니다.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 영역 */}
        <div className={`${cardClass} space-y-6`}>
          <h2 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider text-[var(--muted)]">
            입력
          </h2>

          <div>
            <label className={labelClass}>상품 선택</label>
            <select
              className={selectClass}
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">상품을 선택하세요</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.rawMaterialId
                    ? ` (${rawMaterials.find((r) => r.id === p.rawMaterialId)?.name ?? ""})`
                    : ""}
                </option>
              ))}
            </select>
            {selectedProduct && linkedRawMaterial && (
              <p className="text-xs text-[var(--muted)] mt-1">
                연결 원물: {linkedRawMaterial.name} · 원가 단가·단위가 자동으로 채워졌습니다.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                원가 주문량 ({rawMaterialUnit})
              </label>
              <input
                type="text"
                inputMode="numeric"
                className={inputClass}
                value={orderQtyDisplay}
                onChange={(e) => handleNumberChange(e.target.value, setOrderQtyDisplay)}
                onFocus={(e) => e.target.select()}
                placeholder="0"
              />
            </div>
            <div>
              <label className={labelClass}>
                원가 단가 (원/{rawMaterialUnit})
              </label>
              <input
                type="text"
                inputMode="numeric"
                className={inputClass}
                value={costPerUnitDisplay}
                onChange={(e) => handleNumberChange(e.target.value, setCostPerUnitDisplay)}
                onFocus={(e) => e.target.select()}
                placeholder="0"
              />
            </div>
            <div>
              <label className={labelClass}>
                생산량 ({productUnit})
              </label>
              <input
                type="text"
                inputMode="numeric"
                className={inputClass}
                value={productionQtyDisplay}
                onChange={(e) => handleNumberChange(e.target.value, setProductionQtyDisplay)}
                onFocus={(e) => e.target.select()}
                placeholder="0"
              />
            </div>
            <div>
              <label className={labelClass}>
                판매 단가 (원/{productUnit})
              </label>
              <input
                type="text"
                inputMode="numeric"
                className={inputClass}
                value={sellingPriceDisplay}
                onChange={(e) => handleNumberChange(e.target.value, setSellingPriceDisplay)}
                onFocus={(e) => e.target.select()}
                placeholder="0"
              />
            </div>
            <div>
              <label className={labelClass}>
                포장비·잡비 (원/{productUnit})
              </label>
              <input
                type="text"
                inputMode="numeric"
                className={inputClass}
                value={packagingCostDisplay}
                onChange={(e) => handleNumberChange(e.target.value, setPackagingCostDisplay)}
                onFocus={(e) => e.target.select()}
                placeholder="0"
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>택배비 (원)</label>
              <input
                type="text"
                inputMode="numeric"
                className={inputClass}
                value={deliveryFeeDisplay}
                onChange={(e) => handleNumberChange(e.target.value, setDeliveryFeeDisplay)}
                onFocus={(e) => e.target.select()}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* 지출 내역 + 매출·수익 */}
        <div className="space-y-6">
          <div className={cardClass}>
            <h2 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider text-[var(--muted)] mb-4">
              지출 내역
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between py-2 border-b border-[var(--card-border)]">
                <span className="text-[var(--muted)]">원물 주문가격</span>
                <span className="font-medium">{rawMaterialCost.toLocaleString()}원</span>
              </li>
              <li className="flex justify-between py-2 border-b border-[var(--card-border)]">
                <span className="text-[var(--muted)]">포장비 등 잡비</span>
                <span className="font-medium">{packagingTotal.toLocaleString()}원</span>
              </li>
              <li className="flex justify-between py-2 border-b border-[var(--card-border)]">
                <span className="text-[var(--muted)]">부가세 (10%)</span>
                <span className="font-medium">{vat.toLocaleString()}원</span>
              </li>
              <li className="flex justify-between py-2 border-b border-[var(--card-border)]">
                <span className="text-[var(--muted)]">택배비</span>
                <span className="font-medium">{deliveryFee.toLocaleString()}원</span>
              </li>
              <li className="flex justify-between py-3 font-semibold">
                <span>합계</span>
                <span>{totalExpense.toLocaleString()}원</span>
              </li>
            </ul>
          </div>

          <div
            className={cardClass}
            style={{ background: "var(--sub)" }}
          >
            <h2 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider text-[var(--muted)] mb-4">
              매출·수익
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">기대 매출</span>
                <span className="font-semibold text-[var(--foreground)]">
                  {expectedRevenue.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">기대 수익</span>
                <span className="font-semibold text-[var(--foreground)]">
                  {expectedProfit.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[var(--card-border)]">
                <span className="text-[var(--muted)]">1{productUnit}당 수익</span>
                <span className="font-medium">{profitPerUnit.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">1{productUnit}당 원가</span>
                <span className="font-medium">{costPerUnitProduct.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">1{productUnit}당 수익률</span>
                <span className="font-medium">{profitRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">판매가 중 원가율</span>
                <span className="font-medium">{costRatio}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--muted)]">마진율</span>
                <span className="font-medium">{marginRate}%</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleScreenshot}
          disabled={capturing}
          className="rounded-[var(--radius)] bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {capturing ? "저장 중..." : "스크린샷 저장"}
        </button>
      </div>
    </div>
  );
}
