"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  getRawMaterials,
  addRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
  type RawMaterial,
} from "@/lib/rawMaterials";
import { rawMaterialsSeed } from "@/lib/rawMaterialsSeed";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from "@/lib/products";
import { productsSeed } from "@/lib/productsSeed";

const tabs = [
  { id: "raw-materials", label: "원물 관리", icon: "🌾" },
  { id: "products", label: "생산제품 관리", icon: "📦" },
  { id: "expenditure", label: "지출 설정", icon: "💰" },
];

const cardClass =
  "rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]";
const labelClass = "text-sm font-medium text-[var(--muted)] mb-1.5 block";
const inputClass =
  "w-full rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary-light)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]/40 transition";
const btnPrimary =
  "rounded-[var(--radius)] bg-[var(--primary)] text-white px-4 py-2.5 text-sm font-medium hover:opacity-90 transition";
const btnSecondary =
  "rounded-[var(--radius)] border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--sidebar)] transition";

/** 숫자만 허용, 앞자리 0 제거, 빈 값 허용(백스페이스로 0 지우기 가능) */
function handleNumberField(value: string, setter: (s: string) => void) {
  const digits = value.replace(/\D/g, "");
  if (digits === "") {
    setter("");
    return;
  }
  setter(digits.replace(/^0+/, "") || "0");
}

export type RawMaterialForm = {
  name: string;
  unit: string;
  pricePerUnit: string;
};

const emptyRawMaterial: RawMaterialForm = {
  name: "",
  unit: "kg",
  pricePerUnit: "",
};

export type ProductForm = {
  name: string;
  unit: string;
  sellingPricePerUnit: string;
  packagingCostPerUnit: string;
  rawMaterialId: string;
};

