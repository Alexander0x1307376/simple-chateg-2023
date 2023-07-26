import { FC, useCallback, useState, useMemo } from "react";
import BlockInCentre from "../../components/layouts/BlockInCentre";
import InputText from "../../components/controls/InputText";
import Button from "../../components/controls/Button";
import { debounceAsync } from "../../features/utils/debounce";
import httpClientWithAuth from "../../features/http/httpClient";
import InputTextWithConfirm from "../../components/controls/InputTextWithConfirm";
import { Formik } from "formik";
import FieldErrorMessage from "../../components/controls/FieldErrorMessage";
import { object as YupObject, string, ref } from "yup";
import { useAuth } from "../../features/auth/useAuth";
import { useNavigate } from "react-router-dom";

const Register: FC = () => {
  const navigate = useNavigate();
  const [isNameUnique, setIsNameUnique] = useState<boolean>(false);
  const { register } = useAuth();

  const debounceFn = useMemo(() => {
    return debounceAsync(async (value: string) => {
      if (!value) return;
      const isUnique = (
        await httpClientWithAuth.post<boolean>("/checkNameUniqueness", {
          name: value,
        })
      ).data;
      setIsNameUnique(isUnique);
    }, 300);
  }, []);

  const debounceCallback = useCallback(
    (val: string) => debounceFn(val),
    [debounceFn]
  );

  const handleNameFieldChange = (value: string) => {
    debounceCallback(value);
  };

  const validationSchema = YupObject().shape({
    name: string().required("Обязательное поле"),
    password: string()
      .required("Обязательное поле")
      .min(4, "Минимум 4 символа"),
    passwordConfirm: string()
      .oneOf(
        [ref("password")],
        "Пароль и подтверждение пароля должны совпадать"
      )
      .required("Обязательное поле")
      .min(4, "Минимум 4 символа"),
  });

  return (
    <BlockInCentre>
      <div className="h-full w-full pb-2 md:h-auto md:w-72 md:rounded-lg bg-slate-800">
        <h1 className="p-2 font-semibold text-lg">Регистрация</h1>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            name: "",
            password: "",
            passwordConfirm: "",
          }}
          onSubmit={async (values) => {
            if (isNameUnique) {
              try {
                await register(values);
                navigate("/");
              } catch (error) {
                console.error(error);
              }
            }
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
            setTouched,
          }) => {
            const isRegButtonDisabled =
              Object.keys(errors).length > 0 || !isNameUnique;

            return (
              <form className="p-2 flex flex-col" onSubmit={handleSubmit}>
                <InputTextWithConfirm
                  label="Имя"
                  name="name"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleNameFieldChange(e.target.value);
                    handleChange(e);
                    setTouched({ ...touched, name: true });
                  }}
                  value={values.name}
                  marker={((): "hidden" | "success" | "error" => {
                    if (values.name && touched.name)
                      return isNameUnique ? "success" : "error";
                    else return "hidden";
                  })()}
                />
                {touched.name && errors.name && (
                  <FieldErrorMessage message={errors.name} />
                )}
                <InputText
                  label="Пароль"
                  name="password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                />
                {touched.password && errors.password && (
                  <FieldErrorMessage message={errors.password} />
                )}
                <InputText
                  label="Подтвердите пароль"
                  name="passwordConfirm"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.passwordConfirm}
                />
                {touched.passwordConfirm && errors.passwordConfirm && (
                  <FieldErrorMessage message={errors.passwordConfirm} />
                )}
                <div className="flex flex-col w-full items-stretch pt-10">
                  <Button type="submit" disabled={isRegButtonDisabled}>
                    Регистрация
                  </Button>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </BlockInCentre>
  );
};

export default Register;
