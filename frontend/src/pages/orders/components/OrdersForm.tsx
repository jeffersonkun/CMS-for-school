import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Order, OrderItem } from "@/types/product.types";
import "./OrderForm.scss";

interface OrdersFormProps {
  orderId?: string;
  initialData?: Partial<Order>;
  onSave: (orderData: Partial<Order>) => void;
  onCancel: () => void;
}

const OrdersForm = ({
  orderId,
  initialData,
  onSave,
  onCancel,
}: OrdersFormProps) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<Order>>();

  useEffect(() => {
    if (initialData) {
      reset({
        customer: initialData.customer || { name: "", email: "", phone: "" },
        paymentMethod: initialData.paymentMethod || "",
        status: initialData.status || "pending",
      });
      setItems(initialData.items || []);
    }
  }, [initialData, reset]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substr(2, 9),
        productId: "",
        productName: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = <K extends keyof OrderItem>(
    index: number,
    field: K,
    value: OrderItem[K]
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const onSubmit = (data: Partial<Order>) => {
    setIsLoading(true);

    const orderData = {
      ...data,
      items,
      subtotal: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      discount: 0,
      shipping: 150, // Фиксированная стоимость доставки
      total:
        items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 150,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(orderData);
    setIsLoading(false);
  };

  const calculateTotal = () => {
    return (
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) + 150
    );
  };

  return (
    <div className="orders-form">
      <div className="orders-form__header">
        <h2 className="orders-form__title">
          {orderId ? "Редактировать заказ" : "Создать заказ"}
        </h2>
        <button
          className="orders-form__close"
          onClick={onCancel}
        >
          ✕
        </button>
      </div>

      {isLoading ? (
        <div className="orders-form__loading">Сохранение...</div>
      ) : (
        <form
          className="orders-form__form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="orders-form__section">
            <h3 className="orders-form__section-title">Информация о клиенте</h3>
            <div className="orders-form__row">
              <div className="orders-form__group">
                <label
                  htmlFor="customer.name"
                  className="orders-form__label"
                >
                  Имя клиента
                </label>
                <input
                  id="customer.name"
                  type="text"
                  className={`orders-form__input ${
                    errors.customer?.name ? "orders-form__input--error" : ""
                  }`}
                  placeholder="Введите имя"
                  {...register("customer.name", {
                    required: "Имя обязательно",
                  })}
                />
                {errors.customer?.name && (
                  <p className="orders-form__error">
                    {errors.customer.name.message}
                  </p>
                )}
              </div>

              <div className="orders-form__group">
                <label
                  htmlFor="customer.email"
                  className="orders-form__label"
                >
                  Email
                </label>
                <input
                  id="customer.email"
                  type="email"
                  className="orders-form__input"
                  placeholder="Введите email"
                  {...register("customer.email")}
                />
              </div>
            </div>

            <div className="orders-form__group">
              <label
                htmlFor="customer.phone"
                className="orders-form__label"
              >
                Телефон
              </label>
              <input
                id="customer.phone"
                type="tel"
                className="orders-form__input"
                placeholder="Введите телефон"
                {...register("customer.phone")}
              />
            </div>
          </div>

          <div className="orders-form__section">
            <h3 className="orders-form__section-title">Способ оплаты</h3>
            <select
              className="orders-form__select"
              {...register("paymentMethod", {
                required: "Выберите способ оплаты",
              })}
            >
              <option value="">Выберите способ оплаты</option>
              <option value="Наличные при получении">
                Наличные при получении
              </option>
              <option value="Банковская карта">Банковская карта</option>
              <option value="Онлайн оплата">Онлайн оплата</option>
            </select>
            {errors.paymentMethod && (
              <p className="orders-form__error">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          <div className="orders-form__section">
            <h3 className="orders-form__section-title">Статус заказа</h3>
            <select
              className="orders-form__select"
              {...register("status")}
            >
              <option value="pending">Ожидает</option>
              <option value="paid">Оплачен</option>
              <option value="shipped">Отправлен</option>
              <option value="delivered">Доставлен</option>
              <option value="cancelled">Отменен</option>
            </select>
          </div>

          <div className="orders-form__section">
            <div className="orders-form__section-header">
              <h3 className="orders-form__section-title">Товары</h3>
              <button
                type="button"
                className="orders-form__add-button"
                onClick={addItem}
              >
                Добавить товар
              </button>
            </div>

            <div className="orders-form__items">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="orders-form__item"
                >
                  <div className="orders-form__row">
                    <div className="orders-form__group">
                      <label className="orders-form__label">Название</label>
                      <input
                        type="text"
                        className="orders-form__input"
                        value={item.productName}
                        onChange={(e) =>
                          updateItem(index, "productName", e.target.value)
                        }
                        placeholder="Название товара"
                      />
                    </div>

                    <div className="orders-form__group">
                      <label className="orders-form__label">Цена</label>
                      <input
                        type="number"
                        className="orders-form__input"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(index, "price", Number(e.target.value))
                        }
                        placeholder="Цена"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="orders-form__row">
                    <div className="orders-form__group">
                      <label className="orders-form__label">Количество</label>
                      <input
                        type="number"
                        className="orders-form__input"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", Number(e.target.value))
                        }
                        placeholder="Количество"
                        min="1"
                      />
                    </div>

                    <div className="orders-form__group">
                      <label className="orders-form__label">Сумма</label>
                      <div className="orders-form__input">
                        {item.price * item.quantity} ₽
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="orders-form__remove-button"
                    onClick={() => removeItem(index)}
                  >
                    Удалить товар
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="orders-form__section">
            <h3 className="orders-form__section-title">Итого</h3>
            <div className="orders-form__summary">
              <div className="orders-form__summary-row">
                <span>Товары:</span>
                <span>
                  {items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  )}{" "}
                  ₽
                </span>
              </div>
              <div className="orders-form__summary-row">
                <span>Доставка:</span>
                <span>150 ₽</span>
              </div>
              <div className="orders-form__summary-row orders-form__summary-total">
                <span>Итого:</span>
                <span>{calculateTotal()} ₽</span>
              </div>
            </div>
          </div>

          <div className="orders-form__actions">
            <button
              type="button"
              className="orders-form__cancel"
              onClick={onCancel}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="orders-form__submit"
            >
              {orderId ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default OrdersForm;
