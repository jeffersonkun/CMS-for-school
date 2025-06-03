import { useState } from "react"
import { useForm } from "react-hook-form"
import { useStore } from "@/store"
import "./ProfileSettings.scss"

interface ProfileFormData {
  name: string
  email: string
  phone: string
  position: string
  bio: string
}

const ProfileSettings = () => {
  const { user } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "+7 (999) 123-45-67", // Mock data
      position: "Менеджер", // Mock data
      bio: "Менеджер по продажам с опытом работы более 5 лет.", // Mock data
    },
  })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Profile data saved:", data)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="profile-settings">
      <div className="profile-settings__header">
        <h2 className="profile-settings__title">Настройки профиля</h2>
        {!isEditing && (
          <button
            className="profile-settings__edit-button"
            onClick={handleEdit}
          >
            Редактировать
          </button>
        )}
      </div>

      <form
        className="profile-settings__form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="profile-settings__avatar">
          <div className="profile-settings__avatar-image">
            <div className="profile-settings__avatar-placeholder">
              {user?.name.charAt(0)}
            </div>
          </div>
          {isEditing && (
            <button
              type="button"
              className="profile-settings__avatar-button"
            >
              Изменить фото
            </button>
          )}
        </div>

        <div className="profile-settings__fields">
          <div className="profile-settings__field">
            <label className="profile-settings__label">Имя</label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  className={`profile-settings__input ${
                    errors.name ? "profile-settings__input--error" : ""
                  }`}
                  {...register("name", { required: "Имя обязательно" })}
                />
                {errors.name && (
                  <p className="profile-settings__error">
                    {errors.name.message}
                  </p>
                )}
              </>
            ) : (
              <p className="profile-settings__value">{user?.name}</p>
            )}
          </div>

          <div className="profile-settings__field">
            <label className="profile-settings__label">Email</label>
            {isEditing ? (
              <>
                <input
                  type="email"
                  className={`profile-settings__input ${
                    errors.email ? "profile-settings__input--error" : ""
                  }`}
                  {...register("email", {
                    required: "Email обязателен",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Некорректный email",
                    },
                  })}
                />
                {errors.email && (
                  <p className="profile-settings__error">
                    {errors.email.message}
                  </p>
                )}
              </>
            ) : (
              <p className="profile-settings__value">{user?.email}</p>
            )}
          </div>

          <div className="profile-settings__field">
            <label className="profile-settings__label">Телефон</label>
            {isEditing ? (
              <>
                <input
                  type="tel"
                  className={`profile-settings__input ${
                    errors.phone ? "profile-settings__input--error" : ""
                  }`}
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="profile-settings__error">
                    {errors.phone.message}
                  </p>
                )}
              </>
            ) : (
              <p className="profile-settings__value">+7 (999) 123-45-67</p>
            )}
          </div>

          <div className="profile-settings__field">
            <label className="profile-settings__label">Должность</label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  className={`profile-settings__input ${
                    errors.position ? "profile-settings__input--error" : ""
                  }`}
                  {...register("position")}
                />
                {errors.position && (
                  <p className="profile-settings__error">
                    {errors.position.message}
                  </p>
                )}
              </>
            ) : (
              <p className="profile-settings__value">Менеджер</p>
            )}
          </div>

          <div className="profile-settings__field">
            <label className="profile-settings__label">О себе</label>
            {isEditing ? (
              <>
                <textarea
                  className={`profile-settings__textarea ${
                    errors.bio ? "profile-settings__textarea--error" : ""
                  }`}
                  {...register("bio")}
                />
                {errors.bio && (
                  <p className="profile-settings__error">
                    {errors.bio.message}
                  </p>
                )}
              </>
            ) : (
              <p className="profile-settings__value">
                Менеджер по продажам с опытом работы более 5 лет.
              </p>
            )}
          </div>

          {isEditing && (
            <div className="profile-settings__actions">
              <button
                type="button"
                className="profile-settings__cancel-button"
                onClick={handleCancel}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="profile-settings__save-button"
                disabled={isSaving}
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProfileSettings
