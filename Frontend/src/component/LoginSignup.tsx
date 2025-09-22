import { useState } from "react";
import type { ChangeEvent, MouseEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginSignup.css";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { updateField, register, login } from "../feature/authReducer/AuthSlice";
import { useAuthMutation } from "../tanstack/mutation/auth";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const LoginSignup = ({ type }: { type: "signup" | "signin" }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [signinMutation, signupMutation] = useAuthMutation();

  const [isLoading, setIsLoading] = useState(false);

  async function sendRequest() {
    setIsLoading(true);

    try {
      if (type === "signup") {
        if ((auth as any).password !== (auth as any).confirmPassword) {
          alert("Passwords do not match");
          setIsLoading(false);
          return;
        }

        const payload = {
          username: auth.username,
          fullName: auth.fullName,
          email: auth.email,
          password: (auth as any).password,
        };

        signupMutation.mutate(payload, {
          onSuccess: (data) => {
            dispatch(register(data.user));
            setIsLoading(false);
            navigate("/");
          },
          onError: (error: any) => {
            alert(error.response?.data?.message || "Error during signup");
            setIsLoading(false);
          },
        });
      } else {
        const identifier = auth.username || auth.email;
        if (!identifier || !(auth as any).password) {
          alert("Please enter username/email and password");
          setIsLoading(false);
          return;
        }

        const payload =
          auth.username && auth.username.trim() !== ""
            ? { username: auth.username, password: (auth as any).password }
            : { email: auth.email, password: (auth as any).password };

        signinMutation.mutate(payload, {
          onSuccess: (data) => {
            dispatch(login(data.user));
            setIsLoading(false);
            navigate("/");
          },
          onError: (error: any) => {
            alert(error.response?.data?.message || "Error during signin");
            setIsLoading(false);
          },
        });
      }
    } catch (e) {
      console.log(e);
      alert("Error while signing in/up");
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen w-full flex justify-center flex-col">
      <div className="flex justify-center">
        <div style={{ minHeight: "20em", minWidth: "18em" }}>
          <div className="px-10 text-center">
            <div className="text-3xl font-extrabold">
              {type === "signin" ? "Welcome back" : "Create an account"}
            </div>
            <div className="text-gray-500 text-center">
              {type === "signin"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              &nbsp;
              <button
                disabled={isLoading}
                className={`pl-2 text-white underline ${isLoading ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                onClick={() =>
                  navigate(type === "signin" ? "/auth" : "/auth/login")
                }
              >
                {type === "signin" ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>

          <div className="pt-3">
            {type === "signup" ? (
              <>
                <LabelledInput
                  label="Username"
                  placeholder="Username"
                  value={auth.username || ""}
                  onChange={(e) =>
                    dispatch(
                      updateField({
                        field: "username",
                        value: e.target.value,
                      })
                    )
                  }
                />
                <LabelledInput
                  label="First Name"
                  placeholder="John"
                  value={auth.fullName?.firstName || ""}
                  onChange={(e) =>
                    dispatch(
                      updateField({
                        field: "firstName",
                        value: e.target.value,
                      })
                    )
                  }
                />
                <LabelledInput
                  label="Last Name"
                  placeholder="Doe"
                  value={auth.fullName?.lastName || ""}
                  onChange={(e) =>
                    dispatch(
                      updateField({
                        field: "lastName",
                        value: e.target.value,
                      })
                    )
                  }
                />
                <LabelledInput
                  label="Email"
                  placeholder="sarang@example.com"
                  value={auth.email || ""}
                  onChange={(e) =>
                    dispatch(
                      updateField({
                        field: "email",
                        value: e.target.value,
                      })
                    )
                  }
                />
                <LabelledInput
                  label="Password"
                  type="password"
                  placeholder="******"
                  value={(auth as any).password || ""}
                  onChange={(e) =>
                    dispatch(
                      updateField({
                        field: "password",
                        value: e.target.value,
                      })
                    )
                  }
                />
                <LabelledInput
                  label="Confirm Password"
                  type="password"
                  placeholder="******"
                  value={(auth as any).confirmPassword || ""}
                  onChange={(e) =>
                    dispatch(
                      updateField({
                        field: "confirmPassword",
                        value: e.target.value,
                      })
                    )
                  }
                />
              </>
            ) : (
              <>
                <LabelledInput
                  label="Username / Email"
                  placeholder="user1 / demo@example.com"
                  value={auth.email || auth.username || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

                    if (isEmail) {
                      dispatch(updateField({ field: "email", value }));
                      dispatch(updateField({ field: "username", value: "" }));
                    } else {
                      dispatch(updateField({ field: "username", value }));
                      dispatch(updateField({ field: "email", value: "" }));
                    }
                  }}
                />
                <LabelledInput
                  label="Password"
                  type="password"
                  placeholder="Secret123!"
                  value={(auth as any).password || ""}
                  onChange={(e) =>
                    dispatch(
                      updateField({
                        field: "password",
                        value: e.target.value,
                      })
                    )
                  }
                />
              </>
            )}

            <LoadingButton
              sendRequest={sendRequest}
              type={type}
              isLoading={isLoading}
            />
            <GoogleSignInButton
              type={type === "signin" ? "Sign In" : "Sign Up"}
              href={`${BACKEND_URL}/auth/google`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const LabelledInput = ({
  label,
  placeholder,
  value,
  onChange,
  type,
}: LabelledInputType) => {
  return (
    <div>
      <label
        style={{ padding: "0.5em 0em" }}
        className="block mb-2 ml-2 text-sm text-white font-semibold"
      >
        {label}
      </label>
      <input
        value={value}
        style={{ padding: "0.5em" }}
        onChange={onChange}
        type={type || "text"}
        className="bg-blue-50 text-black border border-gray-300 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full px-8"
        placeholder={placeholder}
        required
      />
    </div>
  );
};

const LoadingButton = ({
  sendRequest,
  isLoading,
  type,
}: {
  sendRequest: MouseEventHandler<HTMLButtonElement>;
  isLoading: boolean;
  type: string;
}) => {
  return (
    <button
      onClick={sendRequest}
      style={{ padding: "0.5em", marginTop: "0.5em" }}
      type="button"
      className="mt-3 relative w-full cursor-pointer text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 flex items-center justify-center"
    >
      {isLoading ? (
        <svg
          aria-hidden="true"
          style={{ marginRight: "0.3em" }}
          className="w-4 h-4 animate-spin mr-2 text-gray-200 fill-white"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 
              50 100.591C22.3858 100.591 0 78.2051 
              0 50.5908C0 22.9766 22.3858 0.59082 
              50 0.59082C77.6142 0.59082 100 22.9766 
              100 50.5908ZM9.08144 50.5908C9.08144 
              73.1895 27.4013 91.5094 50 91.5094C72.5987 
              91.5094 90.9186 73.1895 90.9186 
              50.5908C90.9186 27.9921 72.5987 
              9.67226 50 9.67226C27.4013 9.67226 
              9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 
              97.8624 35.9116 97.0079 33.5539C95.2932 
              28.8227 92.871 24.3692 89.8167 
              20.348C85.8452 15.1192 80.8826 
              10.7238 75.2124 7.41289C69.5422 
              4.10194 63.2754 1.94025 56.7698 
              1.05124C51.7666 0.367541 46.6976 
              0.446843 41.7345 1.27873C39.2613 
              1.69328 37.813 4.19778 38.4501 
              6.62326C39.0873 9.04874 41.5694 
              10.4717 44.0505 10.1071C47.8511 
              9.54855 51.7191 9.52689 55.5402 
              10.0491C60.8642 10.7766 65.9928 
              12.5457 70.6331 15.2552C75.2735 
              17.9648 79.3347 21.5619 82.5849 
              25.841C84.9175 28.9121 86.7997 
              32.2913 88.1811 35.8758C89.083 
              38.2158 91.5421 39.6781 93.9676 
              39.0409Z"
            fill="currentFill"
          />
        </svg>
      ) : null}
      {type === "signup" ? "Sign up" : "Sign in"}
    </button>
  );
};

type GoogleSignInButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  loading?: boolean;
  ariaLabel?: string;
  className?: string;
  type?: string
};

function GoogleSignInButton({
  onClick,
  href,
  loading = false,
  ariaLabel = "Sign in with Google",
  className = "",
  type = "sign up"
}: GoogleSignInButtonProps) {
  const content = (
    <>
      <span className="g-icon" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" focusable="false">
          <path fill="#fbc02d" d="M43.6 20.3h-2.1V20H24v8h11.3C33.2 33.9 29 36 24 36c-7.2 0-13.3-5-15.5-11.7H5.6v7.4C8 41.5 15.5 46 24 46c9.4 0 17.3-6.4 19.6-15.1 1.1-4.2 1.1-8.6-.1-10.6z" />
          <path fill="#e53935" d="M6.5 14.3l6 4.4C14 16.1 18.7 13 24 13c4.2 0 8 .9 10.9 2.5l5.8-5.6C36.5 6.1 30.8 4 24 4 15.5 4 8.9 8.8 6.5 14.3z" />
          <path fill="#4caf50" d="M24 46c6.8 0 12.4-2.7 16.6-7.3l-8-6.3c-2.3 1.5-5.2 2.4-8.6 2.4-5 0-9.2-2.1-12.1-5.4l-7.1 5.5C8.7 40.7 15.5 46 24 46z" />
          <path fill="#1565c0" d="M43.6 20.3H42V20H24v8h11.3c-1.1 3.3-3.3 6.1-6.1 8.1l.1.1 8 6.3C41.2 39.3 46 31.1 46 22c0-1.3-.1-2.6-.4-3.7z" />
        </svg>
      </span>

      <span className="g-label">{loading ? "Signing in…" : `${type} with Google`}</span>

      {loading && (
        <span className="g-spinner" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="rgba(255,255,255,0.6)" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </>
  );

  if (href && !onClick) {
    return (
      <a
        className={`google-signin-button ${className}`}
        href={href}
        aria-label={ariaLabel}
        role="button"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={`google-signin-button ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={loading}
      type="button"
    >
      {content}
    </button>
  );
}
