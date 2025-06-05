import { useState } from "react";
import ProductTable from "./components/ProductTable";
import ProductForm from "./components/ProductForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, deleteProduct } from "@/api/products";
import "./Products.scss";

const Products = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const queryClient = useQueryClient();

  // Загрузка списка продуктов
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Мутация удаления продукта
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      console.error("Ошибка при удалении товара:", err);
    },
  });

  // Открыть форму для добавления
  const handleAddProduct = () => {
    setSelectedProductId(null);
    setShowForm(true);
  };

  // Открыть форму для редактирования
  const handleEditProduct = (productId: string) => {
    setSelectedProductId(productId);
    setShowForm(true);
  };

  // Закрыть форму
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProductId(null);
  };

  // Обновить список и закрыть форму после сохранения
  const handleProductSaved = () => {
    refetch();
    handleCloseForm();
  };

  // Удаление продукта с подтверждением
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
      deleteMutation.mutate(productId);
    }
  };

  // Фильтрация продуктов по поиску и категории
  const filteredProducts = products
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (categoryFilter === "" || product.category === categoryFilter)
      )
    : [];

  // Уникальные категории для фильтра
  const categories = products
    ? Array.from(new Set(products.map((p) => p.category))).sort()
    : [];

  if (isLoading) return <div className="loading">Загрузка данных...</div>;
  if (error) return <div className="error">Ошибка загрузки данных</div>;

  return (
    <div className="products">
      <div className="products__header">
        <h1 className="products__title">Каталог товаров</h1>
        <button
          className="products__add-button"
          onClick={handleAddProduct}
        >
          Добавить товар
        </button>
      </div>

      <div className="products__filters">
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="products__search-input"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="products__category-select"
        >
          <option value="">Все категории</option>
          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="products__content">
        <ProductTable
          products={filteredProducts}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      </div>

      {showForm && (
        <div className="products__modal">
          <div
            className="products__modal-backdrop"
            onClick={handleCloseForm}
          ></div>
          <div className="products__modal-content">
            <ProductForm
              productId={selectedProductId}
              onSave={handleProductSaved}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
