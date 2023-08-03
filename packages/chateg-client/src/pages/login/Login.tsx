import { FC, useState } from "react";
import BlockInCentre from "../../components/layouts/BlockInCentre";
import InputText from "../../components/controls/InputText";
import Button from "../../components/controls/Button";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { object as YupObject, string } from "yup";
import { useAuth } from "../../features/auth/useAuth";
import FieldErrorMessage from "../../components/controls/FieldErrorMessage";

const Login: FC = () => {
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string>("");
  const navigate = useNavigate();

  const validationSchema = YupObject().shape({
    login: string().required("Обязательное поле"),
    password: string().required("Обязательное поле"),
  });

  return (
    <BlockInCentre>
      <div className="h-full w-full pb-2 md:h-auto md:w-72 md:rounded-lg bg-slate-800">
        <h1 className="p-2 font-semibold text-lg">Вход в систему</h1>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            login: "",
            password: "",
          }}
          onSubmit={async (values) => {
            try {
              console.log(values);
              await login(values);
              navigate("/main", { replace: true });
            } catch (error) {
              setLoginError((error as object).toString());
              console.error(error);
            }
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
          }) => {
            const isSubmitButtonDisabled =
              Object.keys(errors).length > 0 ||
              (!values.login && !values.password);

            return (
              <form className="p-2 flex flex-col" onSubmit={handleSubmit}>
                <InputText
                  label="Логин"
                  name="login"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.login}
                />
                {touched.login && errors.login && (
                  <FieldErrorMessage message={errors.login} />
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
                {loginError && <FieldErrorMessage message={loginError} />}
                <div className="flex flex-col w-full items-stretch pt-10">
                  <Button type="submit" disabled={isSubmitButtonDisabled}>
                    Вход
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

export default Login;
