"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useStore } from "@/store"
import "./Login.scss"

interface LoginFormData {
  email: string
  password: string
}

const Login = () => {
  const navigate = useNavigate()
  const { login } = useStore()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      navigate("/")
    } catch (err) {
      setError("Неверный email или пароль");
      console.error(err);
    }
  }

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__header">
          <h1 className="login__title">Контора</h1>
          <p className="login__subtitle">Жизнь Март</p>
        </div>

        <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="login__form-title">Вход в систему</h2>

          {error && <div className="login__error">{error}</div>}

          <div className="login__form-group">
            <label htmlFor="email" className="login__label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`login__input ${errors.email ? "login__input--error" : ""}`}
              placeholder="Введите email"
              {...register("email", {
                required: "Email обязателен",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Некорректный email",
                },
              })}
            />
            {errors.email && <p className="login__error-text">{errors.email.message}</p>}
          </div>

          <div className="login__form-group">
            <label htmlFor="password" className="login__label">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              className={`login__input ${errors.password ? "login__input--error" : ""}`}
              placeholder="Введите пароль"
              {...register("password", {
                required: "Пароль обязателен",
                minLength: {
                  value: 6,
                  message: "Пароль должен содержать минимум 6 символов",
                },
              })}
            />
            {errors.password && <p className="login__error-text">{errors.password.message}</p>}
          </div>

          <button type="submit" className="login__button">
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login