import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { getUserById, createUser, updateUser } from "@/api/users"
import "./UserForm.scss"

interface UserFormProps {
  userId: string | null
  onSave: () => void
  onCancel: () => void
}

interface UserFormData {
  name: string
  email: string
  role: string
  password: string
  status: string
}

const UserForm = ({ userId, onSave, onCancel }: UserFormProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>()

  useEffect(() => {
    const loadUser = async () => {
      if (userId) {
        setIsLoading(true)
        try {
          const user = await getUserById(userId)
          reset({
            name: user.name,
            email: user.email,
            role: user.role,
            password: "",
            status: user.status,
          })
        } catch (error) {
          console.error("Error loading user:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadUser()
  }, [userId, reset])

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true)
    try {
      if (userId) {
        await updateUser(userId, data)
      } else {
        await createUser(data)
      }
      onSave()
    } catch (error) {
      console.error("Error saving user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="user-form">
      <div className="user-form__header">
        <h2 className="user-form__title">{userId ? "Редактировать пользователя" : "Добавить пользователя"}</h2>
        <button className="user-form__close" onClick={onCancel}>
          ✕
        </button>
      </div>

      {isLoading ? (
        <div className="user-form__loading">Загрузка...</div>
      ) : (
        <form className="user-form__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="user-form__group">
            <label htmlFor="name" className="user-form__label">
              Имя
            </label>
            <input
              id="name"
              type="text"
              className={`user-form__input ${errors.name ? "user-form__input--error" : ""}`}
              placeholder="Введите имя"
              {...register("name", { required: "Имя обязательно" })}
            />
            {errors.name && <p className="user-form__error">{errors.name.message}</p>}
          </div>

          <div className="user-form__group">
            <label htmlFor="email" className="user-form__label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`user-form__input ${errors.email ? "user-form__input--error" : ""}`}
              placeholder="Введите email"
              {...register("email", {
                required: "Email обязателен",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Некорректный email",
                },
              })}
            />
            {errors.email && <p className="user-form__error">{errors.email.message}</p>}
          </div>

          <div className="user-form__group">
            <label htmlFor="role" className="user-form__label">
              Роль
            </label>
            <select
              id="role"
              className={`user-form__select ${errors.role ? "user-form__select--error" : ""}`}
              {...register("role", { required: "Роль обязательна" })}
            >
              <option value="">Выберите роль</option>
              <option value="admin">Администратор</option>
              <option value="manager">Менеджер</option>
              <option value="analyst">Аналитик</option>
              <option value="warehouse">Склад</option>
            </select>
            {errors.role && <p className="user-form__error">{errors.role.message}</p>}
          </div>

          <div className="user-form__group">
            <label htmlFor="password" className="user-form__label">
              Пароль {userId && "(оставьте пустым, чтобы не менять)"}
            </label>
            <input
              id="password"
              type="password"
              className={`user-form__input ${errors.password ? "user-form__input--error" : ""}`}
              placeholder="Введите пароль"
              {...register("password", {
                required: userId ? false : "Пароль обязателен",
                minLength: {
                  value: 6,
                  message: "Пароль должен содержать минимум 6 символов",
                },
              })}
            />
            {errors.password && <p className="user-form__error">{errors.password.message}</p>}
          </div>

          {userId && (
            <div className="user-form__group">
              <label htmlFor="status" className="user-form__label">
                Статус
              </label>
              <select
                id="status"
                className={`user-form__select ${errors.status ? "user-form__select--error" : ""}`}
                {...register("status", { required: "Статус обязателен" })}
              >
                <option value="active">Активен</option>
                <option value="inactive">Неактивен</option>
                <option value="blocked">Заблокирован</option>
              </select>
              {errors.status && <p className="user-form__error">{errors.status.message}</p>}
            </div>
          )}

          <div className="user-form__actions">
            <button type="button" className="user-form__cancel" onClick={onCancel}>
              Отмена
            </button>
            <button type="submit" className="user-form__submit">
              {userId ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default UserForm
