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

export type RawMaterial = {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy?: string;
};

export type RawMaterialInput = {
  name: string;
  unit: string;
  pricePerUnit: number;
};

const COLLECTION = "rawMaterials";

export async function getRawMaterials(): Promise<RawMaterial[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  const list = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name ?? "",
      unit: data.unit ?? "kg",
      pricePerUnit: Number(data.pricePerUnit) ?? 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
    };
  });
  list.sort((a, b) => a.name.localeCompare(b.name, "ko"));
  return list;
}

export async function addRawMaterial(
  input: RawMaterialInput,
  createdBy: string
): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    name: input.name.trim(),
    unit: input.unit.trim() || "kg",
    pricePerUnit: input.pricePerUnit,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy,
  });
  return ref.id;
}

export async function updateRawMaterial(
  id: string,
  input: RawMaterialInput
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    name: input.name.trim(),
    unit: input.unit.trim() || "kg",
    pricePerUnit: input.pricePerUnit,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteRawMaterial(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
