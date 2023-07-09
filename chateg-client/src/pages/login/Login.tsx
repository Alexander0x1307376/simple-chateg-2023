import { FC } from "react";
import BlockInCentre from "../../components/layouts/BlockInCentre";
import InputText from "../../components/controls/InputText";
import Button from "../../components/controls/Button";

const Login: FC = () => {
  return (
    <BlockInCentre>
      <div className="h-full w-full pb-2 md:h-auto md:w-72 md:rounded-lg bg-slate-800">
        <h1 className="p-2 font-semibold text-lg">Вход в систему</h1>
        <div className="p-2 flex flex-col">
          <InputText label="Логин" name="login" />
          <InputText label="Пароль" name="password" htmlType="password" />
          <div className="flex flex-col w-full items-stretch pt-10">
            <Button>Вход</Button>
          </div>
        </div>
      </div>
    </BlockInCentre>
  );
};

export default Login;
