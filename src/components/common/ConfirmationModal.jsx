import React from "react";

const ConfirmationModal = ({ isOpen, modalData, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const { heading, paragraph, btn1Name, btn2Name } = modalData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        {/* Heading */}
        {heading && <h2 className="text-2xl font-bold text-gray-800 mb-2">{heading}</h2>}

        {/* Paragraph */}
        {paragraph && <p className="text-gray-600 mb-6">{paragraph}</p>}

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {/* Cancel Button */}
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={onClose}
          >
            {btn1Name || "Cancel"}
          </button>

          {/* Confirm Button */}
          <button
            className="px-4 py-2 rounded bg-[#195A00] text-white hover:bg-[#144500]"
            onClick={() => {
              onConfirm && onConfirm();
              onClose();
            }}
          >
            {btn2Name || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
