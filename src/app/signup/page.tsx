"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { MyIcon } from "@/components/icons/MyIcon";
import styles from "../signin/SignIn.module.scss";

type TFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    setError: setFormError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TFormData>({ mode: "onChange" });

  const { data: session } = useSession();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);

  const password = watch("password");

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [session, router]);

  const onSignUpSubmit = async (data: TFormData) => {
    setIsRegistering(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setFormError("root", {
          type: "manual",
          message: result.error || "Registration failed",
        });
        setIsRegistering(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setFormError("root", {
          type: "manual",
          message: "Registration successful, but login failed. Please sign in manually.",
        });
        setIsRegistering(false);
        // Перенаправлення на signin через 2 секунди
        setTimeout(() => router.push("/signin"), 2000);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
      setFormError("root", {
        type: "manual",
        message: "Something went wrong. Please try again.",
      });
      setIsRegistering(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <section className={styles.root} aria-labelledby="signup-title">
      <div className={styles.container}>
        <h1 className="visually-hidden" id="signup-title">
          Sign Up Page
        </h1>
        <div className={styles.inner}>
          <div>logo</div>
          <div>
            <p className={styles.subtitle}>
              Create your account to get started. You can also sign up using your Google account for
              quick access.
            </p>
          </div>

          {errors.root && (
            <div className={styles.errorBanner} role="alert">
              <MyIcon name="warningIcon" size={16} color="red" />
              {errors.root.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSignUpSubmit)} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <div className={`${styles.inputWrapper} ${errors.name ? styles.error : ""}`}>
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  type="text"
                  id="name"
                  className={styles.input}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby="name-error"
                  autoComplete="name"
                  placeholder="Your name"
                />
              </div>
              {errors.name && (
                <span id="name-error" className={styles.errorMessage} role="alert">
                  <MyIcon
                    name="warningIcon"
                    size={16}
                    className={errors.name ? styles.warningIcon : ""}
                  />
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <div className={`${styles.inputWrapper} ${errors.email ? styles.error : ""}`}>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  id="email"
                  className={styles.input}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby="email-error"
                  autoComplete="email"
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && (
                <span id="email-error" className={styles.errorMessage} role="alert">
                  <MyIcon
                    name="warningIcon"
                    size={16}
                    className={errors.email ? styles.warningIcon : ""}
                  />
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={`${styles.inputWrapper} ${errors.password ? styles.error : ""}`}>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    validate: {
                      hasNumber: (value) => /[0-9]/.test(value) || "Must contain a number",
                      hasLetter: (value) => /[a-zA-Z]/.test(value) || "Must contain a letter",
                    },
                  })}
                  type="password"
                  id="password"
                  className={styles.input}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby="password-error"
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <span id="password-error" className={styles.errorMessage} role="alert">
                  <MyIcon
                    name="warningIcon"
                    size={16}
                    color="red"
                    className={errors.password ? styles.warningIcon : ""}
                  />
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <div
                className={`${styles.inputWrapper} ${errors.confirmPassword ? styles.error : ""}`}
              >
                <input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                  type="password"
                  id="confirmPassword"
                  className={styles.input}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby="confirmPassword-error"
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <span id="confirmPassword-error" className={styles.errorMessage} role="alert">
                  <MyIcon
                    name="warningIcon"
                    size={16}
                    color="red"
                    className={errors.confirmPassword ? styles.warningIcon : ""}
                  />
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <button
              className={styles.submitBtn}
              type="submit"
              disabled={isSubmitting || isRegistering}
              aria-busy={isSubmitting || isRegistering}
            >
              {isSubmitting || isRegistering ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <span>OR</span>

          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isRegistering}
          >
            <MyIcon name="google" size={24} color="white" />
            Sign up with Google
          </button>

          <p className={styles.footerText}>
            Already have an account?{" "}
            <Link href="/signin" className={styles.link}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