const emptyProduct: ProductForm = {
  name: "",
  unit: "봉지",
  sellingPricePerUnit: "",
  packagingCostPerUnit: "",
  rawMaterialId: "",
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("raw-materials");
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [rawMaterialsLoading, setRawMaterialsLoading] = useState(false);
  const [rawMaterialsError, setRawMaterialsError] = useState<string | null>(null);
  const [addRawMaterialOpen, setAddRawMaterialOpen] = useState(false);
  const [editRawMaterial, setEditRawMaterial] = useState<RawMaterial | null>(null);
  const [rawMaterialForm, setRawMaterialForm] = useState<RawMaterialForm>(emptyRawMaterial);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [seedLoading, setSeedLoading] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [deleteProductTargetId, setDeleteProductTargetId] = useState<string | null>(null);
  const [productSeedLoading, setProductSeedLoading] = useState(false);

  const fetchRawMaterials = useCallback(async () => {
    setRawMaterialsLoading(true);
    setRawMaterialsError(null);
    try {
      const list = await getRawMaterials();
      setRawMaterials(list);
    } catch (e) {
      setRawMaterialsError(e instanceof Error ? e.message : "원물 목록을 불러오지 못했습니다.");
    } finally {
      setRawMaterialsLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const list = await getProducts();
      setProducts(list);
    } catch (e) {
      setProductsError(e instanceof Error ? e.message : "생산제품 목록을 불러오지 못했습니다.");
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "raw-materials") {
      fetchRawMaterials();
    }
  }, [activeTab, fetchRawMaterials]);

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
      fetchRawMaterials();
    }
  }, [activeTab, fetchProducts, fetchRawMaterials]);

  const rawMaterialModalOpen = addRawMaterialOpen || editRawMaterial != null;

  const openAddRawMaterial = () => {
    setEditRawMaterial(null);
    setRawMaterialForm(emptyRawMaterial);
    setAddRawMaterialOpen(true);
  };

  const openEditRawMaterial = (r: RawMaterial) => {
    setAddRawMaterialOpen(false);
    setEditRawMaterial(r);
    setRawMaterialForm({
      name: r.name,
      unit: r.unit,
      pricePerUnit: String(r.pricePerUnit),
    });
  };

  const closeRawMaterialModal = () => {
    setAddRawMaterialOpen(false);
    setEditRawMaterial(null);
  };

  const submitRawMaterial = async () => {
    const name = rawMaterialForm.name.trim();
    const price = Number(rawMaterialForm.pricePerUnit) || 0;
    if (!name || !user) return;
    setSubmitting(true);
    try {
      if (editRawMaterial) {
        await updateRawMaterial(editRawMaterial.id, {
          name,
          unit: rawMaterialForm.unit.trim() || "kg",
          pricePerUnit: price,
        });
      } else {
        await addRawMaterial(
          { name, unit: rawMaterialForm.unit.trim() || "kg", pricePerUnit: price },
          user.uid
        );
      }
      await fetchRawMaterials();
      closeRawMaterialModal();
    } catch (e) {
      setRawMaterialsError(e instanceof Error ? e.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRawMaterial = async (id: string) => {
    try {
      await deleteRawMaterial(id);
      await fetchRawMaterials();
      setDeleteTargetId(null);
    } catch (e) {
      setRawMaterialsError(e instanceof Error ? e.message : "삭제에 실패했습니다.");
    }
  };

  const handleSeedLoad = async () => {
    if (!user) return;
    setSeedLoading(true);
    setRawMaterialsError(null);
    try {
      const existingNames = new Set(rawMaterials.map((r) => r.name));
      let added = 0;
      for (const item of rawMaterialsSeed) {
        if (existingNames.has(item.name)) continue;
        await addRawMaterial(
          { name: item.name, unit: item.unit, pricePerUnit: item.pricePerUnit },
          user.uid
        );
        existingNames.add(item.name);
        added += 1;
      }
      await fetchRawMaterials();
      if (added > 0) {
        setRawMaterialsError(null);
      }
    } catch (e) {
      setRawMaterialsError(e instanceof Error ? e.message : "시드 불러오기에 실패했습니다.");
    } finally {
      setSeedLoading(false);
    }
  };

  const productModalOpen = addProductOpen || editProduct != null;

  const openAddProduct = () => {
    setEditProduct(null);
    setProductForm(emptyProduct);
    setAddProductOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setAddProductOpen(false);
    setEditProduct(p);
    setProductForm({
      name: p.name,
      unit: p.unit,
      sellingPricePerUnit: String(p.sellingPricePerUnit),
      packagingCostPerUnit: String(p.packagingCostPerUnit),
      rawMaterialId: p.rawMaterialId ?? "",
    });
  };

  const closeProductModal = () => {
    setAddProductOpen(false);
    setEditProduct(null);
  };

  const submitProduct = async () => {
    const name = productForm.name.trim();
    const selling = Number(productForm.sellingPricePerUnit) || 0;
    const packaging = Number(productForm.packagingCostPerUnit) || 0;
    if (!name || !user) return;
    setProductSubmitting(true);
    try {
      const rawMaterialId = productForm.rawMaterialId?.trim() || undefined;
      if (editProduct) {
        await updateProduct(editProduct.id, {
          name,
          unit: productForm.unit.trim() || "봉지",
          sellingPricePerUnit: selling,
          packagingCostPerUnit: packaging,
          rawMaterialId,
        });
      } else {
        await addProduct(
          {
            name,
            unit: productForm.unit.trim() || "봉지",
            sellingPricePerUnit: selling,
            packagingCostPerUnit: packaging,
            rawMaterialId,
          },
          user.uid
        );
      }
      await fetchProducts();
      closeProductModal();
    } catch (e) {
      setProductsError(e instanceof Error ? e.message : "저장에 실패했습니다.");
    } finally {
      setProductSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      await fetchProducts();
      setDeleteProductTargetId(null);
    } catch (e) {
      setProductsError(e instanceof Error ? e.message : "삭제에 실패했습니다.");
    }
  };

  const handleProductSeedLoad = async () => {
    if (!user) return;
    setProductSeedLoading(true);
    setProductsError(null);
    try {
      const existingNames = new Set(products.map((p) => p.name));
      for (const item of productsSeed) {
        if (existingNames.has(item.name)) continue;
        await addProduct(
          {
            name: item.name,
            unit: item.unit,
            sellingPricePerUnit: item.sellingPricePerUnit,
            packagingCostPerUnit: item.packagingCostPerUnit,
          },
          user.uid
        );
        existingNames.add(item.name);
      }
      await fetchProducts();
    } catch (e) {
      setProductsError(e instanceof Error ? e.message : "시드 불러오기에 실패했습니다.");
    } finally {
      setProductSeedLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">
          설정
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          원물, 생산제품, 지출 기본값을 설정합니다. 계산 화면에서 이 값들이 기본으로 사용됩니다.
        </p>
      </header>

      <div className="flex gap-1 p-1 rounded-[var(--radius-lg)] border border-[var(--card-border)] bg-[var(--sidebar)] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius)] text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-[var(--shadow-sm)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "raw-materials" && (
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">
            원물 관리
          </h2>
          <p className="text-sm text-[var(--muted)] mb-6">
            원자재(원물)를 등록하고 단가를 설정합니다. 10개 이상 등록 가능합니다.
          </p>
          {rawMaterialsError && (
            <p className="text-sm text-red-600 mb-4">{rawMaterialsError}</p>
          )}
          <div className="border border-[var(--card-border)] rounded-[var(--radius)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--sidebar)] border-b border-[var(--card-border)]">
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted)]">이름</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted)]">단위</th>
                  <th className="text-right py-3 px-4 font-medium text-[var(--muted)]">단가 (원)</th>
                  <th className="w-28 py-3 px-4 text-center font-medium text-[var(--muted)]">관리</th>
                </tr>
              </thead>
              <tbody>
                {rawMaterialsLoading ? (
                  <tr className="border-b border-[var(--card-border)]">
                    <td colSpan={4} className="py-8 px-4 text-center text-[var(--muted)]">
                      불러오는 중...
                    </td>
                  </tr>
                ) : rawMaterials.length === 0 ? (
                  <tr className="border-b border-[var(--card-border)]">
                    <td colSpan={4} className="py-3 px-4 text-[var(--muted)] text-sm">
                      등록된 원물이 없습니다. 아래 버튼으로 추가하거나 시드 데이터를 불러오세요.
                    </td>
                  </tr>
                ) : (
                  rawMaterials.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-[var(--card-border)] cursor-pointer hover:bg-[var(--sidebar)]/50"
                      onClick={() => openEditRawMaterial(r)}
                    >
                      <td className="py-3 px-4 font-medium">{r.name}</td>
                      <td className="py-3 px-4 text-[var(--muted)]">{r.unit}</td>
                      <td className="py-3 px-4 text-right">{r.pricePerUnit.toLocaleString()}원</td>
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => openEditRawMaterial(r)}
                          className="text-[var(--primary)] hover:underline text-xs font-medium mr-2"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(r.id)}
                          className="text-[var(--muted)] hover:text-red-600 text-xs font-medium"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <button type="button" onClick={openAddRawMaterial} className={btnPrimary}>
              원물 추가
            </button>
            <button
              type="button"
              onClick={handleSeedLoad}
              disabled={seedLoading}
              className={`${btnSecondary} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {seedLoading ? "불러오는 중..." : "시드 데이터 불러오기"}
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteTargetId != null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => deleteTargetId != null && handleDeleteRawMaterial(deleteTargetId)}
        title="원물 삭제"
        message="이 원물을 삭제할까요?"
        confirmLabel="삭제"
        cancelLabel="취소"
      />

      {activeTab === "products" && (
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">
            생산제품 관리
          </h2>
          <p className="text-sm text-[var(--muted)] mb-6">
            생산제품(봉지 등)을 등록하고 판매 단가, 포장비를 설정합니다. 10개 이상 등록 가능합니다.
          </p>
          {productsError && (
            <p className="text-sm text-red-600 mb-4">{productsError}</p>
          )}
          <div className="border border-[var(--card-border)] rounded-[var(--radius)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--sidebar)] border-b border-[var(--card-border)]">
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted)]">이름</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted)]">단위</th>
                  <th className="text-left py-3 px-4 font-medium text-[var(--muted)]">연결 원물</th>
                  <th className="text-right py-3 px-4 font-medium text-[var(--muted)]">판매 단가</th>
                  <th className="text-right py-3 px-4 font-medium text-[var(--muted)]">포장비·잡비</th>
                  <th className="w-28 py-3 px-4 text-center font-medium text-[var(--muted)]">관리</th>
                </tr>
              </thead>
              <tbody>
                {productsLoading ? (
                  <tr className="border-b border-[var(--card-border)]">
                    <td colSpan={6} className="py-8 px-4 text-center text-[var(--muted)]">
                      불러오는 중...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr className="border-b border-[var(--card-border)]">
                    <td colSpan={6} className="py-3 px-4 text-[var(--muted)] text-sm">
                      등록된 생산제품이 없습니다. 아래 버튼으로 추가하거나 시드 데이터를 불러오세요.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-[var(--card-border)] cursor-pointer hover:bg-[var(--sidebar)]/50"
                      onClick={() => openEditProduct(p)}
                    >
                      <td className="py-3 px-4 font-medium">{p.name}</td>
                      <td className="py-3 px-4 text-[var(--muted)]">{p.unit}</td>
                      <td className="py-3 px-4 text-[var(--muted)]">
                        {p.rawMaterialId
                          ? rawMaterials.find((r) => r.id === p.rawMaterialId)?.name ?? "-"
                          : "-"}
                      </td>
                      <td className="py-3 px-4 text-right">{p.sellingPricePerUnit.toLocaleString()}원</td>
                      <td className="py-3 px-4 text-right">{p.packagingCostPerUnit.toLocaleString()}원</td>
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => openEditProduct(p)}
                          className="text-[var(--primary)] hover:underline text-xs font-medium mr-2"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteProductTargetId(p.id)}
                          className="text-[var(--muted)] hover:text-red-600 text-xs font-medium"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <button type="button" onClick={openAddProduct} className={btnPrimary}>
              생산제품 추가
            </button>
            <button
              type="button"
              onClick={handleProductSeedLoad}
              disabled={productSeedLoading}
              className={`${btnSecondary} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {productSeedLoading ? "불러오는 중..." : "시드 데이터 불러오기"}
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteProductTargetId != null}
        onClose={() => setDeleteProductTargetId(null)}
        onConfirm={() => deleteProductTargetId != null && handleDeleteProduct(deleteProductTargetId)}
        title="생산제품 삭제"
        message="이 생산제품을 삭제할까요?"
        confirmLabel="삭제"
        cancelLabel="취소"
      />

      {activeTab === "expenditure" && (
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">
            지출 설정
          </h2>
          <p className="text-sm text-[var(--muted)] mb-6">
            택배비 등 계산 시 사용할 기본값을 설정합니다. 부가세는 한국 부가세율 10%로 고정 적용됩니다.
          </p>
          <div className="max-w-md space-y-4">
            <p className="text-xs text-[var(--muted)] rounded-[var(--radius)] p-3 bg-[var(--sub)]">
              부가세는 기대 매출의 10%로 자동 계산됩니다. (한국 부가세율)
            </p>
            <div>
              <label className={labelClass}>택배비 기본값 (원)</label>
              <input
                type="number"
                className={inputClass}
                placeholder="5000"
                defaultValue={5000}
              />
            </div>
            <button className={btnPrimary}>저장</button>
          </div>
        </div>
      )}

      <Modal
        isOpen={rawMaterialModalOpen}
        onClose={closeRawMaterialModal}
        title={editRawMaterial ? "원물 수정" : "원물 추가"}
        footer={
          <>
            <button type="button" onClick={closeRawMaterialModal} className={btnSecondary}>
              취소
            </button>
            <button
              type="button"
              onClick={submitRawMaterial}
              disabled={!rawMaterialForm.name.trim() || submitting}
              className={`${btnPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submitting ? "저장 중..." : editRawMaterial ? "저장" : "추가"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>이름</label>
            <input
              type="text"
              className={inputClass}
              placeholder="예: 오리 장각"
              value={rawMaterialForm.name}
              onChange={(e) => setRawMaterialForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>단위</label>
            <input
              type="text"
              className={inputClass}
              placeholder="kg"
              value={rawMaterialForm.unit}
              onChange={(e) => setRawMaterialForm((prev) => ({ ...prev, unit: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>단가 (원/단위)</label>
            <input
              type="text"
              inputMode="numeric"
              className={inputClass}
              placeholder="6500"
              value={rawMaterialForm.pricePerUnit}
              onChange={(e) =>
                handleNumberField(e.target.value, (v) =>
                  setRawMaterialForm((prev) => ({ ...prev, pricePerUnit: v }))
                )
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={productModalOpen}
        onClose={closeProductModal}
        title={editProduct ? "생산제품 수정" : "생산제품 추가"}
        footer={
          <>
            <button type="button" onClick={closeProductModal} className={btnSecondary}>
              취소
            </button>
            <button
              type="button"
              onClick={submitProduct}
              disabled={!productForm.name.trim() || productSubmitting}
              className={`${btnPrimary} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {productSubmitting ? "저장 중..." : editProduct ? "저장" : "추가"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>연결 원물</label>
            <select
              className={inputClass}
              value={productForm.rawMaterialId}
              onChange={(e) => setProductForm((prev) => ({ ...prev, rawMaterialId: e.target.value }))}
            >
              <option value="">선택 안 함</option>
              {rawMaterials.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.unit}당 {r.pricePerUnit.toLocaleString()}원)
                </option>
              ))}
            </select>
            <p className="text-xs text-[var(--muted)] mt-1">
              수익률 계산 시 이 상품에 사용하는 원물을 선택하면 원가 단가가 자동으로 불러옵니다.
            </p>
          </div>
          <div>
            <label className={labelClass}>이름</label>
            <input
              type="text"
              className={inputClass}
              placeholder="예: 닭안심육포 80g"
              value={productForm.name}
              onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>단위</label>
            <input
              type="text"
              className={inputClass}
              placeholder="봉지"
              value={productForm.unit}
              onChange={(e) => setProductForm((prev) => ({ ...prev, unit: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>판매 단가 (원/단위)</label>
            <input
              type="text"
              inputMode="numeric"
              className={inputClass}
              placeholder="15000"
              value={productForm.sellingPricePerUnit}
              onChange={(e) =>
                handleNumberField(e.target.value, (v) =>
                  setProductForm((prev) => ({ ...prev, sellingPricePerUnit: v }))
                )
              }
            />
          </div>
          <div>
            <label className={labelClass}>포장비·잡비 (원/단위)</label>
            <input
              type="text"
              inputMode="numeric"
              className={inputClass}
              placeholder="1000"
              value={productForm.packagingCostPerUnit}
              onChange={(e) =>
                handleNumberField(e.target.value, (v) =>
                  setProductForm((prev) => ({ ...prev, packagingCostPerUnit: v }))
                )
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
