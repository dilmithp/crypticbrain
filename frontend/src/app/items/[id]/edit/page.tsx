"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ItemForm } from "@/components/ItemForm";
import { fetchApi } from "@/lib/api";
import { Item, ApiResponse } from "@/types/item";
import { use } from "react";

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const res = await fetchApi<ApiResponse<Item>>(`/api/items/${id}`);
        setItem(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to load item");
      } finally {
        setIsLoading(false);
      }
    };
    loadItem();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Item</h1>
      {item && <ItemForm initialData={item} isEdit={true} />}
    </div>
  );
}
