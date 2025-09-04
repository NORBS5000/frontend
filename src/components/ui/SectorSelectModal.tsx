import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

interface SectorSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SectorSelectModal: React.FC<SectorSelectModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSectorSelect = (sector: 'formal' | 'informal') => {
    onClose();
    navigate(`/loan/request/${sector}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Your Sector">
      <div className="space-y-4">
        <p className="text-gray-600 mb-6">
          Are you from the Formal or Informal sector?
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => handleSectorSelect('formal')}
            className="w-full p-4 text-left border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="font-medium text-gray-900">Formal Sector</div>
            <div className="text-sm text-gray-500">
              Employed with regular salary and bank statements
            </div>
          </button>
          
          <button
            onClick={() => handleSectorSelect('informal')}
            className="w-full p-4 text-left border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="font-medium text-gray-900">Informal Sector</div>
            <div className="text-sm text-gray-500">
              Self-employed or irregular income
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SectorSelectModal;