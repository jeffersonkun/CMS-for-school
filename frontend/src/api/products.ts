import type { Product } from "@/types/product.types"

// Mock API functions for products
export const fetchProducts = async (): Promise<Product[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          name: "Молоко 3.2%",
          description: "Пастеризованное молоко 3.2% жирности",
          sku: "MLK-001",
          price: 89.9,
          stock: 42,
          category: "Молочные продукты",
          attributes: {
            brand: "Домик в деревне",
            volume: "1 л",
          },
          images: ["/placeholder.svg"],
          createdAt: "2023-04-01T10:00:00Z",
          updatedAt: "2023-04-15T14:30:00Z",
        },
        {
          id: "2",
          name: "Хлеб белый",
          description: "Свежий белый хлеб",
          sku: "BRD-001",
          price: 45.5,
          stock: 28,
          category: "Хлебобулочные изделия",
          attributes: {
            brand: "Хлебозавод №1",
            weight: "400 г",
          },
          images: ["/placeholder.svg"],
          createdAt: "2023-04-02T09:15:00Z",
          updatedAt: "2023-04-15T11:20:00Z",
        },
        {
          id: "3",
          name: "Яблоки Голден",
          description: "Свежие яблоки сорта Голден",
          sku: "APL-001",
          price: 149.9,
          stock: 15,
          category: "Фрукты",
          attributes: {
            origin: "Россия",
            weight: "1 кг",
          },
          images: ["/placeholder.svg"],
          createdAt: "2023-04-03T11:30:00Z",
          updatedAt: "2023-04-14T16:45:00Z",
        },
        {
          id: "4",
          name: "Сыр Российский",
          description: "Сыр Российский 45% жирности",
          sku: "CHS-001",
          price: 259.9,
          stock: 8,
          category: "Молочные продукты",
          attributes: {
            brand: "Сыроварня",
            weight: "300 г",
          },
          images: ["/placeholder.svg"],
          createdAt: "2023-04-04T14:20:00Z",
          updatedAt: "2023-04-15T09:10:00Z",
        },
        {
          id: "5",
          name: "Колбаса Докторская",
          description: "Колбаса Докторская вареная",
          sku: "SSG-001",
          price: 319.9,
          stock: 12,
          category: "Мясные продукты",
          attributes: {
            brand: "Мясокомбинат",
            weight: "500 г",
          },
          images: ["/placeholder.svg"],
          createdAt: "2023-04-05T10:45:00Z",
          updatedAt: "2023-04-15T13:25:00Z",
        },
      ])
    }, 1000)
  })
}

export const getProductById = async (productId: string): Promise<Product> => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = [
        {
          id: "1",
          name: "Молоко 3.2%",
          description: "Пастеризованное молоко 3.2% жирности",
          sku: "MLK-001",
          price: 89.9,
          stock: 42,
          category: "Молочные продукты",
          attributes: {
            brand: "Домик в деревне",
            volume: "1 л",
          },
          images: ["/placeholder.svg"],
          createdAt: "2023-04-01T10:00:00Z",
          updatedAt: "2023-04-15T14:30:00Z",
        },
        {
          id: "2",
          name: "Хлеб белый",
          description: "Свежий белый хлеб",
          sku: "BRD-001",
          price: 45.5,
          stock: 28,
          category: "Хлебобулочные изделия",
          attributes: {
            brand: "Хлебозавод №1",
            weight: "400 г",
          },
          images: ["/placeholder.svg"],
          createdAt: "2023-04-02T09:15:00Z",
          updatedAt: "2023-04-15T11:20:00Z",
        },
        {
          id: "3",
          name: "Яблоки Голден",
          description: "Свежие яблоки сорта Голден",
          sku: "APL-001",
          price: 149.9,
          stock: 15,
          category: "Фрукты",
          attributes: {
            origin: "Россия",
            weight: "1 кг",
          },
          images: ["/placeholder.svg"],
          createdAt: "2023-04-03T11:30:00Z",
          updatedAt: "2023-04-14T16:45:00Z",
        },
        {
          id: "4",
          name: "Сыр Российский",
          description: "Сыр Российский 45% жирности",
          sku: "CHS-001",
          price: 259.9,
          stock: 8,
          category: "Молочные продукты",
          attributes: {
            brand: "Сыроварня",
            weight: "300 г",
          },
          images: ["/placeholder.svg"],
          createdAt: "2023-04-04T14:20:00Z",
          updatedAt: "2023-04-15T09:10:00Z",
        },
        {
          id: "5",
          name: "Колбаса Докторская",
          description: "Колбаса Докторская вареная",
          sku: "SSG-001",
          price: 319.9,
          stock: 12,
          category: "Мясные продукты",
          attributes: {
            brand: "Мясокомбинат",
            weight: "500 г",
          },
          images: ["/placeholder.svg"],
          createdAt: "2023-04-05T10:45:00Z",
          updatedAt: "2023-04-15T13:25:00Z",
        },
      ]

      const product = products.find((p) => p.id === productId)
      if (product) {
        resolve(product as Product)
      } else {
        reject(new Error("Product not found"))
      }
    }, 1000)
  })
}

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        ...productData,
        images: productData.images || ["/placeholder.svg"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Product)
    }, 1000)
  })
}

export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<Product> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: productId,
        ...productData,
        updatedAt: new Date().toISOString(),
      } as Product)
    }, 1000)
  })
}
