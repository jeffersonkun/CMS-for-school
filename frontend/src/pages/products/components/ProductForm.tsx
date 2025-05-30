import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { getProductById, createProduct, updateProduct } from "@/api/products"
import "./ProductForm.scss"

interface ProductFormProps {
  productId: string | null
  onSave: () => void
  onCancel: () => void
}

interface ProductFormData {
  name: string
  sku: string
  description: string
  price: number
  stock: number
  category: string
  attributes: {
    key: string
    value: string
  }[]
}

const ProductForm = ({ productId, onSave, onCancel }: ProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>()

  useEffect(() => {
    const loadProduct = async () => {
      if (productId) {
        setIsLoading(true)
        try {
          const product = await getProductById(productId)
          reset({
            name: product.name,
            sku: product.sku,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
          })
          
          // Convert attributes object to array of key-value pairs
          const attributesArray = Object.entries(product.attributes).map(([key, value]) => ({
            key,
            value: value as string,
          }))
          setAttributes(attributesArray)
        } catch (error) {
          console.error("Error loading product:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadProduct()
  }, [productId, reset])

  const addAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }])
  }

  const removeAttribute = (index: number) => {
    const newAttributes = [...attributes]
    newAttributes.splice(index, 1)
    setAttributes(newAttributes)
  }

  const handleAttributeChange = (index: number, field: "key" | "value", value: string) => {
    const newAttributes = [...attributes]
    newAttributes[index][field] = value
    setAttributes(newAttributes)
  }

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    try {
      // Convert attributes array to object
      const attributesObject = attributes.reduce((acc, { key, value }) => {
        if (key.trim()) {
          acc[key] = value
        }
        return acc
      }, {} as Record<string, string>)

      const productData = {
        ...data,
        attributes: attributesObject,
      }

      if (productId) {
        await updateProduct(productId, productData)
      } else {
        await createProduct(productData)
      }
      onSave()
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="product-form">
      <div className="product-form__header">
        <h2 className="product-form__title">{productId ? "Редактировать товар" : "Добавить товар"}</h2>
        <button className="product-form__close" onClick={onCancel}>
          ✕
        </button>
      </div>

      {isLoading ? (
        <div className="product-form__loading">Загрузка...</div>
      ) : (
        <form className="product-form__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="product-form__row">
            <div className="product-form__group">
              <label htmlFor="name" className="product-form__label">
                Название
              </label>
              <input
                id="name"
                type="text"
                className={`product-form__input ${errors.name ? "product-form__input--error" : ""}`}
                placeholder="Введите название"
                {...register("name", { required: "Название обязательно" })}
              />
              {errors.name && <p className="product-form__error">{errors.name.message}</p>}
            </div>

            <div className="product-form__group">
              <label htmlFor="sku" className="product-form__label">
                SKU
              </label>
              <input
                id="sku"
                type="text"
                className={`product-form__input ${errors.sku ? "product-form__input--error" : ""}`}
                placeholder="Введите SKU"
                {...register("sku", { required: "SKU обязателен" })}
              />
              {errors.sku && <p className="product-form__error">{errors.sku.message}</p>}
            </div>
          </div>

          <div className="product-form__group">
            <label htmlFor="description" className="product-form__label">
              Описание
            </label>
            <textarea
              id="description"
              className={`product-form__textarea ${errors.description ? "product-form__textarea--error" : ""}`}
              placeholder="Введите описание"
              {...register("description")}
            />
          </div>

          <div className="product-form__row">
            <div className="product-form__group">
              <label htmlFor="price" className="product-form__label">
                Цена
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                className={`product-form__input ${errors.price ? "product-form__input--error" : ""}`}
                placeholder="Введите цену"
                {...register("price", {
                  required: "Цена обязательна",
                  min: { value: 0, message: "Цена должна быть положительной" },
                })}
              />
              {errors.price && <p className="product-form__error">{errors.price.message}</p>}
            </div>

            <div className="product-form__group">
              <label htmlFor="stock" className="product-form__label">
                Остаток
              </label>
              <input
                id="stock"
                type="number"
                className={`product-form__input ${errors.stock ? "product-form__input--error" : ""}`}
                placeholder="Введите остаток"
                {...register("stock", {
                  required: "Остаток обязателен",
                  min: { value: 0, message: "Остаток не может быть отрицательным" },
                })}
              />
              {errors.stock && <p className="product-form__error">{errors.stock.message}</p>}
            </div>
          </div>

          <div className="product-form__group">
            <label htmlFor="category" className="product-form__label">
              Категория
            </label>
            <input
              id="category"
              type="text"
              className={`product-form__input ${errors.category ? "product-form__input--error" : ""}`}
              placeholder="Введите категорию"
              {...register("category", { required: "Категория обязательна" })}
            />
            {errors.category && <p className="product-form__error">{errors.category.message}</p>}
          </div>

          <div className="product-form__attributes">
            <div className="product-form__attributes-header">
              <h3 className="product-form__attributes-title">Атрибуты</h3>
              <button type="button" className="product-form__add-attribute" onClick={addAttribute}>
                Добавить атрибут
              </button>
            </div>

            {attributes.map((attribute, index) => (
              <div key={index} className="product-form__attribute">
                <div className="product-form__attribute-inputs">
                  <input
                    type="text"
                    className="product-form__input"
                    placeholder="Ключ"
                    value={attribute.key}
                    onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                  />
                  <input
                    type="text"
                    className="product-form__input"
                    placeholder="Значение"
                    value={attribute.value}
                    onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="product-form__remove-attribute"
                  onClick={() => removeAttribute(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="product-form__actions">
            <button type="button" className="product-form__cancel" onClick={onCancel}>
              Отмена
            </button>
            <button type="submit" className="product-form__submit">
              {productId ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ProductForm
