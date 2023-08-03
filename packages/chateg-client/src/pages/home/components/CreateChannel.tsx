import { FC } from "react";
import InputText from "../../../components/controls/InputText";
import { Formik } from "formik";
import Button from "../../../components/controls/Button";
import Modal from "../../../components/layouts/Modal";

export interface CreateChannelProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateClick: (values: { name: string }) => void | Promise<void>;
}

const CreateChannel: FC<CreateChannelProps> = ({
  isVisible,
  onClose,
  onCreateClick,
}) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <div className="h-full w-full pb-2 md:h-auto md:w-72 md:rounded-lg bg-slate-800 cursor-default">
        <h1 className="p-2 font-semibold text-lg">Создать канал</h1>
        <Formik initialValues={{ name: "" }} onSubmit={onCreateClick}>
          {({ handleSubmit, handleChange, handleBlur, values }) => (
            <form className="p-2 flex flex-col" onSubmit={handleSubmit}>
              <InputText
                label="Имя канала"
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
              />
              <div className="flex flex-col w-full items-stretch pt-10">
                <Button type="submit">Создать канал</Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default CreateChannel;
