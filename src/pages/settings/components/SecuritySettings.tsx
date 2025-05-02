import { useState } from "react"
import { useForm } from "react-hook-form"
import "./SecuritySettings.scss"

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const SecuritySettings = () => {
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm<PasswordFormData>()

  const onSubmit = async (data: PasswordFormData) => {
    setIsSaving(true)
    setSuccessMessage(null)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Password changed:", data)
      setSuccessMessage("Пароль успешно изменен")
      reset()
    } catch (error) {
      console.error("Error changing password:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="security-settings">
      <div className="security-settings__header">
        <h2 className="security-settings__title">Безопасность</h2>
      </div>

      <div className="security-settings__section">
        <h3 className="security-settings__section-title">Изменение пароля</h3>

        {successMessage && <div className="security-settings__success">{successMessage}</div>}

        <form className="security-settings__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="security-settings__field">
            <label className="security-settings__label">Текущий пароль</label>
            <input
              type="password"
              className={`security-settings__input ${
                errors.currentPassword ? "security-settings__input--error" : ""
              }`}
              {...register("currentPassword", { required: "Введите текущий пароль" })}
            />
            {errors.currentPassword && (
              <p className="security-settings__error">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="security-settings__field">
            <label className="security-settings__label">Новый пароль</label>
            <input
              type="password"
              className={`security-settings__input ${errors.newPassword ? "security-settings__input--error" : ""}`}
              {...register("newPassword", {
                required: "Введите новый пароль",
                minLength: {
                  value: 8,
                  message: "Пароль должен содержать минимум 8 символов",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Пароль должен содержать минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ",
                },
              })}
            />
            {errors.newPassword && <p className="security-settings__error">{errors.newPassword.message}</p>}
          </div>

          <div className="security-settings__field">
            <label className="security-settings__label">Подтверждение пароля</label>
            <input
              type="password"
              className={`security-settings__input ${
                errors.confirmPassword ? "security-settings__input--error" : ""
              }`}
              {...register("confirmPassword", {
                required: "Подтвердите новый пароль",
                validate: (value) => value === getValues("newPassword") || "Пароли не совпадают",
              })}
            />
            {errors.confirmPassword && (
              <p className="security-settings__error">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="security-settings__actions">
            <button type="submit" className="security-settings__submit" disabled={isSaving}>
              {isSaving ? "Сохранение..." : "Изменить пароль"}
            </button>
          </div>
        </form>
      </div>

      <div className="security-settings__section">
        <h3 className="security-settings__section-title">Двухфакторная аутентификация</h3>
        <div className="security-settings__two-factor">
          <div className="security-settings__two-factor-info">
            <p>
              Двухфакторная аутентификация добавляет дополнительный уровень безопасности к вашей учетной записи,
              требуя не только пароль, но и код из приложения аутентификации.
            </p>
          </div>
          <button className="security-settings__two-factor-button">Включить</button>
        </div>
      </div>

      <div className="security-settings__section">
        <h3 className="security-settings__section-title">Сеансы</h3>
        <div className="security-settings__sessions">
          <div className="security-settings__session">
            <div className="security-settings__session-info">
              <h4 className="security-settings__session-device">Windows 10 - Chrome</h4>
              <p className="security-settings__session-details">
                IP: 192.168.1.1 • Последняя активность: 15.04.2023 12:30
              </p>
            </div>
            <div className="security-settings__session-status">Текущий</div>
          </div>
          <div className="security-settings__session">
            <div className="security-settings__session-info">
              <h4 className="security-settings__session-device">iOS 15 - Safari</h4>
              <p className="security-settings__session-details">
                IP: 192.168.1.2 • Последняя активность: 14.04.2023 18:45
              </p>
            </div>
            <button className="security-settings__session-button">Завершить</button>
          </div>
        </div>
        <button className="security-settings__sessions-button">Завершить все другие сеансы</button>
      </div>
    </div>
  )
}

export default SecuritySettings
