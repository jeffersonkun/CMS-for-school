import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchUsers } from "@/api/users"
import UserTable from "./components/UserTable"
import UserForm from "./components/UserForm"
import "./Users.scss"

const Users = () => {
  const [showAddUser, setShowAddUser] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })

  const handleAddUser = () => {
    setSelectedUser(null)
    setShowAddUser(true)
  }

  const handleEditUser = (userId: string) => {
    setSelectedUser(userId)
    setShowAddUser(true)
  }

  const handleCloseForm = () => {
    setShowAddUser(false)
    setSelectedUser(null)
  }

  const handleUserSaved = () => {
    refetch()
    handleCloseForm()
  }

  if (isLoading) {
    return <div className="loading">Загрузка данных...</div>
  }

  if (error) {
    return <div className="error">Ошибка загрузки данных</div>
  }

  return (
    <div className="users">
      <div className="users__header">
        <h1 className="users__title">Пользователи и роли</h1>
        <button
          className="users__add-button"
          onClick={handleAddUser}
        >
          Добавить пользователя
        </button>
      </div>

      <div className="users__content">
        {users && (
          <UserTable
            users={users}
            onEditUser={handleEditUser}
          />
        )}
      </div>

      {showAddUser && (
        <div className="users__modal">
          <div
            className="users__modal-backdrop"
            onClick={handleCloseForm}
          ></div>
          <div className="users__modal-content">
            <UserForm
              userId={selectedUser}
              onSave={handleUserSaved}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Users
