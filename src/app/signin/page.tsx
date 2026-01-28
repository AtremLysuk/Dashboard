// "use client";
//
// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import React, { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import styles from "./SignIn.module.scss";
// import { MyIcon } from "@/components/icons/MyIcon";
//
// type TFormData = {
//   email: string;
//   password: string;
// };
//
// export default function SignInPage() {
//   const {
//     register,
//     handleSubmit,
//     setError: setFormError,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<TFormData>({ mode: "onChange" });
//
//   const { data: session } = useSession();
//   const router = useRouter();
//
//   useEffect(() => {
//     if (session) {
//       router.push("/dashboard");
//       router.refresh();
//     }
//   }, [session, router]);
//
//   const onSignInSubmit = async (data: TFormData) => {
//     try {
//       const result = await signIn("credentials", {
//         email: data.email,
//         password: data.password,
//         redirect: false,
//       });
//
//       if (result?.error) {
//         setFormError("root", {
//           type: "manual",
//           message: "Invalid email or password",
//         });
//       } else {
//         router.push("/dashboard");
//         router.refresh();
//       }
//     } catch (error) {
//       setFormError("root", {
//         type: "manual",
//         message: "Something went wrong",
//       });
//     }
//   };
//
//   const handleGoogleSignIn = () => {
//     signIn("google", { callbackUrl: "/dashboard" });
//   };
//
//   return (
//     <section className={styles.root} aria-labelledby="signin-title">
//       <div className={styles.container}>
//         <h1 className="visually-hidden" id="signin-title">
//           Sign in Page
//         </h1>
//         <div className={styles.inner}>
//           <div>logo</div>
//           <div>
//             <p className={styles.subtitle}>
//               Use the details provided you by your account administator. Next time you will only
//               need the username and the password
//             </p>
//           </div>
//           <form onSubmit={handleSubmit(onSignInSubmit)} className={styles.form}>
//             <div className={styles.formGroup}>
//               <label htmlFor="email" className={styles.label}>
//                 Email
//               </label>
//               <div className={`${styles.inputWrapper} ${errors.email ? styles.error : ""}`}>
//                 <input
//                   {...register("email", {
//                     required: "Email is required",
//                     pattern: {
//                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                       message: "Invalid email address",
//                     },
//                   })}
//                   type="email"
//                   id="email"
//                   className={styles.input}
//                   aria-invalid={errors.email ? "true" : "false"}
//                   aria-describedby="email-error"
//                   autoComplete="email"
//                   placeholder="admin@123.com"
//                 />
//               </div>
//               {errors.email && (
//                 <span id="email-error" className={styles.errorMessage} role="alert">
//                   <MyIcon
//                     name="warningIcon"
//                     size={16}
//                     className={errors.password ? styles.warningIcon : ""}
//                   />
//                   {errors.email.message}
//                 </span>
//               )}
//             </div>
//             <div className={styles.formGroup}>
//               <label htmlFor="password" className={styles.label}>
//                 Password
//               </label>
//               <div className={`${styles.inputWrapper} ${errors.password ? styles.error : ""}`}>
//                 <input
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 6,
//                       message: "Password must be at least 6 characters",
//                     },
//                     validate: {
//                       hasNumber: (value) => /[0-9]/.test(value) || "Must contain a number",
//                       hasLetter: (value) => /[a-zA-Z]/.test(value) || "Must contain a letter",
//                     },
//                   })}
//                   type="password"
//                   id="password"
//                   className={styles.input}
//                   aria-invalid={errors.password ? "true" : "false"}
//                   aria-describedby="password-error"
//                   autoComplete="current-password"
//                   placeholder="admin@123.gmail.com"
//                 />
//               </div>
//               {errors.password && (
//                 <span id="password-error" className={styles.errorMessage} role="alert">
//                   <MyIcon
//                     name="warningIcon"
//                     size={16}
//                     color={"red"}
//                     className={errors.password ? styles.warningIcon : ""}
//                   />
//                   {errors.password.message}
//                 </span>
//               )}
//             </div>
//
//             <button
//               className={styles.submitBtn}
//               type="submit"
//               disabled={isSubmitting}
//               aria-busy={isSubmitting}
//             >
//               {isSubmitting ? "Signing In..." : "Sign In"}
//             </button>
//           </form>
//           <span>OR</span>
//           <button type="button" className={styles.googleBtn} onClick={handleGoogleSignIn}>
//             <MyIcon name="google" size={24} color="white" />
//             Sign in with Google
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import styles from "./SignIn.module.scss";
import { MyIcon } from "@/components/icons/MyIcon";

type TFormData = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    setError: setFormError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TFormData>({ mode: "onChange" });

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [session, router]);

  const onSignInSubmit = async (data: TFormData) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setFormError("root", {
          type: "manual",
          message: "Invalid email or password",
        });
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setFormError("root", {
        type: "manual",
        message: "Something went wrong",
      });
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <section className={styles.root} aria-labelledby="signin-title">
      <div className={styles.container}>
        <h1 className="visually-hidden" id="signin-title">
          Sign in Page
        </h1>
        <div className={styles.inner}>
          <div>logo</div>
          <div>
            <p className={styles.subtitle}>
              Use the details provided you by your account administator. Next time you will only
              need the username and the password
            </p>
          </div>

          {errors.root && (
            <div className={styles.errorBanner} role="alert">
              <MyIcon name="warningIcon" size={16} color="red" />
              {errors.root.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSignInSubmit)} className={styles.form}>
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
                  placeholder="admin@123.com"
                />
              </div>
              {errors.email && (
                <span id="email-error" className={styles.errorMessage} role="alert">
                  <MyIcon
                    name="warningIcon"
                    size={16}
                    className={errors.password ? styles.warningIcon : ""}
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
                  autoComplete="current-password"
                  placeholder="admin@123.gmail.com"
                />
              </div>
              {errors.password && (
                <span id="password-error" className={styles.errorMessage} role="alert">
                  <MyIcon
                    name="warningIcon"
                    size={16}
                    color={"red"}
                    className={errors.password ? styles.warningIcon : ""}
                  />
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              className={styles.submitBtn}
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <span>OR</span>
          <button type="button" className={styles.googleBtn} onClick={handleGoogleSignIn}>
            <MyIcon name="google" size={24} color="white" />
            Sign in with Google
          </button>

          <p className={styles.footerText}>
            Don't have an account?{" "}
            <Link href="/signup" className={styles.link}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
