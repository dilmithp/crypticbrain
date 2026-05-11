import { ItemForm } from "@/components/ItemForm";

export default function NewItemPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Item</h1>
      <ItemForm />
    </div>
  );
}
