"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { ItemRequest, Item } from "../types/item";
import { fetchApi } from "../lib/api";

interface ItemFormProps {
  initialData?: Item;
  isEdit?: boolean;
}

export const ItemForm: React.FC<ItemFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemRequest>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (data: ItemRequest) => {
    try {
      setError(null);
      if (isEdit && initialData) {
        await fetchApi(`/api/items/${initialData.id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
      } else {
        await fetchApi("/api/items", {
          method: "POST",
          body: JSON.stringify(data),
        });
      }
      router.push("/items");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <Input
        label="Name"
        {...register("name", { required: "Name is required" })}
        error={errors.name?.message}
        placeholder="Enter name"
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter description"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={() => router.push("/items")}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isEdit ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};
