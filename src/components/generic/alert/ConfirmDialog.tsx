import React from "react";
import BigTextField from "../BigTextField";

type TextFieldProps = {
  value: string
  onChange: (newValue: string) => void
  placeholder?: string
}

interface ConfirmDialogProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
  textFieldProps?: TextFieldProps
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = (
  { message, onConfirm, onCancel, textFieldProps }
) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="p-6 bg-white rounded shadow-lg w-full max-w-sm">
        <p className="mb-4 text-center text-gray-800">{message}</p>
        { textFieldProps && (
          <BigTextField
            value={textFieldProps.value}
            onValueChange={textFieldProps.onChange}
            placeholder={textFieldProps.placeholder}
            className="bg-light_grey_active w-full"
          />
        )}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
