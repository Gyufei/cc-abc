'use client';

import { useState } from 'react';

import TriangleDown from '@/components/icons/triangle-down';

import { SlippageConfigModal } from './slippage-config-modal';

interface WarnSlippageToleranceProps {
  slippageData: {
    truncateSlippageChecked: boolean;
    warnSlippageChecked: boolean;
    truncateSlippage: number;
    warnSlippage: number;
  };
  onSlippageDataChange: (slippageData: {
    truncateSlippageChecked: boolean;
    warnSlippageChecked: boolean;
    truncateSlippage: number;
    warnSlippage: number;
  }) => void;
}

export function WarnSlippageTolerance({
  slippageData,
  onSlippageDataChange,
}: WarnSlippageToleranceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlippageData, setCurrentSlippageData] = useState(slippageData);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = (newSlippageData: {
    truncateSlippageChecked: boolean;
    warnSlippageChecked: boolean;
    truncateSlippage: number;
    warnSlippage: number;
  }) => {
    setCurrentSlippageData(newSlippageData);
    onSlippageDataChange(newSlippageData);
  };

  return (
    <>
      <div onClick={handleOpenModal} className="flex items-center gap-x-2 text-sm cursor-pointer">
        <span className="text-ui-fg-disabled">Slippage tolerance</span>
        <div className="flex items-center gap-1">
          {!currentSlippageData.truncateSlippageChecked &&
            !currentSlippageData.warnSlippageChecked && (
              <span className="text-ui-fg-base">Not Open</span>
            )}
          {currentSlippageData.truncateSlippageChecked && (
            <span className="text-ui-fg-base">{currentSlippageData.truncateSlippage}%</span>
          )}
          {currentSlippageData.warnSlippageChecked && (
            <span className="text-ui-fg-base">{currentSlippageData.warnSlippage}%</span>
          )}
          <TriangleDown />
        </div>
      </div>

      <SlippageConfigModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        initialSlippageData={currentSlippageData}
      />
    </>
  );
}
