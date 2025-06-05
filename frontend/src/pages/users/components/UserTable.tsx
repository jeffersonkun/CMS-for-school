import "./UserTable.scss";
import { User } from "@/types/product.types";

interface UserTableProps {
  users: User[];
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onBlockUser: (userId: string) => void;
}

const UserTable = ({
  users,
  onEditUser,
  onDeleteUser,
  onBlockUser,
}: UserTableProps) => {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "manager":
        return "Менеджер";
      case "analyst":
        return "Аналитик";
      case "warehouse":
        return "Склад";
      default:
        return role;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      case "blocked":
        return "status-blocked";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Активен";
      case "inactive":
        return "Неактивен";
      case "blocked":
        return "Заблокирован";
      default:
        return status;
    }
  };

  return (
    <div className="user-table">
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Статус</th>
            <th>Последняя активность</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{getRoleLabel(user.role)}</td>
              <td>
                <span
                  className={`user-table__status ${getStatusClass(
                    user.status
                  )}`}
                >
                  {getStatusLabel(user.status)}
                </span>
              </td>
              <td>{user.lastActive}</td>
              <td>
                <div className="user-table__actions">
                  <button
                    className="user-table__action-btn"
                    onClick={() => onEditUser(user.id)}
                    disabled={user.status === "blocked"}
                    title={
                      user.status === "blocked"
                        ? "Пользователь заблокирован"
                        : "Редактировать"
                    }
                  >
                    ✏️
                  </button>
                  <button
                    className="user-table__action-btn"
                    onClick={() => onBlockUser(user.id)}
                    disabled={user.status === "blocked"}
                    title="Заблокировать"
                  >
                    🔒
                  </button>
                  <button
                    className="user-table__action-btn"
                    onClick={() => onDeleteUser(user.id)}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
