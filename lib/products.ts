import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type Product = {
  id: string;
  name: string;
  unit: string;
  sellingPricePerUnit: number;
  packagingCostPerUnit: number;
  rawMaterialId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy?: string;
};

export type ProductInput = {
  name: string;
  unit: string;
  sellingPricePerUnit: number;
  packagingCostPerUnit: number;
  rawMaterialId?: string;
};

const COLLECTION = "products";

export async function getProducts(): Promise<Product[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  const list = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name ?? "",
      unit: data.unit ?? "봉지",
      sellingPricePerUnit: Number(data.sellingPricePerUnit) ?? 0,
      packagingCostPerUnit: Number(data.packagingCostPerUnit) ?? 0,
      rawMaterialId: data.rawMaterialId ?? undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
    };
  });
  list.sort((a, b) => a.name.localeCompare(b.name, "ko"));
  return list;
}

export async function addProduct(
  input: ProductInput,
  createdBy: string
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    name: input.name.trim(),
    unit: input.unit.trim() || "봉지",
    sellingPricePerUnit: input.sellingPricePerUnit,
    packagingCostPerUnit: input.packagingCostPerUnit,
    rawMaterialId: input.rawMaterialId?.trim() || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy,
  });
  return ref.id;
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    name: input.name.trim(),
    unit: input.unit.trim() || "봉지",
    sellingPricePerUnit: input.sellingPricePerUnit,
    packagingCostPerUnit: input.packagingCostPerUnit,
    rawMaterialId: input.rawMaterialId?.trim() || null,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
