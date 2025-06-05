import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrders,
  deleteOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
} from "@/api/orders";
import OrderTable from "./components/OrderTable";
import OrderDetails from "./components/OrderDetails";
import OrdersForm from "./components/OrdersForm";
import { Order } from "@/types/product.types";
import "./Orders.scss";

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<string | undefined>(undefined);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setShowCreateForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setEditingOrder(undefined);
    },
  });

  const handleViewOrder = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const handleEditOrder = (orderId: string) => {
    setEditingOrder(orderId);
  };

  const handleCreateOrder = () => {
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingOrder(undefined);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот заказ?")) {
      deleteMutation.mutate(orderId);
    }
  };

  const handleSaveOrder = (orderData: Partial<Order>) => {
    if (editingOrder) {
      updateMutation.mutate({ ...orderData, id: editingOrder });
    } else {
      createMutation.mutate(orderData);
    }
  };

  const filteredOrders = orders
    ? orders.filter((order) => {
        const matchesStatus =
          statusFilter === "" || order.status === statusFilter;
        const matchesSearch =
          searchTerm === "" ||
          order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
      })
    : [];

  if (isLoading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="error">Ошибка загрузки данных</div>;
  }

  return (
    <div className="orders">
      <div className="orders__header">
        <h1 className="orders__title">Заказы</h1>
        <button
          className="orders__add-button"
          onClick={handleCreateOrder}
        >
          Создать заказ
        </button>
      </div>

      <div className="orders__filters">
        <div className="orders__search">
          <input
            type="text"
            placeholder="Поиск по номеру или клиенту..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="orders__search-input"
          />
        </div>

        <div className="orders__filter">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="orders__filter-select"
          >
            <option value="">Все статусы</option>
            <option value="pending">Ожидает</option>
            <option value="paid">Оплачен</option>
            <option value="shipped">Отправлен</option>
            <option value="delivered">Доставлен</option>
            <option value="cancelled">Отменен</option>
          </select>
        </div>
      </div>

      <div className="orders__content">
        <OrderTable
          orders={filteredOrders}
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
        />
      </div>

      {selectedOrder && (
        <div className="orders__modal">
          <div
            className="orders__modal-backdrop"
            onClick={handleCloseDetails}
          ></div>
          <div className="orders__modal-content">
            <OrderDetails
              orderId={selectedOrder}
              onClose={handleCloseDetails}
              onStatusChange={(id, status) => updateOrderStatus(id, status)}
            />
          </div>
        </div>
      )}

      {(showCreateForm || editingOrder) && (
        <div className="orders__modal">
          <div
            className="orders__modal-backdrop"
            onClick={handleCloseForm}
          ></div>
          <div className="orders__modal-content">
            <OrdersForm
              orderId={editingOrder}
              initialData={
                editingOrder
                  ? orders?.find((o) => o.id === editingOrder)
                  : undefined
              }
              onSave={handleSaveOrder}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
